import React, { useState } from 'react'
import { View, Text, StyleSheet, Pressable, FlatList, Platform } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Hash } from '@/components/Icons'
import { listBuilds, listUsers, getTag } from '@/lib/data'
import { colors, formatFollowers } from '@/constants/throttlist'
import BuildCard from '@/components/BuildCard'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { Build, Tag as TagType } from '@/types'

async function fetchTagData(name: string) {
  const [tag, allBuilds, allUsers] = await Promise.all([
    getTag(name),
    listBuilds({ status: 'active' }),
    listUsers(),
  ])

  const userMap = Object.fromEntries(allUsers.map(u => [u.id, u]))

  const taggedBuilds = [...allBuilds]
    .filter(b => {
      try { return JSON.parse(b.tags).includes(name) } catch { return false }
    })
    .sort((a, b) => b.followerCount - a.followerCount)
    .slice(0, 20)
    .map(b => ({
      ...b,
      username: userMap[b.userId]?.username,
    }))

  return { tag, builds: taggedBuilds }
}

export default function TagScreen() {
  const { name } = useLocalSearchParams<{ name: string }>()
  const insets = useSafeAreaInsets()
  const [isFollowing, setIsFollowing] = useState(false)
  const [followedBuilds, setFollowedBuilds] = useState<Set<string>>(new Set())

  const { data, isLoading } = useQuery({
    queryKey: ['tag', name],
    queryFn: () => fetchTagData(name!),
    enabled: !!name,
  })

  const tag = data?.tag
  const builds = data?.builds ?? []

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={builds}
        keyExtractor={b => b.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <Pressable onPress={() => router.back()} style={styles.backBtn}>
                <ArrowLeft size={20} color={colors.textSecondary} />
              </Pressable>
            </View>

            <View style={styles.tagHeader}>
              <View style={styles.tagIconRow}>
                <Hash size={28} color={colors.accent} />
                <Text style={styles.tagName}>{name}</Text>
              </View>
              {tag?.description && (
                <Text style={styles.tagDesc}>{tag.description}</Text>
              )}
              <View style={styles.statsRow}>
                {tag && (
                  <>
                    <View style={styles.stat}>
                      <Text style={styles.statValue}>{formatFollowers(tag.buildCount)}</Text>
                      <Text style={styles.statLabel}>builds</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.stat}>
                      <Text style={styles.statValue}>{formatFollowers(tag.followerCount)}</Text>
                      <Text style={styles.statLabel}>followers</Text>
                    </View>
                  </>
                )}
              </View>
              <Pressable
                style={[styles.followBtn, isFollowing && styles.followBtnActive]}
                onPress={() => setIsFollowing(!isFollowing)}
              >
                <Text style={[styles.followBtnText, isFollowing && styles.followBtnTextActive]}>
                  {isFollowing ? '✓ Following' : `Follow #${name}`}
                </Text>
              </Pressable>
            </View>

            <View style={styles.buildsHeader}>
              <Text style={styles.sectionTitle}>Builds</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.buildWrap}>
            <BuildCard
              build={item}
              isFollowing={followedBuilds.has(item.id)}
              onFollow={() => {
                setFollowedBuilds(prev => {
                  const next = new Set(prev)
                  if (next.has(item.id)) next.delete(item.id)
                  else next.add(item.id)
                  return next
                })
              }}
              onPress={() => {
                if (item.username && item.slug) {
                  router.push(`/build/${item.username}/${item.slug}`)
                }
              }}
            />
          </View>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No builds tagged #{name} yet</Text>
            </View>
          ) : null
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  list: { paddingBottom: 32 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: 4, alignSelf: 'flex-start' },
  tagHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tagIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  tagName: {
    color: colors.accent,
    fontSize: 28,
    fontWeight: '800',
  },
  tagDesc: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stat: { alignItems: 'center', marginRight: 20 },
  statValue: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' },
  statLabel: { color: colors.textTertiary, fontSize: 12, marginTop: 2 },
  statDivider: { width: 1, height: 28, backgroundColor: colors.border, marginRight: 20 },
  followBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  followBtnActive: { backgroundColor: colors.accent },
  followBtnText: { color: colors.accent, fontWeight: '700', fontSize: 14 },
  followBtnTextActive: { color: '#fff' },
  buildsHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 4,
  },
  sectionTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
  buildWrap: { paddingHorizontal: 16 },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { color: colors.textTertiary, fontSize: 14 },
})
