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
} from 'react-native'
import { router } from 'expo-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Search, X, Plus } from '@/components/Icons'
import {
  listBuilds, listUsers, listFollowingBuilds,
  getTopBuilds, getUserTopBuildIds, setUserTopBuildIds,
} from '@/lib/data'
import { colors, formatFollowers, MOCK_USER_ID } from '@/constants/throttlist'

const MAX = 10

async function fetchData() {
  const [allBuilds, allUsers, followedBuilds] = await Promise.all([
    listBuilds({ status: 'active' }),
    listUsers(),
    listFollowingBuilds(MOCK_USER_ID),
  ])
  const userMap = Object.fromEntries(allUsers.map(u => [u.id, u]))
  const othersBuilds = allBuilds
    .filter(b => b.userId !== MOCK_USER_ID)
    .map(b => ({
      ...b,
      username: userMap[b.userId]?.username ?? '',
      avatarUrl: userMap[b.userId]?.avatarUrl ?? null,
      ownerIsPro: parseInt(userMap[b.userId]?.proTier as string) >= 1,
    }))

  const followedIds = new Set(followedBuilds.map(b => b.id))

  // Initial selection: saved custom or default top 10
  const saved = getUserTopBuildIds(MOCK_USER_ID)
  const initialIds: string[] = saved ?? getTopBuilds(MAX, MOCK_USER_ID).map(b => b.id)

  return { othersBuilds, followedIds, initialIds }
}

type BuildRow = {
  id: string
  nickname?: string
  year?: number
  make?: string
  model?: string
  coverPhotoUrl?: string | null
  followerCount: number
  username: string
  avatarUrl: string | null
  ownerIsPro: boolean
}

function BuildItem({
  build,
  selected,
  onAdd,
  onRemove,
}: {
  build: BuildRow
  selected: boolean
  onAdd: () => void
  onRemove: () => void
}) {
  const label = build.nickname || `${build.year} ${build.make}`
  return (
    <View style={[styles.item, selected && styles.itemSelected]}>
      <View style={styles.itemThumb}>
        {build.coverPhotoUrl ? (
          <Image source={{ uri: build.coverPhotoUrl }} style={styles.thumbImg} resizeMode="cover" />
        ) : (
          <View style={[styles.thumbImg, styles.thumbFallback]} />
        )}
        <View style={[styles.avatarRing, build.ownerIsPro ? styles.avatarPro : styles.avatarDefault]}>
          {build.avatarUrl ? (
            <Image source={{ uri: build.avatarUrl }} style={styles.avatarImg} />
          ) : (
            <Text style={styles.avatarLetter}>{(build.username || '?')[0].toUpperCase()}</Text>
          )}
        </View>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>{label}</Text>
        <Text style={styles.itemMeta} numberOfLines={1}>
          @{build.username} · {formatFollowers(build.followerCount)} followers
        </Text>
      </View>
      {selected ? (
        <Pressable style={styles.removeBtn} onPress={onRemove}>
          <X size={14} color="#fff" />
        </Pressable>
      ) : (
        <Pressable style={styles.addBtn} onPress={onAdd}>
          <Plus size={14} color={colors.accent} />
        </Pressable>
      )}
    </View>
  )
}

