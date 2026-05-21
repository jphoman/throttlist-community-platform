import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Platform,
  Linking,
  Modal,
  FlatList,
  TextInput,
  Alert,
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft, Instagram, Youtube, X,
  ShoppingCart, ExternalLink, Edit2, Plus, Trash,
  ProBadge,
} from '@/components/Icons'
import {
  listUsers, listBuilds, listFollowingBuilds, getFollowingCount,
  getUserHorsepower, getUserStoreItems, setUserStoreItems,
  isStoreVisible, getUserParts, getUserBuildOrder, getStorePosition,
  getTopBuilds, getTopBuildsPosition, type StoreItem,
} from '@/lib/data'
import { colors, formatFollowers, MOCK_USER_ID } from '@/constants/throttlist'
import BuildCard from '@/components/BuildCard'
import BuildTile from '@/components/BuildTile'
import InitialsAvatar from '@/components/InitialsAvatar'

async function fetchUserProfile(username: string) {
  const allUsers = await listUsers()
  const user = allUsers.find(u => u.username === username)
  if (!user) return null
  const [buildsRaw, followingBuilds] = await Promise.all([
    listBuilds({ userId: user.id }),
    listFollowingBuilds(user.id),
  ])
  const order = getUserBuildOrder(user.id)
  const buildMap = Object.fromEntries(buildsRaw.map(b => [b.id, b]))
  const builds = order.map(id => buildMap[id]).filter(Boolean) as typeof buildsRaw
  const followingCount = getFollowingCount(user.id)
  const horsepower = getUserHorsepower(user.id)
  const storeItems = getUserStoreItems(user.id)
  const storeOn = isStoreVisible(user.id)
  const isPro = parseInt(user.proTier as string) >= 1
  const parts = getUserParts(user.id)
  const storePosition = getStorePosition(user.id)
  const topBuilds = getTopBuilds(10, user.id)
  const topBuildsPosition = getTopBuildsPosition(user.id)
  return { user, builds, followingBuilds, followingCount, horsepower, storeItems, storeOn, isPro, parts, storePosition, topBuilds, topBuildsPosition }
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

export default function UserProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>()
  const queryClient = useQueryClient()

  const [followingSheetOpen, setFollowingSheetOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const [editItems, setEditItems] = useState<StoreItem[]>([])
  const [addMetaTitle, setAddMetaTitle] = useState('')
  const [addMetaPrice, setAddMetaPrice] = useState('')
  const [addMetaUrl, setAddMetaUrl] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['user-profile', username],
    queryFn: () => fetchUserProfile(username!),
    enabled: !!username,
  })

  if (isLoading || !data) {
    return (
      <View style={styles.container}>
        <View style={styles.navBar}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
        <View style={styles.skeletonHeader} />
      </View>
    )
  }

  const { user, builds, followingBuilds = [], followingCount = 0, horsepower = 0,
    storeItems, storeOn, isPro, parts, storePosition, topBuilds = [], topBuildsPosition = Number.MAX_SAFE_INTEGER } = data

  const isOwner = user.id === MOCK_USER_ID
  const showStore = storeOn && isPro && storeItems.length > 0
  const showStoreEditBtn = isOwner && isPro && storeOn
  const showProLock = isOwner && !isPro

  const storeRow1 = storeItems.slice(0, 10)
  const storeRow2 = storeItems.slice(10, 20)

  function openEdit() {
    setEditItems([...storeItems])
    setAddMetaTitle('')
    setAddMetaPrice('')
    setAddMetaUrl('')
    setEditOpen(true)
  }

  function saveEdit() {
    setUserStoreItems(user.id, editItems)
    queryClient.invalidateQueries({ queryKey: ['user-profile', username] })
    setEditOpen(false)
  }

  function moveItem(index: number, dir: -1 | 1) {
    const next = [...editItems]
    const swap = index + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[index], next[swap]] = [next[swap], next[index]]
    setEditItems(next)
  }

  function removeItem(index: number) {
    setEditItems(prev => prev.filter((_, i) => i !== index))
  }

  function addTaggedPart(part: { id: string; name: string; sourceUrl?: string }) {
    if (editItems.length >= 20) {
      Alert.alert('Limit reached', 'You can have up to 20 items in your store.')
      return
    }
    const already = editItems.find(i => i.id === `part_store_${part.id}`)
    if (already) return
    const newItem: StoreItem = {
      id: `part_store_${part.id}`,
      userId: user.id,
      title: part.name,
      price: 0,
      link: part.sourceUrl ?? '',
      source: 'tagged',
    }
    setEditItems(prev => [...prev, newItem])
  }

  function addMetaItem() {
    if (!addMetaTitle.trim() || !addMetaUrl.trim()) {
      Alert.alert('Missing fields', 'Please enter a title and URL.')
      return
    }
    if (editItems.length >= 20) {
      Alert.alert('Limit reached', 'You can have up to 20 items in your store.')
      return
    }
    const newItem: StoreItem = {
      id: `meta_${Date.now()}`,
      userId: user.id,
      title: addMetaTitle.trim(),
      price: parseFloat(addMetaPrice) || 0,
      link: addMetaUrl.trim(),
      source: 'facebook',
    }
    setEditItems(prev => [...prev, newItem])
    setAddMetaTitle('')
    setAddMetaPrice('')
    setAddMetaUrl('')
  }

  const existingPartIds = new Set(editItems.map(i => `part_store_${i.id.replace('part_store_', '')}`))
  const availableParts = parts.filter(p => !existingPartIds.has(`part_store_${p.id}`))

  const storeSection = (showStore || showStoreEditBtn || showProLock) ? (
    <View style={styles.storeSection}>
      <View style={styles.storeSectionHeader}>
        <ShoppingCart size={16} color={colors.textPrimary} />
        <Text style={[styles.sectionLabel, { marginBottom: 0, flex: 1 }]}>Store</Text>
        {showStoreEditBtn && (
          <Pressable style={styles.storeEditBtn} onPress={openEdit}>
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storeRow}
        >
          {storeRow1.map(item => (
            <StoreCard key={item.id} item={item} onPress={() => Linking.openURL(item.link)} />
          ))}
        </ScrollView>
      )}

      {storeRow2.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.storeRow, { marginTop: 10 }]}
        >
          {storeRow2.map(item => (
            <StoreCard key={item.id} item={item} onPress={() => Linking.openURL(item.link)} />
          ))}
        </ScrollView>
      )}

      {showStoreEditBtn && storeItems.length === 0 && (
        <Pressable style={styles.storeEmptyBtn} onPress={openEdit}>
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
    <View style={styles.container}>
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.textSecondary} />
        </Pressable>
        <Text style={styles.navTitle}>@{user.username}</Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarRow}>
            {user.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarLetter}>{(user.username || 'U')[0].toUpperCase()}</Text>
              </View>
            )}
            <View style={styles.profileMeta}>
              <View style={styles.displayNameRow}>
                <Text style={styles.displayName}>{user.displayName}</Text>
                {isPro && <ProBadge />}
              </View>
              <View style={styles.statsRow}>
                {followingCount > 0 ? (
                  <Pressable style={styles.statChip} onPress={() => setFollowingSheetOpen(true)}>
                    <Text style={styles.statCount}>{followingCount}</Text>
                    <Text style={styles.statLabel}> following</Text>
                  </Pressable>
                ) : (
                  <View style={styles.statChip}>
                    <Text style={styles.statCount}>0</Text>
                    <Text style={styles.statLabel}> following</Text>
                  </View>
                )}
                <Text style={styles.statDivider}>·</Text>
                <View style={styles.statChip}>
                  <Text style={styles.statCount}>{horsepower}</Text>
                  <Text style={styles.statLabel}> HP</Text>
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
        </View>

        <View style={styles.buildsSectionHeader}>
          <Text style={styles.sectionLabel}>
            {builds.length === 1 ? '1 Build' : `${builds.length} Builds`}
          </Text>
        </View>
        {builds.length === 0 && (
          <View style={styles.buildItemWrap}>
            <Text style={styles.emptyText}>No builds yet</Text>
          </View>
        )}
        {builds.map((build, i) => (
          <React.Fragment key={build.id}>
            {storePosition === i && storeSection}
            {topBuildsPosition === i && topBuildsSection}
            <View style={styles.buildItemWrap}>
              <BuildCard
                build={{ ...build, username: user.username }}
                showFollowButton={true}
                onPress={() => router.push(`/build/${user.username}/${build.slug}`)}
              />
            </View>
          </React.Fragment>
        ))}
        {storePosition >= builds.length && storeSection}
        {topBuildsPosition >= builds.length && topBuildsSection}

        <View style={{ height: 48 }} />
      </ScrollView>

      {/* Following sheet */}
      <Modal
        visible={followingSheetOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setFollowingSheetOpen(false)}
      >
        <Pressable style={styles.sheetBackdrop} onPress={() => setFollowingSheetOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Following ({followingCount})</Text>
            <Pressable onPress={() => setFollowingSheetOpen(false)} style={styles.sheetClose}>
              <X size={20} color={colors.textSecondary} />
            </Pressable>
          </View>
          <FlatList
            data={followingBuilds}
            keyExtractor={b => b.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                style={styles.followingItem}
                onPress={() => {
                  setFollowingSheetOpen(false)
                  router.push(`/build/${item.username ?? user.username}/${item.slug}`)
                }}
              >
                <InitialsAvatar
                  name={item.nickname || item.make}
                  photoUrl={item.coverPhotoUrl || null}
                  size={44}
                />
                <View style={styles.followingItemInfo}>
                  <Text style={styles.followingItemName}>
                    {item.nickname || `${item.year} ${item.make}`}
                  </Text>
                  <Text style={styles.followingItemMeta}>{item.year} {item.make} {item.model}</Text>
                  <Text style={styles.followingItemStat}>{formatFollowers(item.followerCount)} followers</Text>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              <View style={styles.sheetEmpty}>
                <Text style={styles.sheetEmptyText}>Not following any builds.</Text>
              </View>
            }
          />
          <View style={{ height: Platform.OS === 'ios' ? 28 : 12 }} />
        </View>
      </Modal>

      {/* Store edit modal */}
      <Modal
        visible={editOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setEditOpen(false)}
      >
        <View style={styles.editModalRoot}>
          <Pressable style={styles.sheetBackdrop} onPress={() => setEditOpen(false)} />
          <View style={styles.editSheet}>
            <View style={styles.editSheetHeader}>
              <Pressable onPress={() => setEditOpen(false)} style={styles.sheetClose}>
                <Text style={styles.editCancelText}>Cancel</Text>
              </Pressable>
              <Text style={styles.sheetTitle}>Edit Store</Text>
              <Pressable onPress={saveEdit} style={styles.sheetClose}>
                <Text style={styles.editSaveText}>Save</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.editScroll}>
              <Text style={styles.editSectionLabel}>
                CURRENT ITEMS ({editItems.length}/20)
              </Text>
              {editItems.length === 0 && (
                <Text style={styles.editEmptyNote}>No items yet. Add some below.</Text>
              )}
              {editItems.map((item, idx) => (
                <View key={item.id} style={styles.editItem}>
                  <View style={styles.editItemLeft}>
                    <View style={[styles.editItemThumb, item.source === 'facebook' && styles.storeImageFb]} />
                    <View style={styles.editItemInfo}>
                      <Text style={styles.editItemTitle} numberOfLines={1}>{item.title}</Text>
                      <Text style={styles.editItemMeta}>
                        {item.source === 'facebook' ? 'META' : 'PART'} · ${item.price}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.editItemActions}>
                    <Pressable onPress={() => moveItem(idx, -1)} style={styles.editArrow} disabled={idx === 0}>
                      <Text style={[styles.editArrowText, idx === 0 && { opacity: 0.25 }]}>↑</Text>
                    </Pressable>
                    <Pressable onPress={() => moveItem(idx, 1)} style={styles.editArrow} disabled={idx === editItems.length - 1}>
                      <Text style={[styles.editArrowText, idx === editItems.length - 1 && { opacity: 0.25 }]}>↓</Text>
                    </Pressable>
                    <Pressable onPress={() => removeItem(idx)} style={styles.editRemove}>
                      <Trash size={14} color={colors.accent} />
                    </Pressable>
                  </View>
                </View>
              ))}

              {availableParts.length > 0 && (
                <>
                  <Text style={styles.editSectionLabel}>ADD FROM YOUR TAGS</Text>
                  {availableParts.map(part => (
                    <Pressable
                      key={part.id}
                      style={styles.editAddRow}
                      onPress={() => addTaggedPart(part)}
                    >
                      <View style={styles.editAddLeft}>
                        <Plus size={14} color={colors.accent} />
                        <Text style={styles.editAddTitle} numberOfLines={1}>{part.name}</Text>
                      </View>
                      <Text style={styles.editAddMeta}>{part.category}</Text>
                    </Pressable>
                  ))}
                </>
              )}

              <Text style={styles.editSectionLabel}>ADD FROM META SHOP</Text>
              <View style={styles.editMetaForm}>
                <TextInput
                  style={styles.editInput}
                  placeholder="Item title"
                  placeholderTextColor={colors.textTertiary}
                  value={addMetaTitle}
                  onChangeText={setAddMetaTitle}
                />
                <View style={styles.editInputRow}>
                  <TextInput
                    style={[styles.editInput, { flex: 1 }]}
                    placeholder="Price (e.g. 49.99)"
                    placeholderTextColor={colors.textTertiary}
                    value={addMetaPrice}
                    onChangeText={setAddMetaPrice}
                    keyboardType="decimal-pad"
                  />
                  <TextInput
                    style={[styles.editInput, { flex: 2 }]}
                    placeholder="Facebook Shop URL"
                    placeholderTextColor={colors.textTertiary}
                    value={addMetaUrl}
                    onChangeText={setAddMetaUrl}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                <Pressable style={styles.editAddBtn} onPress={addMetaItem}>
                  <Plus size={14} color="#fff" />
                  <Text style={styles.editAddBtnText}>Add item</Text>
                </Pressable>
              </View>

              <View style={{ height: Platform.OS === 'ios' ? 40 : 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 54 : 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  backBtn: { padding: 4 },
  navTitle: { flex: 1, color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  navSpacer: { width: 28 },
  skeletonHeader: { height: 160, backgroundColor: colors.surface1, margin: 16, borderRadius: 8 },
  profileSection: { padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  avatarRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 12 },
  avatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 1, borderColor: colors.surface3 },
  avatarFallback: { backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  avatarLetter: { color: colors.textPrimary, fontSize: 24, fontWeight: '700' },
  profileMeta: { flex: 1, paddingTop: 4 },
  displayNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  displayName: { color: colors.textPrimary, fontSize: 17, fontWeight: '700' },
  proBolt: {
    backgroundColor: colors.accent,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  statChip: { flexDirection: 'row', alignItems: 'baseline' },
  statCount: { color: colors.textPrimary, fontSize: 13, fontWeight: '700' },
  statLabel: { color: colors.textSecondary, fontSize: 13 },
  statDivider: { color: colors.textTertiary, fontSize: 13 },
  socialRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  socialLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  socialHandle: { color: colors.textTertiary, fontSize: 12 },
  bio: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  buildsSectionHeader: { paddingHorizontal: 16, paddingTop: 16 },
  buildItemWrap: { paddingHorizontal: 16 },
  sectionLabel: { color: colors.textPrimary, fontSize: 15, fontWeight: '700', marginBottom: 14 },
  emptyText: { color: colors.textTertiary, fontSize: 14, textAlign: 'center', paddingVertical: 24 },
  topBuildsSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
    paddingBottom: 16,
  },
  topBuildsSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, marginBottom: 14 },
  topBuildsRow: { paddingHorizontal: 16, gap: 1, flexDirection: 'row' },
  // Store
  storeSection: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 16, paddingBottom: 16 },
  storeSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  storeEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.surface2,
    borderRadius: 6,
  },
  storeEditText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  storeProChip: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 4,
  },
  storeRow: { paddingHorizontal: 16, gap: 1, flexDirection: 'row' },
  storeCard: { width: 120 },
  storeImageWrap: {
    width: 120,
    height: 120,
    borderRadius: 0,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.surface2,
  },
  storeImagePlaceholder: { flex: 1, backgroundColor: colors.surface2 },
  storeImageFb: { backgroundColor: '#1a273a' },
  storeSourceBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  storeSourceText: { color: colors.textSecondary, fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  storeLinkIcon: {
    position: 'absolute',
    bottom: 32,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 4,
    padding: 4,
  },
  storeTextOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 6, paddingVertical: 4 },
  storeItemTitle: { color: '#fff', fontSize: 10, fontWeight: '500', lineHeight: 13 },
  storeItemPrice: { color: colors.accent, fontSize: 11, fontWeight: '700' },
  storeEmptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.surface1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.surface3,
    borderStyle: 'dashed',
  },
  storeEmptyText: { color: colors.textSecondary, fontSize: 14 },
  // Sheets
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: {
    backgroundColor: colors.surface1,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '72%',
    minHeight: 260,
  },
  sheetHandle: {
    width: 38, height: 4, borderRadius: 2,
    backgroundColor: colors.surface3,
    alignSelf: 'center', marginTop: 10, marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  sheetTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
  sheetClose: { padding: 4 },
  followingItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  followingItemInfo: { flex: 1 },
  followingItemName: { color: colors.textPrimary, fontSize: 14, fontWeight: '700' },
  followingItemMeta: { color: colors.textSecondary, fontSize: 12, marginTop: 1 },
  followingItemStat: { color: colors.textTertiary, fontSize: 11, marginTop: 2 },
  sheetEmpty: { padding: 40, alignItems: 'center' },
  sheetEmptyText: { color: colors.textTertiary, fontSize: 14 },
  // Edit modal
  editModalRoot: { flex: 1, justifyContent: 'flex-end' },
  editSheet: {
    backgroundColor: colors.surface1,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '88%',
  },
  editSheetHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  editCancelText: { color: colors.textSecondary, fontSize: 15 },
  editSaveText: { color: colors.accent, fontSize: 15, fontWeight: '700' },
  editScroll: { flex: 1 },
  editSectionLabel: {
    color: colors.textTertiary, fontSize: 10, fontWeight: '700',
    letterSpacing: 0.8, textTransform: 'uppercase',
    paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8,
  },
  editEmptyNote: { color: colors.textTertiary, fontSize: 13, paddingHorizontal: 16, paddingBottom: 8 },
  editItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: colors.border,
    gap: 10,
  },
  editItemLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  editItemThumb: { width: 38, height: 38, borderRadius: 6, backgroundColor: colors.surface2 },
  editItemInfo: { flex: 1 },
  editItemTitle: { color: colors.textPrimary, fontSize: 13, fontWeight: '500' },
  editItemMeta: { color: colors.textTertiary, fontSize: 11, marginTop: 2 },
  editItemActions: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  editArrow: { padding: 6 },
  editArrowText: { color: colors.textSecondary, fontSize: 16, fontWeight: '700' },
  editRemove: { padding: 6, marginLeft: 4 },
  editAddRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  editAddLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  editAddTitle: { color: colors.textPrimary, fontSize: 13, flex: 1 },
  editAddMeta: { color: colors.textTertiary, fontSize: 11 },
  editMetaForm: { paddingHorizontal: 16, gap: 8, paddingBottom: 4 },
  editInput: {
    backgroundColor: colors.surface2,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.surface3,
  },
  editInputRow: { flexDirection: 'row', gap: 8 },
  editAddBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 11,
  },
  editAddBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
})
