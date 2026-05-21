import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Platform,
  Linking,
} from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Instagram, Youtube, Settings, ChevronRight, Star, ProBadge, ShoppingCart, Edit2, Plus, ExternalLink } from '@/components/Icons'
import { getUser, listBuilds, getFollowingCount, getUserHorsepower, getUserBuildOrder, getStorePosition, getUserStoreItems, isStoreVisible, getTopBuilds, getTopBuildsPosition, type StoreItem } from '@/lib/data'
import { colors, MOCK_USER_ID } from '@/constants/throttlist'
import BuildCard from '@/components/BuildCard'
import BuildTile from '@/components/BuildTile'

async function fetchProfileData() {
  const user = await getUser(MOCK_USER_ID)
  const buildsRaw = await listBuilds({ userId: MOCK_USER_ID })
  const followingCount = getFollowingCount(MOCK_USER_ID)
  const horsepower = getUserHorsepower(MOCK_USER_ID)
  const isPro = parseInt(user?.proTier as string) >= 1
  const order = getUserBuildOrder(MOCK_USER_ID)
  const buildMap = Object.fromEntries(buildsRaw.map(b => [b.id, b]))
  const builds = order.map(id => buildMap[id]).filter(Boolean) as typeof buildsRaw
  const storePosition = getStorePosition(MOCK_USER_ID)
  const storeItems = getUserStoreItems(MOCK_USER_ID)
  const storeOn = isStoreVisible(MOCK_USER_ID)
  const topBuilds = getTopBuilds(10, MOCK_USER_ID)
  const topBuildsPosition = getTopBuildsPosition(MOCK_USER_ID)
  return { user, builds, followingCount, horsepower, isPro, storePosition, storeItems, storeOn, topBuilds, topBuildsPosition }
}

function StoreCard({ item, onPress }: { item: StoreItem; onPress: () => void }) {
  return (
    <Pressable style={styles.storeCard} onPress={onPress}>
      <View style={styles.storeImageWrap}>
        <View style={[styles.storeImagePlaceholder, item.source === 'facebook' && styles.storeImageFb]} />
        <View style={styles.storeSourceBadge}>
          <Text style={styles.storeSourceText}>
            {item.source === 'facebook' ? 'META' : item.source === 'tagged' ? 'PART' : 'SHOP'}
          </Text>
        </View>
        <View style={styles.storeLinkIcon}>
          <ExternalLink size={10} color={colors.textTertiary} />
        </View>
        <View style={styles.storeTextOverlay}>
          <Text style={styles.storeItemTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.storeItemPrice}>${item.price}</Text>
        </View>
      </View>
    </Pressable>
  )
}

