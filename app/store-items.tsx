import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Platform,
} from 'react-native'
import { router } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Search, X, Plus, Trash, Tag, ShoppingCart } from '@/components/Icons'
import {
  getUserStoreItems, setUserStoreItems, getUserParts,
  type StoreItem,
} from '@/lib/data'
import type { Part } from '@/types'
import { colors, MOCK_USER_ID } from '@/constants/throttlist'

const MAX_ITEMS = 20

const MOCK_META_RESULTS = [
  { id: 'meta_m1', title: 'Cappuccinomoto Classic Tee', price: 35, link: 'https://www.facebook.com/marketplace/cappuccinomoto/shop' },
  { id: 'meta_m2', title: 'Cappuccinomoto Hoodie — Black', price: 65, link: 'https://www.facebook.com/marketplace/cappuccinomoto/shop' },
  { id: 'meta_m3', title: 'Limited Edition Moto Print', price: 45, link: 'https://www.facebook.com/marketplace/cappuccinomoto/shop' },
  { id: 'meta_m4', title: 'Rider Sticker Pack', price: 12, link: 'https://www.facebook.com/marketplace/cappuccinomoto/shop' },
]

export default function StoreItemsScreen() {
  const queryClient = useQueryClient()

  const [storeList, setStoreList] = useState<StoreItem[]>(() => [...getUserStoreItems(MOCK_USER_ID)])
  const allParts: Part[] = useMemo(() => getUserParts(MOCK_USER_ID) as Part[], [])

  const [tagQuery, setTagQuery] = useState('')
  const [metaQuery, setMetaQuery] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaPrice, setMetaPrice] = useState('')
  const [metaUrl, setMetaUrl] = useState('')

  const taggedPartIds = new Set(storeList.filter(i => i.source === 'tagged').map(i => i.id.replace('part_store_', '')))

  const tagResults = useMemo(() => {
    const q = tagQuery.trim().toLowerCase()
    if (!q) return []
    return allParts.filter(p =>
      !taggedPartIds.has(p.id) &&
      (`${p.name} ${p.category}`).toLowerCase().includes(q)
    )
  }, [tagQuery, storeList])

  const metaResults = useMemo(() => {
    const q = metaQuery.trim().toLowerCase()
    if (!q) return []
    return MOCK_META_RESULTS.filter(r =>
      r.title.toLowerCase().includes(q) &&
      !storeList.find(i => i.id === r.id)
    )
  }, [metaQuery, storeList])

  function addTaggedPart(part: Part) {
    if (storeList.length >= MAX_ITEMS) {
      Alert.alert('Limit reached', `You can have up to ${MAX_ITEMS} items in your store.`)
      return
    }
    const newItem: StoreItem = {
      id: `part_store_${part.id}`,
      userId: MOCK_USER_ID,
      title: part.name,
      price: 0,
      link: part.sourceUrl ?? '',
      source: 'tagged',
    }
    setStoreList(prev => [...prev, newItem])
    setTagQuery('')
  }

  function addMetaResult(result: typeof MOCK_META_RESULTS[0]) {
    if (storeList.length >= MAX_ITEMS) {
      Alert.alert('Limit reached', `You can have up to ${MAX_ITEMS} items in your store.`)
      return
    }
    const newItem: StoreItem = {
      id: result.id,
      userId: MOCK_USER_ID,
      title: result.title,
      price: result.price,
      link: result.link,
      source: 'facebook',
    }
    setStoreList(prev => [...prev, newItem])
    setMetaQuery('')
  }

  function addMetaManual() {
    if (!metaTitle.trim() || !metaUrl.trim()) {
      Alert.alert('Missing fields', 'Please enter a title and URL.')
      return
    }
    if (storeList.length >= MAX_ITEMS) {
      Alert.alert('Limit reached', `You can have up to ${MAX_ITEMS} items in your store.`)
      return
    }
    const newItem: StoreItem = {
      id: `meta_${Date.now()}`,
      userId: MOCK_USER_ID,
      title: metaTitle.trim(),
      price: parseFloat(metaPrice) || 0,
      link: metaUrl.trim(),
      source: 'facebook',
    }
    setStoreList(prev => [...prev, newItem])
    setMetaTitle('')
    setMetaPrice('')
    setMetaUrl('')
  }

  function moveItem(idx: number, dir: -1 | 1) {
    const next = [...storeList]
    const swap = idx + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    setStoreList(next)
  }

  function removeItem(idx: number) {
    setStoreList(prev => prev.filter((_, i) => i !== idx))
  }

  function save() {
    setUserStoreItems(MOCK_USER_ID, storeList)
    queryClient.invalidateQueries({ queryKey: ['profile'] })
    queryClient.invalidateQueries({ queryKey: ['user-profile'] })
    router.back()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.textSecondary} />
        </Pressable>
        <Text style={styles.headerTitle}>Store Items</Text>
        <Pressable onPress={save} style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Tag search */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBox}>
            <Tag size={15} color={colors.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search tagged parts from your builds…"
              placeholderTextColor={colors.textTertiary}
              value={tagQuery}
              onChangeText={setTagQuery}
              autoCapitalize="none"
              returnKeyType="search"
            />
            {tagQuery.length > 0 && (
              <Pressable onPress={() => setTagQuery('')}>
                <X size={14} color={colors.textTertiary} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Tag search results */}
        {tagResults.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>TAG RESULTS ({tagResults.length})</Text>
            </View>
            {tagResults.map(part => (
              <Pressable key={part.id} style={styles.resultRow} onPress={() => addTaggedPart(part)}>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName} numberOfLines={1}>{part.name}</Text>
                  <Text style={styles.resultMeta}>{part.category}</Text>
                </View>
                <View style={styles.addBtn}>
                  <Plus size={14} color={colors.accent} />
                </View>
              </Pressable>
            ))}
          </>
        )}

        {tagQuery.trim().length > 0 && tagResults.length === 0 && (
          <Text style={styles.emptyNote}>No tagged parts match "{tagQuery}".</Text>
        )}

        {/* Current store items */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>STORE ITEMS ({storeList.length}/{MAX_ITEMS})</Text>
        </View>

        {storeList.length === 0 && (
          <Text style={styles.emptyNote}>No store items yet. Search your tags or add from Meta below.</Text>
        )}

        {storeList.map((item, idx) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={[styles.itemSource, item.source === 'facebook' && styles.itemSourceMeta]} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.itemMeta}>
                {item.source === 'facebook' ? 'META' : 'TAGGED'}
                {item.price > 0 ? ` · $${item.price}` : ''}
              </Text>
            </View>
            <View style={styles.itemActions}>
              <Pressable onPress={() => moveItem(idx, -1)} style={styles.arrow} disabled={idx === 0}>
                <Text style={[styles.arrowText, idx === 0 && { opacity: 0.25 }]}>↑</Text>
              </Pressable>
              <Pressable onPress={() => moveItem(idx, 1)} style={styles.arrow} disabled={idx === storeList.length - 1}>
                <Text style={[styles.arrowText, idx === storeList.length - 1 && { opacity: 0.25 }]}>↓</Text>
              </Pressable>
              <Pressable onPress={() => removeItem(idx)} style={styles.arrow}>
                <Trash size={14} color={colors.accent} />
              </Pressable>
            </View>
          </View>
        ))}

        {/* Meta shop section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>ADD FROM META SHOP</Text>
        </View>

        <View style={styles.metaSearchWrap}>
          <View style={styles.searchBox}>
            <Search size={15} color={colors.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search your Facebook Shop…"
              placeholderTextColor={colors.textTertiary}
              value={metaQuery}
              onChangeText={setMetaQuery}
              autoCapitalize="none"
              returnKeyType="search"
            />
            {metaQuery.length > 0 && (
              <Pressable onPress={() => setMetaQuery('')}>
                <X size={14} color={colors.textTertiary} />
              </Pressable>
            )}
          </View>
        </View>

        {metaResults.length > 0 && (
          <>
            {metaResults.map(result => (
              <Pressable key={result.id} style={styles.resultRow} onPress={() => addMetaResult(result)}>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName} numberOfLines={1}>{result.title}</Text>
                  <Text style={styles.resultMeta}>META · ${result.price}</Text>
                </View>
                <View style={styles.addBtn}>
                  <Plus size={14} color={colors.accent} />
                </View>
              </Pressable>
            ))}
          </>
        )}

        {metaQuery.trim().length > 0 && metaResults.length === 0 && (
          <Text style={styles.emptyNote}>No Meta shop results for "{metaQuery}".</Text>
        )}

        {/* Manual add form */}
        <View style={styles.manualForm}>
          <Text style={styles.manualLabel}>Add manually</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Item title"
            placeholderTextColor={colors.textTertiary}
            value={metaTitle}
            onChangeText={setMetaTitle}
          />
          <View style={styles.formRow}>
            <TextInput
              style={[styles.formInput, { flex: 1 }]}
              placeholder="Price"
              placeholderTextColor={colors.textTertiary}
              value={metaPrice}
              onChangeText={setMetaPrice}
              keyboardType="decimal-pad"
            />
            <TextInput
              style={[styles.formInput, { flex: 2 }]}
              placeholder="Facebook Shop URL"
              placeholderTextColor={colors.textTertiary}
              value={metaUrl}
              onChangeText={setMetaUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <Pressable style={styles.addManualBtn} onPress={addMetaManual}>
            <Plus size={14} color="#fff" />
            <Text style={styles.addManualBtnText}>Add item</Text>
          </Pressable>
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>
    </View>
  )
}

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
    paddingTop: 12,
    paddingBottom: 4,
  },
  metaSearchWrap: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
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
  emptyNote: {
    color: colors.textTertiary,
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface1,
    gap: 12,
  },
  resultInfo: { flex: 1 },
  resultName: { color: colors.textPrimary, fontSize: 14, fontWeight: '500' },
  resultMeta: { color: colors.textTertiary, fontSize: 12, marginTop: 2 },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface1,
    gap: 10,
  },
  itemSource: {
    width: 8,
    height: 36,
    borderRadius: 4,
    backgroundColor: colors.textTertiary + '66',
    flexShrink: 0,
  },
  itemSourceMeta: { backgroundColor: '#1877f2' },
  itemInfo: { flex: 1 },
  itemName: { color: colors.textPrimary, fontSize: 14, fontWeight: '500' },
  itemMeta: { color: colors.textTertiary, fontSize: 12, marginTop: 2 },
  itemActions: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  arrow: { padding: 6 },
  arrowText: { color: colors.textSecondary, fontSize: 18, fontWeight: '700' },
  manualForm: {
    marginHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  manualLabel: {
    color: colors.textTertiary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  formInput: {
    backgroundColor: colors.surface1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formRow: { flexDirection: 'row', gap: 8 },
  addManualBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 11,
  },
  addManualBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
})
