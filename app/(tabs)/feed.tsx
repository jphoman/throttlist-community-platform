import React, { useState, useCallback, useRef } from 'react'
import {
  View,
  StyleSheet,
  Animated,
  Pressable,
  Text,
  Platform,
  RefreshControl,
} from 'react-native'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Bell, Compass } from '@/components/Icons'
import { ThrottlistIcon } from '@/components/ThrottlistLogo'
import { listPosts, listParts, getUser } from '@/lib/data'
import { colors, MOCK_USER_ID } from '@/constants/throttlist'
import PostCard from '@/components/PostCard'
import PartDetailSheet from '@/components/PartDetailSheet'
import type { Post, Part } from '@/types'

const HEADER_HEIGHT = Platform.OS === 'ios' ? 98 : 60

async function fetchFeedPosts(): Promise<Post[]> {
  return listPosts({ limit: 30 })
}

async function fetchAllParts(): Promise<Part[]> {
  return listParts()
}

async function fetchCurrentUser() {
  return getUser(MOCK_USER_ID)
}

export default function FeedScreen() {
  const queryClient = useQueryClient()
  const [selectedPart, setSelectedPart] = useState<Part | null>(null)
  const [partSheetVisible, setPartSheetVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const scrollY = useRef(new Animated.Value(0)).current

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

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 70],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 70],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  })

  function handlePartPress(part: Part) {
    setSelectedPart(part)
    setPartSheetVisible(true)
  }

  function handleShopPress(part: Part) {
    setSelectedPart(part)
    setPartSheetVisible(true)
  }

  function handleDismissDisclosure() {
    queryClient.invalidateQueries({ queryKey: ['current-user'] })
  }

  function renderEmptyState() {
    return (
      <View style={styles.emptyState}>
        <Compass size={48} color={colors.textTertiary} />
        <Text style={styles.emptyTitle}>Your feed is empty</Text>
        <Text style={styles.emptyBody}>Follow builds to see their updates here</Text>
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
      {/* Animated floating header */}
      <Animated.View
        style={[
          styles.header,
          { opacity: headerOpacity, transform: [{ translateY: headerTranslate }] },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.headerInner} pointerEvents="box-none">
          <View style={styles.headerSpacer} />
          <ThrottlistIcon size={30} color={colors.accent} />
          <Pressable
            style={styles.bellBtn}
            onPress={() => router.push('/alerts')}
          >
            <Bell size={22} color={colors.textSecondary} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          </Pressable>
        </View>
      </Animated.View>

      {postsLoading ? (
        <View style={[styles.skeletonWrap, { paddingTop: HEADER_HEIGHT }]}>
          {renderSkeleton()}
        </View>
      ) : (
        <Animated.FlatList
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
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false },
          )}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accent}
              colors={[colors.accent]}
              progressViewOffset={HEADER_HEIGHT}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            posts.length === 0
              ? [styles.emptyContainer, { paddingTop: HEADER_HEIGHT }]
              : { paddingTop: HEADER_HEIGHT }
          }
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 10,
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerSpacer: {
    width: 30,
  },
  bellBtn: {
    position: 'relative',
    padding: 4,
    width: 30,
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.accent,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
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
  skeletonWrap: {},
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
