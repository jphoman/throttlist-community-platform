import React, { useState } from 'react'
import { View, Text, StyleSheet, FlatList, Pressable, Platform } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { TrendingUp, Compass, Tag } from '@blinkdotnew/mobile-ui'
import { blink } from '@/lib/blink'
import { colors, formatFollowers } from '@/constants/throttlist'
import BuildCard from '@/components/BuildCard'
import type { Build, Tag as TagType } from '@/types'

async function fetchBuilds(): Promise<Build[]> {
  const builds = await blink.db.builds.list({
    where: { status: 'active' },
    orderBy: { followerCount: 'desc' },
    limit: 20,
  }) as Build[]

  const userIds = [...new Set(builds.map(b => b.userId))]
  const users = await Promise.all(userIds.map(id => blink.db.users.get(id)))
  const userMap: Record<string, any> = {}
  users.forEach(u => { if (u) userMap[u.id] = u })

  return builds.map(b => ({
    ...b,
    username: userMap[b.userId]?.username,
    displayName: userMap[b.userId]?.displayName,
    avatarUrl: userMap[b.userId]?.avatarUrl,
  }))
}

async function fetchTrendingTags(): Promise<TagType[]> {
  return await blink.db.tags.list({
    orderBy: { followerCount: 'desc' },
    limit: 10,
  }) as TagType[]
}

export default function DiscoverScreen() {
  const [followedBuilds, setFollowedBuilds] = useState<Set<string>>(new Set())

  const { data: builds = [], isLoading } = useQuery({
    queryKey: ['discover-builds'],
    queryFn: fetchBuilds,
  })

  const { data: tags = [] } = useQuery({
    queryKey: ['trending-tags'],
    queryFn: fetchTrendingTags,
  })

  function toggleFollow(buildId: string) {
    setFollowedBuilds(prev => {
      const next = new Set(prev)
      if (next.has(buildId)) next.delete(buildId)
      else next.add(buildId)
      return next
    })
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Compass size={20} color={colors.accent} />
        <Text style={styles.headerTitle}>Discover</Text>
      </View>

      <FlatList
        data={builds}
        keyExtractor={b => b.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            {/* Trending Tags */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <TrendingUp size={16} color={colors.accent} />
                <Text style={styles.sectionTitle}>Trending Tags</Text>
              </View>
              <View style={styles.tagGrid}>
                {tags.map(tag => (
                  <Pressable
                    key={tag.name}
                    style={styles.tagCard}
                    onPress={() => router.push(`/tag/${tag.name}`)}
                  >
                    <Tag size={14} color={colors.accent} />
                    <Text style={styles.tagName}>#{tag.name}</Text>
                    <Text style={styles.tagStat}>{formatFollowers(tag.buildCount)} builds</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Trending builds header */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <TrendingUp size={16} color={colors.accent} />
                <Text style={styles.sectionTitle}>Trending Builds</Text>
              </View>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.buildCardWrap}>
            <BuildCard
              build={item}
              isFollowing={followedBuilds.has(item.id)}
              onFollow={() => toggleFollow(item.id)}
              onPress={() => {
                if (item.username && item.slug) {
                  router.push(`/build/${item.username}/${item.slug}`)
                }
              }}
            />
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 54 : 16,
    paddingBottom: 14,
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  list: {
    paddingBottom: 32,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagCard: {
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    minWidth: 100,
    gap: 4,
  },
  tagName: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  tagStat: {
    color: colors.textTertiary,
    fontSize: 11,
  },
  buildCardWrap: {
    paddingHorizontal: 16,
  },
})
