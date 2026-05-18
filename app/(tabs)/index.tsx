import React, { useState, useCallback } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
  Pressable,
} from 'react-native'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Compass } from '@blinkdotnew/mobile-ui'
import { blink } from '@/lib/blink'
import { colors, MOCK_USER_ID } from '@/constants/throttlist'
import PostCard from '@/components/PostCard'
import FeedHeader from '@/components/FeedHeader'
import PartDetailSheet from '@/components/PartDetailSheet'
import type { Post, Part } from '@/types'

// Fetch all posts with build + user info (simulated join via separate queries)
async function fetchFeedPosts(): Promise<Post[]> {
  const posts = await blink.db.posts.list({ orderBy: { createdAt: 'desc' }, limit: 30 }) as Post[]

  // Get unique build IDs and user IDs
  const buildIds = [...new Set(posts.map(p => p.buildId))]
  const userIds = [...new Set(posts.map(p => p.userId))]

  // Fetch builds and users
  const [builds, users] = await Promise.all([
    Promise.all(buildIds.map(id => blink.db.builds.get(id))),
    Promise.all(userIds.map(id => blink.db.users.get(id))),
  ])

  const buildMap: Record<string, any> = {}
  builds.forEach(b => { if (b) buildMap[b.id] = b })
  const userMap: Record<string, any> = {}
  users.forEach(u => { if (u) userMap[u.id] = u })

  return posts.map(post => {
    const build = buildMap[post.buildId]
    const user = userMap[post.userId]
    return {
      ...post,
      username: user?.username,
      displayName: user?.displayName,
      avatarUrl: user?.avatarUrl,
      buildNickname: build?.nickname,
      buildSlug: build?.slug,
      buildYear: build?.year,
      buildMake: build?.make,
      buildModel: build?.model,
      buildCoverPhotoUrl: build?.coverPhotoUrl,
    }
  })
}

async function fetchAllParts(): Promise<Part[]> {
  return await blink.db.parts.list({ limit: 200 }) as Part[]
}

async function fetchCurrentUser() {
  return await blink.db.users.get(MOCK_USER_ID)
}

export default function FeedScreen() {
  const queryClient = useQueryClient()
  const [selectedPart, setSelectedPart] = useState<Part | null>(null)
  const [partSheetVisible, setPartSheetVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['feed-posts'],
    queryFn: fetchFeedPosts,
  })

  const { data: parts = [] } = useQuery({
    queryKey: ['all-parts'],
    queryFn: fetchAllParts,
  })

  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: fetchCurrentUser,
  })

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await queryClient.invalidateQueries({ queryKey: ['feed-posts'] })
    setRefreshing(false)
  }, [queryClient])

  function handlePartPress(part: Part) {
    setSelectedPart(part)
    setPartSheetVisible(true)
  }

  function handleShopPress(part: Part) {
    setSelectedPart(part)
    setPartSheetVisible(true)
  }

  function handleDismissDisclosure() {
    blink.db.users.update(MOCK_USER_ID, { affiliateDisclosureDismissed: '1' })
    queryClient.invalidateQueries({ queryKey: ['current-user'] })
  }

  function renderEmptyState() {
    return (
      <View style={styles.emptyState}>
        <Compass size={48} color={colors.textTertiary} />
        <Text style={styles.emptyTitle}>Your feed is empty</Text>
        <Text style={styles.emptyBody}>
          Follow builds to see their updates here
        </Text>
        <Pressable style={styles.discoverBtn} onPress={() => router.push('/discover')}>
          <Text style={styles.discoverBtnText}>Discover builds</Text>
        </Pressable>
      </View>
    )
  }

  function renderSkeleton() {
    return Array.from({ length: 3 }).map((_, i) => (
      <View key={i} style={styles.skeletonCard}>
        <View style={styles.skeletonHeader}>
          <View style={styles.skeletonAvatar} />
          <View style={styles.skeletonHeaderInfo}>
            <View style={[styles.skeletonLine, { width: 100 }]} />
            <View style={[styles.skeletonLine, { width: 140, marginTop: 6 }]} />
          </View>
        </View>
        <View style={styles.skeletonPhoto} />
        <View style={styles.skeletonFooter}>
          <View style={[styles.skeletonLine, { width: '80%' }]} />
          <View style={[styles.skeletonLine, { width: '60%', marginTop: 8 }]} />
        </View>
      </View>
    ))
  }

  const isDisclosureDismissed = Number(currentUser?.affiliateDisclosureDismissed) > 0

  return (
    <View style={styles.container}>
      <FeedHeader
        unreadCount={1}
        onAlertsPress={() => router.push('/alerts')}
      />

      {postsLoading ? (
        <View style={styles.skeletonWrap}>{renderSkeleton()}</View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              parts={parts.filter(p => p.buildId === item.buildId)}
              onPartPress={handlePartPress}
              onShopPress={handleShopPress}
              onBuildPress={() => {
                if (item.username && item.buildSlug) {
                  router.push(`/build/${item.username}/${item.buildSlug}`)
                }
              }}
            />
          )}
          ListEmptyComponent={renderEmptyState()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={posts.length === 0 ? styles.emptyContainer : undefined}
        />
      )}

      <PartDetailSheet
        part={selectedPart}
        visible={partSheetVisible}
        onClose={() => { setPartSheetVisible(false); setSelectedPart(null) }}
        affiliateDisclosureDismissed={isDisclosureDismissed}
        onDismissDisclosure={handleDismissDisclosure}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyBody: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  discoverBtn: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  discoverBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  skeletonWrap: {
    padding: 0,
  },
  skeletonCard: {
    backgroundColor: colors.surface1,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
  },
  skeletonAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface3,
  },
  skeletonHeaderInfo: {
    flex: 1,
  },
  skeletonLine: {
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.surface3,
  },
  skeletonPhoto: {
    width: '100%',
    height: 300,
    backgroundColor: colors.surface2,
  },
  skeletonFooter: {
    padding: 16,
    gap: 8,
  },
})
