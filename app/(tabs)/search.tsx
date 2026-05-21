import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  Platform,
} from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Search, X } from '@/components/Icons'
import { listBuilds, listUsers, listTags } from '@/lib/data'
import { colors, formatFollowers } from '@/constants/throttlist'
import BuildCard from '@/components/BuildCard'
import type { Build, Tag as TagType } from '@/types'

async function searchAll(query: string) {
  if (!query.trim()) return { builds: [], tags: [] }

  const q = query.toLowerCase()

  const [allBuilds, allTags, allUsers] = await Promise.all([
    listBuilds({ status: 'active' }),
    listTags(),
    listUsers(),
  ])

  const matchedBuilds = allBuilds.filter(
    b =>
      b.nickname?.toLowerCase().includes(q) ||
      b.make?.toLowerCase().includes(q) ||
      b.model?.toLowerCase().includes(q),
  )

  const matchedTags = allTags.filter(t => t.name.toLowerCase().includes(q))

  const userMap = Object.fromEntries(allUsers.map(u => [u.id, u]))

  return {
    builds: matchedBuilds.map(b => ({ ...b, username: userMap[b.userId]?.username })),
    tags: matchedTags,
  }
}

export default function SearchScreen() {
  const [query, setQuery] = useState('')
  const [followedBuilds, setFollowedBuilds] = useState<Set<string>>(new Set())

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchAll(query),
    enabled: query.length > 1,
  })

  const builds = data?.builds ?? []
  const tags = data?.tags ?? []

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
      {/* Search bar */}
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Search size={18} color={colors.textTertiary} />
          <TextInput
            style={styles.input}
            placeholder="Builds, makes, tags..."
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <X size={16} color={colors.textTertiary} />
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={builds}
        keyExtractor={b => b.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          query.length > 1 ? (
            <>
              {tags.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Tags</Text>
                  <View style={styles.tagRow}>
                    {tags.map(tag => (
                      <Pressable
                        key={tag.name}
                        style={styles.tagPill}
                        onPress={() => router.push(`/tag/${tag.name}`)}
                      >
                        <Text style={styles.tagPillText}>#{tag.name}</Text>
                        <Text style={styles.tagPillCount}>{formatFollowers(tag.buildCount)}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
              {builds.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Builds</Text>
                </View>
              )}
              {builds.length === 0 && tags.length === 0 && !isLoading && (
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>No results for "{query}"</Text>
                </View>
              )}
            </>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.buildWrap}>
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
        ListEmptyComponent={
          query.length <= 1 ? (
            <View style={styles.prompt}>
              <Search size={40} color={colors.textTertiary} />
              <Text style={styles.promptText}>Search builds, makes, and tags</Text>
            </View>
          ) : null
        }
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 54 : 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.surface2,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    padding: 0,
  },
  list: {
    paddingBottom: 32,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 4,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    backgroundColor: colors.surface1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagPillText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  tagPillCount: {
    color: colors.textTertiary,
    fontSize: 11,
  },
  buildWrap: {
    paddingHorizontal: 16,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textTertiary,
    fontSize: 14,
  },
  prompt: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 16,
  },
  promptText: {
    color: colors.textTertiary,
    fontSize: 14,
  },
})