export default function TopBuildsEditScreen() {
  const queryClient = useQueryClient()
  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[] | null>(null)

  const { data } = useQuery({
    queryKey: ['top-builds-edit'],
    queryFn: fetchData,
  })

  // Initialise from fetched data on first load
  const effectiveIds: string[] = selectedIds ?? data?.initialIds ?? []

  function add(id: string) {
    if (effectiveIds.length >= MAX) return
    setSelectedIds([...effectiveIds, id])
  }

  function remove(id: string) {
    setSelectedIds(effectiveIds.filter(x => x !== id))
  }

  function save() {
    setUserTopBuildIds(MOCK_USER_ID, effectiveIds)
    queryClient.invalidateQueries({ queryKey: ['profile'] })
    queryClient.invalidateQueries({ queryKey: ['user-profile'] })
    router.back()
  }

  const q = query.trim().toLowerCase()
  const selectedSet = new Set(effectiveIds)

  // Build lookup map
  const buildMap = useMemo(() => {
    if (!data) return {}
    return Object.fromEntries(data.othersBuilds.map(b => [b.id, b]))
  }, [data])

  // Selected builds in order
  const selectedBuilds = effectiveIds.map(id => buildMap[id]).filter(Boolean) as BuildRow[]

  // Suggested: followed first (by follower count), then top non-followed
  const suggestions = useMemo(() => {
    if (!data) return []
    const { othersBuilds, followedIds } = data
    const followed = othersBuilds
      .filter(b => followedIds.has(b.id) && !selectedSet.has(b.id))
      .sort((a, b) => b.followerCount - a.followerCount)
    const rest = othersBuilds
      .filter(b => !followedIds.has(b.id) && !selectedSet.has(b.id))
      .sort((a, b) => b.followerCount - a.followerCount)
    return [...followed, ...rest]
  }, [data, effectiveIds])

  // Search results (all builds matching query, with selected state)
  const searchResults = useMemo(() => {
    if (!q || !data) return []
    return data.othersBuilds
      .filter(b => {
        const label = `${b.nickname ?? ''} ${b.year ?? ''} ${b.make ?? ''} ${b.model ?? ''} ${b.username}`.toLowerCase()
        return label.includes(q)
      })
      .sort((a, b) => b.followerCount - a.followerCount)
  }, [q, data])

  const atMax = effectiveIds.length >= MAX

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.textSecondary} />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Top Builds</Text>
        <Pressable onPress={save} style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save</Text>
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Search size={16} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search builds, makes, usernames…"
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
        {/* Selected section */}
        {selectedBuilds.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>
                SELECTED ({effectiveIds.length}/{MAX})
              </Text>
              {atMax && <Text style={styles.sectionNote}>Max reached</Text>}
            </View>
            {selectedBuilds.map(build => (
              <BuildItem
                key={build.id}
                build={build}
                selected
                onAdd={() => {}}
                onRemove={() => remove(build.id)}
              />
            ))}
          </>
        )}

        {/* No query: show suggestions */}
        {!q && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>SUGGESTED</Text>
              {data?.followedIds.size ? (
                <Text style={styles.sectionNote}>Follows first</Text>
              ) : null}
            </View>
            {suggestions.length === 0 && (
              <Text style={styles.emptyNote}>No more builds to suggest.</Text>
            )}
            {suggestions.map(build => (
              <BuildItem
                key={build.id}
                build={build}
                selected={false}
                onAdd={() => add(build.id)}
                onRemove={() => {}}
              />
            ))}
          </>
        )}

        {/* Query: show search results */}
        {!!q && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>RESULTS ({searchResults.length})</Text>
            </View>
            {searchResults.length === 0 && (
              <Text style={styles.emptyNote}>No builds match "{query}".</Text>
            )}
            {searchResults.map(build => {
              const sel = selectedSet.has(build.id)
              return (
                <BuildItem
                  key={build.id}
                  build={build}
                  selected={sel}
                  onAdd={() => add(build.id)}
                  onRemove={() => remove(build.id)}
                />
              )
            })}
          </>
        )}

        <View style={{ height: 48 }} />
      </ScrollView>
    </View>
  )
}

const THUMB = 56

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
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
  headerTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  backBtn: { padding: 4, width: 44 },
  saveBtn: { padding: 4, width: 44, alignItems: 'flex-end' },
  saveBtnText: { color: colors.accent, fontSize: 15, fontWeight: '700' },
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionLabel: {
    color: colors.textTertiary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  sectionNote: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '600',
  },
  emptyNote: {
    color: colors.textTertiary,
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  itemSelected: {
    backgroundColor: colors.surface1,
  },
  itemThumb: {
    width: THUMB,
    height: THUMB,
    position: 'relative',
    flexShrink: 0,
  },
  thumbImg: {
    width: THUMB,
    height: THUMB,
    backgroundColor: colors.surface2,
  },
  thumbFallback: {
    backgroundColor: colors.surface2,
  },
  avatarRing: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
  },
  avatarPro: { borderColor: colors.accent },
  avatarDefault: { borderColor: 'rgba(255,255,255,0.75)' },
  avatarImg: { width: '100%', height: '100%' },
  avatarLetter: { color: '#fff', fontSize: 9, fontWeight: '700' },
  itemInfo: { flex: 1, minWidth: 0 },
  itemName: { color: colors.textPrimary, fontSize: 14, fontWeight: '700' },
  itemMeta: { color: colors.textTertiary, fontSize: 12, marginTop: 2 },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
})