export default function ProfileScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['profile', MOCK_USER_ID],
    queryFn: fetchProfileData,
  })

  const user = data?.user
  const builds = data?.builds ?? []
  const followingCount = data?.followingCount ?? 0
  const horsepower = data?.horsepower ?? 0

  if (isLoading || !user) {
    return (
      <View style={styles.container}>
        <View style={styles.skeletonHeader} />
      </View>
    )
  }

  const isPro = data?.isPro ?? false
  const isOwner = user.id === MOCK_USER_ID
  const storePosition = data?.storePosition ?? Number.MAX_SAFE_INTEGER
  const topBuildsPosition = data?.topBuildsPosition ?? Number.MAX_SAFE_INTEGER
  const storeItems = data?.storeItems ?? []
  const storeOn = data?.storeOn ?? true
  const topBuilds = data?.topBuilds ?? []

  const showStore = storeOn && isPro && storeItems.length > 0
  const showStoreEditBtn = isPro && storeOn
  const showProLock = !isPro
  const storeRow1 = storeItems.slice(0, 10)
  const storeRow2 = storeItems.slice(10, 20)

  const storeSection = (showStore || showStoreEditBtn || showProLock) ? (
    <View style={styles.storeSection}>
      <View style={styles.storeSectionHeader}>
        <ShoppingCart size={16} color={colors.textPrimary} />
        <Text style={[styles.sectionLabel, { marginBottom: 0, flex: 1 }]}>Store</Text>
        {showStoreEditBtn && (
          <Pressable style={styles.storeEditBtn} onPress={() => router.push('/settings')}>
            <Edit2 size={14} color={colors.textSecondary} />
            <Text style={styles.storeEditText}>Edit</Text>
          </Pressable>
        )}
        {showProLock && (
          <Pressable onPress={() => router.push('/pro')}>
            <ProBadge />
          </Pressable>
        )}
      </View>
      {storeRow1.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storeRow}>
          {storeRow1.map(item => (
            <StoreCard key={item.id} item={item} onPress={() => Linking.openURL(item.link)} />
          ))}
        </ScrollView>
      )}
      {storeRow2.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.storeRow, { marginTop: 10 }]}>
          {storeRow2.map(item => (
            <StoreCard key={item.id} item={item} onPress={() => Linking.openURL(item.link)} />
          ))}
        </ScrollView>
      )}
      {showStoreEditBtn && storeItems.length === 0 && (
        <Pressable style={styles.storeEmptyBtn} onPress={() => router.push('/settings')}>
          <Plus size={16} color={colors.textSecondary} />
          <Text style={styles.storeEmptyText}>Add items to your store</Text>
        </Pressable>
      )}
    </View>
  ) : null

  const topBuildsSection = topBuilds.length > 0 ? (
    <View style={styles.topBuildsSection}>
      <View style={styles.topBuildsSectionHeader}>
        <Text style={[styles.sectionLabel, { marginBottom: 0, flex: 1 }]}>Top Builds</Text>
        {isOwner && (
          <Pressable style={styles.storeEditBtn} onPress={() => router.push('/top-builds-edit')}>
            <Edit2 size={14} color={colors.textSecondary} />
            <Text style={styles.storeEditText}>Edit</Text>
          </Pressable>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.topBuildsRow}
      >
        {topBuilds.map(build => (
          <BuildTile
            key={build.id}
            build={build}
            onPress={() => router.push(`/build/${build.username ?? ''}/${build.slug}`)}
          />
        ))}
      </ScrollView>
    </View>
  ) : null

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.topUsername}>@{user.username}</Text>
        <Pressable style={styles.settingsBtn} onPress={() => router.push('/settings')}>
          <Settings size={20} color={colors.textSecondary} />
        </Pressable>
      </View>

      {/* Profile info */}
      <View style={styles.profileSection}>
        <View style={styles.avatarRow}>
          {user.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarLetter}>
                {(user.username || 'U')[0].toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.profileMeta}>
            <View style={styles.displayNameRow}>
              <Text style={styles.displayName}>{user.displayName}</Text>
              {isPro && <ProBadge />}
            </View>
            <View style={styles.statsInline}>
              <Pressable onPress={() => router.push('/following')} style={styles.statChip}>
                <Text style={styles.statChipCount}>{followingCount}</Text>
                <Text style={styles.statChipLabel}> following</Text>
              </Pressable>
              <Text style={styles.statDivider}>·</Text>
              <View style={styles.statChip}>
                <Text style={styles.statChipCount}>{horsepower}</Text>
                <Text style={styles.statChipLabel}> HP</Text>
              </View>
            </View>
            <View style={styles.socialRow}>
              {user.instagramHandle && (
                <Pressable
                  style={styles.socialLink}
                  onPress={() => Linking.openURL(`https://instagram.com/${user.instagramHandle}`)}
                >
                  <Instagram size={14} color={colors.textTertiary} />
                  <Text style={styles.socialHandle}>@{user.instagramHandle}</Text>
                </Pressable>
              )}
              {user.youtubeHandle && (
                <Pressable
                  style={styles.socialLink}
                  onPress={() => Linking.openURL(`https://youtube.com/@${user.youtubeHandle}`)}
                >
                  <Youtube size={14} color={colors.textTertiary} />
                  <Text style={styles.socialHandle}>{user.youtubeHandle}</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>

        {user.bio && <Text style={styles.bio}>{user.bio}</Text>}

        {isOwner && !Number(user.proTier) && (
          <Pressable
            style={styles.proBanner}
            onPress={() => router.push('/pro')}
          >
            <Star size={14} color={colors.accent} fill={colors.accent} />
            <Text style={styles.proBannerText}>
              Pro coming soon — earn affiliate commissions
            </Text>
            <ChevronRight size={14} color={colors.accent} />
          </Pressable>
        )}
      </View>

      {/* Builds + Store interleaved */}
      <View style={styles.buildsSectionHeader}>
        <Text style={styles.sectionLabel}>
          {builds.length === 1 ? '1 Build' : `${builds.length} Builds`}
        </Text>
      </View>
      {builds.map((build, i) => (
        <React.Fragment key={build.id}>
          {storePosition === i && storeSection}
          {topBuildsPosition === i && topBuildsSection}
          <View style={styles.buildItemWrap}>
            <BuildCard
              build={{ ...build, username: user.username }}
              showFollowButton={false}
              onPress={() => router.push(`/build/${user.username}/${build.slug}`)}
            />
          </View>
        </React.Fragment>
      ))}
      {storePosition >= builds.length && storeSection}
      {topBuildsPosition >= builds.length && topBuildsSection}

      <View style={{ height: 48 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 54 : 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topUsername: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  settingsBtn: {
    padding: 4,
  },
  profileSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: colors.surface3,
  },
  avatarFallback: {
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
  },
  profileMeta: {
    flex: 1,
    paddingTop: 4,
  },
  displayNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  displayName: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  statsInline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 6,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statChipCount: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  statChipLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  statDivider: {
    color: colors.textTertiary,
    fontSize: 13,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  socialHandle: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  bio: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  proBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.accent + '44',
    borderRadius: 8,
    padding: 12,
  },
  proBannerText: {
    color: colors.textSecondary,
    fontSize: 12,
    flex: 1,
  },
  buildsSectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  buildItemWrap: {
    paddingHorizontal: 16,
  },
  storeSection: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 16, paddingBottom: 16 },
  storeSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, marginBottom: 14 },
  storeEditBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: colors.surface2, borderRadius: 6 },
  storeEditText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  storeRow: { paddingHorizontal: 16, gap: 1, flexDirection: 'row' },
  storeCard: { width: 120 },
  storeImageWrap: { width: 120, height: 120, borderRadius: 0, overflow: 'hidden', position: 'relative', backgroundColor: colors.surface2 },
  storeImagePlaceholder: { flex: 1, backgroundColor: colors.surface2 },
  storeImageFb: { backgroundColor: '#1a273a' },
  storeSourceBadge: { position: 'absolute', top: 6, left: 6, backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  storeSourceText: { color: colors.textSecondary, fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  storeLinkIcon: { position: 'absolute', bottom: 32, right: 6, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 4, padding: 4 },
  storeTextOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 6, paddingVertical: 4 },
  storeItemTitle: { color: '#fff', fontSize: 10, fontWeight: '500', lineHeight: 13 },
  storeItemPrice: { color: colors.accent, fontSize: 11, fontWeight: '700' },
  storeEmptyBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, paddingVertical: 14, paddingHorizontal: 16, backgroundColor: colors.surface1, borderRadius: 10, borderWidth: 1, borderColor: colors.surface3, borderStyle: 'dashed' },
  storeEmptyText: { color: colors.textSecondary, fontSize: 14 },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 14,
  },
  topBuildsSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
    paddingBottom: 16,
  },
  topBuildsSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, marginBottom: 14 },
  topBuildsRow: { paddingHorizontal: 16, gap: 1, flexDirection: 'row' },
  skeletonHeader: {
    height: 200,
    backgroundColor: colors.surface1,
  },
})
