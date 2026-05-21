import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  TextInput,
  Image,
  Dimensions,
} from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Search, Tag, MessageCircle, Heart, TrendingUp, ProBadge } from '@/components/Icons'
import { listBuilds, listUsers, listTags, listPosts, MOCK_PARTS, MOCK_COMMENTS, isProUser } from '@/lib/data'
import { colors, formatFollowers, MOCK_USER_ID } from '@/constants/throttlist'
import InitialsAvatar from '@/components/InitialsAvatar'
import type { Post } from '@/types'

const SCREEN_WIDTH = Dimensions.get('window').width
const GRID_GAP = 2
const GRID_ITEM_SIZE = (SCREEN_WIDTH - GRID_GAP * 2) / 3
const BUILD_SCROLL_SIZE = Math.round(SCREEN_WIDTH * 0.42)

type PostSort = 'trending' | 'recent' | 'discussed'

const SORT_OPTIONS: { key: PostSort; label: string }[] = [
  { key: 'trending', label: 'Trending' },
  { key: 'recent', label: 'Recent' },
  { key: 'discussed', label: 'Most Discussed' },
]

async function fetchDiscover() {
  const [builds, users, tags, posts] = await Promise.all([
    listBuilds({ status: 'active' }),
    listUsers(),
    listTags(),
    listPosts({ limit: 20 }),
  ])
  const userMap = Object.fromEntries(users.map(u => [u.id, u]))

  const enrichedBuilds = [...builds]
    .sort((a, b) => b.followerCount - a.followerCount)
    .slice(0, 20)
    .map(b => ({ ...b, username: userMap[b.userId]?.username }))

  const sortedTags = [...tags].sort((a, b) => b.followerCount - a.followerCount).slice(0, 12)
  const recommendedUsers = users.filter(u => u.id !== MOCK_USER_ID).slice(0, 8)

  return { builds: enrichedBuilds, tags: sortedTags, posts, recommendedUsers }
}

