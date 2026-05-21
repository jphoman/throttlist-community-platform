import React, { useState, useCallback, useRef, useMemo } from 'react'
import {
  View,
  StyleSheet,
  Animated,
  Pressable,
  Text,
  Platform,
  RefreshControl,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Bell, Compass, ChevronDown } from '@/components/Icons'
import { ThrottlistIcon } from '@/components/ThrottlistLogo'
import { listPosts, listParts, getUser } from '@/lib/data'
import { colors, MOCK_USER_ID } from '@/constants/throttlist'
import PostCard from '@/components/PostCard'
import PartDetailSheet from '@/components/PartDetailSheet'
import type { Post, Part } from '@/types'

const HEADER_HEIGHT = Platform.OS === 'ios' ? 98 : 60
const SORT_HEADER_HEIGHT = 36
const COMBINED_HEADER_HEIGHT = HEADER_HEIGHT + SORT_HEADER_HEIGHT

type SortMode = 'for-you' | 'most-recent'

const BUILD_TYPES = [
  { id: 'all', label: 'All Types' },
  { id: 'moto', label: 'Moto' },
  { id: 'car', label: 'Car' },
  { id: 'audio', label: 'Audio' },
  { id: 'pc', label: 'PC' },
]

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
  const [sortMode, setSortMode] = useState<SortMode>('for-you')
  const [buildTypeFilter, setBuildTypeFilter] = useState('all')
  const [typePickerOpen, setTypePickerOpen] = useState(false)
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

  const displayedPosts = useMemo(() => {
    let result = [...posts]
    if (buildTypeFilter !== 'all') {
      result = result.filter(p => p.buildType === buildTypeFilter)
    }
    if (sortMode === 'most-recent') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    return result
  }, [posts, sortMode, buildTypeFilter])

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 70],
    outputRange: [0, -COMBINED_HEADER_HEIGHT],
    extrapolate: 'clamp',
  })

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
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

  const selectedTypeDef = BUILD_TYPES.find(t => t.id === buildTypeFilter) ?? BUILD_TYPES[0]
  const isTypeFiltered = buildTypeFilter !== 'all'

  function renderEmptyState() {
    return (
      <View style={styles.emptyState}>
        <Compass size={48} color={colors.textTertiary} />
        <Text style={styles.emptyTitle}>
          {isTypeFiltered ? `No ${selectedTypeDef.label} posts yet` : 'Your feed is empty'}
        </Text>
        <Text style={styles.emptyBody}>
          {isTypeFiltered
            ? 'Try a different build type or check back later'
            : 'Follow builds to see their updates here'}
        </Text>
        {!isTypeFiltered && (
          <Pressable style={styles.discoverBtn} onPress={() => router.push('/discover')}>
            <Text style={styles.discoverBtnText}>Discover builds</Text>
          </Pressable>
        )}
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
      {/* Combined animated header */}
      <Animated.View
        style={[
          styles.headersWrap,
          { opacity: headerOpacity, transform: [{ translateY: headerTranslate }] },
        ]}
        pointerEvents="box-none"
      >
        {/* Main header */}
        <View style={styles.mainHeader} pointerEvents="box-none">
          <View style={styles.headerInner} pointerEvents="box-none">
            <View style={styles.headerSpacer} />
            <ThrottlistIcon size={60} color={colors.accent} />
            <Pressable style={styles.bellBtn} onPress={() => router.push('/alerts')}>
              <Bell size={22} color={colors.textSecondary} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>1</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Sort / filter header */}
        <View style={styles.sortHeader} pointerEvents="box-none">
          <Pressable
            style={[styles.sortPill, sortMode === 'for-you' && styles.sortPillActive]}
            onPress={() => setSortMode('for-you')}
          >
            <Text style={[styles.sortPillText, sortMode === 'for-you' && styles.sortPillTextActive]}>
              For You
            </Text>
          </Pressable>

          <Pressable
            style={[styles.sortPill, sortMode === 'most-recent' && styles.sortPillActive]}
            onPress={() => setSortMode('most-recent')}
          >
            <Text style={[styles.sortPillText, sortMode === 'most-recent' && styles.sortPillTextActive]}>
              Most Recent
            </Text>
          </Pressable>

          <Pressable
            style={[styles.sortPill, styles.typePill, isTypeFiltered && styles.sortPillActive]}
            onPress={() => setTypePickerOpen(true)}
          >
            <Text style={[styles.sortPillText, isTypeFiltered && styles.sortPillTextActive]}>
              {isTypeFiltered ? selectedTypeDef.label : 'Build Type'}
            </Text>
            <ChevronDown size={11} color={isTypeFiltered ? '#fff' : colors.textTertiary} />
          </Pressable>
        </View>
      </Animated.View>

      {/* Build type picker */}
      <Modal
        visible={typePickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setTypePickerOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setTypePickerOpen(false)}>
          <View style={styles.pickerBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.pickerMenu}>
                <Text style={styles.pickerTitle}>BUILD TYPE</Text>
                {BUILD_TYPES.map(type => (
                  <Pressable
                    key={type.id}
                    style={[
                      styles.pickerRow,
                      buildTypeFilter === type.id && styles.pickerRowActive,
                    ]}
                    onPress={() => {
                      setBuildTypeFilter(type.id)
                      setTypePickerOpen(false)
                    }}
                  >
                    <Text style={[
                      styles.pickerRowText,
                      buildTypeFilter === type.id && styles.pickerRowTextActive,
                    ]}>
                      {type.label}
                    </Text>
                    {buildTypeFilter === type.id && (
                      <Text style={styles.pickerCheck}>✓</Text>
                    )}
                  </Pressable>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {postsLoading ? (
        <View style={[styles.skeletonWrap, { paddingTop: COMBINED_HEADER_HEIGHT }]}>
          {renderSkeleton()}
        </View>
      ) : (
        <Animated.FlatList
          data={displayedPosts}
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
              progressViewOffset={COMBINED_HEADER_HEIGHT}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            displayedPosts.length === 0
              ? [styles.emptyContainer, { paddingTop: COMBINED_HEADER_HEIGHT }]
              : { paddingTop: COMBINED_HEADER_HEIGHT }
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
  headersWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: colors.bg,
  },
  mainHeader: {
    height: HEADER_HEIGHT,
    borderBottomWidth: 0,
  },
  headerInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
  sortHeader: {
    height: SORT_HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 7,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bg,
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface1,
  },
  sortPillActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  sortPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  sortPillTextActive: {
    color: '#fff',
  },
  typePill: {
    marginLeft: 'auto',
  },
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: COMBINED_HEADER_HEIGHT + 8,
    paddingRight: 14,
  },
  pickerMenu: {
    backgroundColor: colors.surface1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 160,
    overflow: 'hidden',
  },
  pickerTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: colors.textTertiary,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 6,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  pickerRowActive: {
    backgroundColor: colors.surface2,
  },
  pickerRowText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  pickerRowTextActive: {
    color: colors.accent,
    fontWeight: '700',
  },
  pickerCheck: {
    fontSize: 14,
    color: colors.accent,
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
