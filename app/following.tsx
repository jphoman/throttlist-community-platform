import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  TextInput,
  Dimensions,
} from 'react-native'
import { router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Search, X } from '@/components/Icons'
import { listFollowingBuilds, listBuilds, listUsers } from '@/lib/data'
import { colors, MOCK_USER_ID } from '@/constants/throttlist'
import BuildTile from '@/components/BuildTile'
import type { Build } from '@/types'

const SCREEN_W = Dimensions.get('window').width
const TILE_SIZE = Math.floor(SCREEN_W / 3)

async function fetchFollowingData() {
  const [followed, allBuilds, allUsers] = await Promise.all([
    listFollowingBuilds(MOCK_USER_ID),
    listBuilds({ status: 'active' }),
    listUsers(),
  ])
  const userMap = Object.fromEntries(allUsers.map(u => [u.id, u]))
  const allWithUser = allBuilds.map(b => ({
    ...b,
    username: userMap[b.userId]?.username,
    displayName: userMap[b.userId]?.displayName,
    avatarUrl: userMap[b.userId]?.avatarUrl,
    ownerIsPro: parseInt(userMap[b.userId]?.proTier as string) >= 1,
  }))
  return { followed, allWithUser }
}

export default function FollowingScreen() {
  const [query, setQuery] = useState('')
  const [localFollowed, setLocalFollowed] = useState<Set<string> | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['following-screen', MOCK_USER_ID],
    queryFn: fetchFollowingData,
  })

  const followedBuilds = data?.followed ?? []
  const allBuilds = data?.allWithUser ?? []

  const followedIds: Set<string> = useMemo(() => {
    if (localFollowed !== null) return localFollowed
    return new Set(followedBuilds.map(b => b.id))
  }, [localFollowed, followedBuilds])

  function toggleFollow(buildId: string) {
    setLocalFollowed(prev => {
      const base = prev ?? new Set(followedBuilds.map(b => b.id))
      const next = new Set(base)
      if (next.has(buildId)) next.delete(buildId)
      else next.add(buildId)
      return next
    })
  }

  const q = query.trim().toLowerCase()

  const currentFollowed: Build[] = useMemo(
    () => allBuilds.filter(b => followedIds.has(b.id)),
    [allBuilds, followedIds],
  )

  const filteredFollowed: Build[] = useMemo(() => {
    if (!q) return currentFollowed
    return currentFollowed.filter(
      b =>
        b.nickname?.toLowerCase().includes(q) ||
        b.make?.toLowerCase().includes(q) ||
        b.model?.toLowerCase().includes(q),
    )
  }, [currentFollowed, q])

  const discoverBuilds: Build[] = useMemo(() => {
    if (!q) return []
    const unfollowed = allBuilds.filter(b => !followedIds.has(b.id) && b.userId !== MOCK_USER_ID)
    const matched = unfollowed.filter(
      b =>
        b.nickname?.toLowerCase().includes(q) ||
        b.make?.toLowerCase().includes(q) ||
        b.model?.toLowerCase().includes(q),
    )
    return matched.sort((a, b) => b.followerCount - a.followerCount).slice(0, 10)
  }, [allBuilds, followedIds, q])

  const showDiscover = discoverBuilds.length > 0
  const showFollowed = filteredFollowed.length > 0
  const showEmpty = !isLoading && !showFollowed && !showDiscover

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.textSecondary} />
        </Pressable>
        <Text style={styles.headerTitle}>Following</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Search size={16} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search builds..."
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <X size={14} color={colors.textTertiary} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Loading…</Text>
          </View>
        ) : showEmpty ? (
          <View style={styles.empty}>
            {q ? (
              <>
                <Text style={styles.emptyText}>No results for "{query}"</Text>
                <Text style={styles.emptySubText}>Try a different make, model, or build name.</Text>
              </>
            ) : (
              <>
                <Text style={styles.emptyText}>You're not following any builds yet.</Text>
                <Text style={styles.emptySubText}>Search above to find builds to follow.</Text>
              </>
            )}
          </View>
        ) : !q ? (
          /* Browse mode — 3-column grid */
          <View style={styles.grid}>
            {currentFollowed.map(build => (
              <BuildTile
                key={build.id}
                build={build}
                size={TILE_SIZE}
                onPress={() => router.push(`/build/${build.username ?? ''}/${build.slug}`)}
              />
            ))}
          </View>
        ) : (
          /* Search mode — horizontal scroll sections */
          <View style={styles.sections}>
            {showFollowed && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                  FOLLOWING ({filteredFollowed.length})
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.tileRow}
                >
                  {filteredFollowed.map(build => (
                    <BuildTile
                      key={build.id}
                      build={build}
                      size={120}
                      onPress={() => router.push(`/build/${build.username ?? ''}/${build.slug}`)}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {showDiscover && (
              <View style={[styles.section, showFollowed && styles.sectionGap]}>
                <Text style={styles.sectionLabel}>DISCOVER</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.tileRow}
                >
                  {discoverBuilds.map(build => (
                    <BuildTile
                      key={build.id}
                      build={build}
                      size={120}
                      isFollowing={followedIds.has(build.id)}
                      onFollow={() => toggleFollow(build.id)}
                      onPress={() => router.push(`/build/${build.username ?? ''}/${build.slug}`)}
                    />
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        )}
        <View style={{ height: 48 }} />
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 54 : 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  backBtn: { padding: 4, width: 44 },
  searchWrap: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: colors.surface2,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    padding: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sections: {
    padding: 16,
  },
  section: {},
  sectionGap: {
    marginTop: 24,
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  tileRow: {
    gap: 0,
    flexDirection: 'row',
  },
  empty: {
    padding: 48,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
  },
  emptySubText: {
    color: colors.textTertiary,
    fontSize: 13,
    textAlign: 'center',
  },
})