export default function DiscoverScreen() {
  const [query, setQuery] = useState('')
  const [postSort, setPostSort] = useState<PostSort>('trending')

  const { data } = useQuery({
    queryKey: ['discover-all'],
    queryFn: fetchDiscover,
  })

  const builds = data?.builds ?? []
  const tags = data?.tags ?? []
  const posts = data?.posts ?? []
  const recommendedUsers = data?.recommendedUsers ?? []

  const q = query.trim().toLowerCase()
  const isSearching = q.length > 0

  const filteredBuilds = useMemo(() => {
    if (!q) return builds
    return builds.filter(b =>
      b.nickname?.toLowerCase().includes(q) ||
      b.make?.toLowerCase().includes(q) ||
      b.model?.toLowerCase().includes(q) ||
      (b as any).username?.toLowerCase().includes(q),
    )
  }, [builds, q])

  const filteredTags = useMemo(() => {
    if (!q) return tags
    return tags.filter(t => t.name.toLowerCase().includes(q))
  }, [tags, q])

  const filteredPosts = useMemo(() => {
    let result = q
      ? posts.filter(p =>
          p.username?.toLowerCase().includes(q) ||
          p.buildNickname?.toLowerCase().includes(q),
        )
      : [...posts]

    if (postSort === 'trending') result.sort((a, b) => b.likeCount - a.likeCount)
    else if (postSort === 'recent') result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    else if (postSort === 'discussed') result.sort((a, b) => b.commentCount - a.commentCount)

    return result
  }, [posts, q, postSort])

  return (
    <View style={styles.container}>

      {/* Search bar — always pinned above scroll */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Search size={16} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search builds, makes, riders…"
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/*
        Three direct children of ScrollView:
          [0] collapsible content (users + builds + tags) — scrolls away
          [1] sort bar — stays pinned via stickyHeaderIndices={[1]}
          [2] posts grid — scrolls under the sort bar
      */}
      <ScrollView
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* [0] Collapses on scroll */}
        <View>
          {/* Recommended users — horizontal scroll */}
          {!isSearching && recommendedUsers.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.usersRow}
            >
              {recommendedUsers.map(user => (
                <Pressable
                  key={user.id}
                  style={styles.userItem}
                  onPress={() => router.push(`/user/${user.username}`)}
                >
                  <InitialsAvatar name={user.displayName} photoUrl={user.avatarUrl} size={58} />
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={styles.userHandle} numberOfLines={1}>@{user.username}</Text>
                    {isProUser(user.username) && <ProBadge size={11} />}
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          )}

          {/* Trending builds — single-row horizontal scroll */}
          {filteredBuilds.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.buildsRow}
            >
              {filteredBuilds.map(build => {
                const tagCount = MOCK_PARTS.filter(p => p.buildId === build.id).length
                const commentCount = MOCK_COMMENTS.filter(c => c.targetId === build.id).length
                return (
                  <Pressable
                    key={build.id}
                    style={styles.buildItem}
                    onPress={() => {
                      if ((build as any).username && build.slug) {
                        router.push(`/build/${(build as any).username}/${build.slug}`)
                      }
                    }}
                  >
                    {build.coverPhotoUrl ? (
                      <Image source={{ uri: build.coverPhotoUrl }} style={styles.buildPhoto} resizeMode="cover" />
                    ) : (
                      <View style={[styles.buildPhoto, styles.fallback]} />
                    )}
                    <View style={styles.trendingBadge} pointerEvents="none">
                      <TrendingUp size={11} color="#fff" />
                    </View>
                    <View style={styles.gridOverlay} pointerEvents="none">
                      <View style={styles.gridStat}>
                        <Tag size={11} color="#fff" />
                        <Text style={styles.gridStatText}>{tagCount}</Text>
                      </View>
                      <View style={styles.gridStat}>
                        <MessageCircle size={11} color="#fff" />
                        <Text style={styles.gridStatText}>{commentCount}</Text>
                      </View>
                    </View>
                  </Pressable>
                )
              })}
            </ScrollView>
          )}

          {/* Trending tags */}
          {filteredTags.length > 0 && (
            <View style={styles.tagsWrap}>
              {filteredTags.map(tag => (
                <Pressable
                  key={tag.name}
                  style={styles.tagPill}
                  onPress={() => router.push(`/tag/${tag.name}`)}
                >
                  <Text style={styles.tagPillName}>#{tag.name}</Text>
                  <Text style={styles.tagPillCount}>{tag.buildCount}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* [1] Sticky sort bar */}
        <View style={styles.sortBarSticky}>
          {SORT_OPTIONS.map(opt => (
            <Pressable
              key={opt.key}
              style={[styles.sortBtn, postSort === opt.key && styles.sortBtnActive]}
              onPress={() => setPostSort(opt.key)}
            >
              <Text style={[styles.sortBtnText, postSort === opt.key && styles.sortBtnTextActive]}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* [2] Posts grid — scrolls up under the sort bar */}
        <View style={styles.photoGrid}>
          {filteredPosts.map(post => {
            const photos: string[] = (() => { try { return JSON.parse(post.photos) } catch { return [] } })()
            const taggedIds: string[] = (() => { try { return JSON.parse(post.taggedPartIds) } catch { return [] } })()
            const thumb = photos[0]
            return (
              <Pressable
                key={post.id}
                style={styles.gridItem}
                onPress={() => {
                  if (post.username && post.buildSlug) {
                    router.push(`/build/${post.username}/${post.buildSlug}`)
                  }
                }}
              >
                {thumb ? (
                  <Image source={{ uri: thumb }} style={styles.gridPhoto} resizeMode="cover" />
                ) : (
                  <View style={[styles.gridPhoto, styles.fallback]} />
                )}
                <View style={styles.gridOverlay} pointerEvents="none">
                  <View style={styles.gridStat}>
                    <Tag size={11} color="#fff" />
                    <Text style={styles.gridStatText}>{taggedIds.length}</Text>
                  </View>
                  <View style={styles.gridStat}>
                    <Heart size={11} color="#fff" />
                    <Text style={styles.gridStatText}>{formatFollowers(post.likeCount)}</Text>
                  </View>
                  <View style={styles.gridStat}>
                    <MessageCircle size={11} color="#fff" />
                    <Text style={styles.gridStatText}>{post.commentCount}</Text>
                  </View>
                </View>
              </Pressable>
            )
          })}

          {isSearching && filteredPosts.length === 0 && (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No results for "{query}"</Text>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 54 : 16,
    paddingBottom: 12,
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.surface2,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    padding: 0,
    margin: 0,
  },
  scroll: {},
  // Users
  usersRow: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 20,
    flexDirection: 'row',
  },
  userItem: {
    alignItems: 'center',
    gap: 6,
    width: 68,
  },
  userHandle: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
    width: 68,
  },
  // Builds horizontal scroll
  buildsRow: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingBottom: 4,
    gap: 8,
    flexDirection: 'row',
  },
  buildItem: {
    width: BUILD_SCROLL_SIZE,
    height: BUILD_SCROLL_SIZE,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  buildPhoto: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface2,
  },
  trendingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 4,
  },
  // Tags
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.surface2,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagPillName: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  tagPillCount: {
    color: colors.textTertiary,
    fontSize: 10,
  },
  // Sticky sort bar
  sortBarSticky: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sortBtn: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.surface2,
  },
  sortBtnActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  sortBtnText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  sortBtnTextActive: {
    color: '#fff',
  },
  // Posts photo grid
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    position: 'relative',
  },
  gridPhoto: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface2,
  },
  fallback: {
    backgroundColor: '#1C1C1C',
  },
  gridOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 6,
    paddingVertical: 5,
    backgroundColor: 'rgba(0,0,0,0.45)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
  },
  gridStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  gridStatText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  noResults: {
    width: SCREEN_WIDTH,
    padding: 40,
    alignItems: 'center',
  },
  noResultsText: {
    color: colors.textTertiary,
    fontSize: 14,
  },
})
