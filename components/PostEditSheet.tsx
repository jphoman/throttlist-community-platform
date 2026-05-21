import React, { useState, useEffect, useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  Switch,
  Image,
  Platform,
  KeyboardAvoidingView,
  Alert,
  FlatList,
} from 'react-native'
import { X, Pin, Lock, Globe, Trash, Camera, ChevronRight } from '@/components/Icons'
import { colors } from '@/constants/throttlist'
import type { Post, Part } from '@/types'

interface PostEditSheetProps {
  visible: boolean
  post: Post
  parts: Part[]
  suggestedPartIds: string[]
  isPinned: boolean
  onClose: () => void
  onSave: (updates: { caption: string; isPrivate: boolean; taggedPartIds: string[] }) => void
  onTogglePin: () => void
  onDelete: () => void
}

// Inline part picker shown when adding/editing a tag slot
function PartPicker({
  parts,
  suggestedPartIds,
  excludeIds,
  onSelect,
  onDismiss,
}: {
  parts: Part[]
  suggestedPartIds: string[]
  excludeIds: string[]
  onSelect: (part: Part) => void
  onDismiss: () => void
}) {
  const [query, setQuery] = useState('')

  const { suggested, rest } = useMemo(() => {
    const q = query.toLowerCase()
    const available = parts.filter(p => !excludeIds.includes(p.id))
    const filtered = q
      ? available.filter(p => p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
      : available

    const suggestedSet = new Set(suggestedPartIds)
    const suggested = filtered.filter(p => suggestedSet.has(p.id))
    const rest = filtered.filter(p => !suggestedSet.has(p.id))
    return { suggested, rest }
  }, [query, parts, suggestedPartIds, excludeIds])

  const sections: { title?: string; data: Part[] }[] = []
  if (!query && suggested.length > 0) sections.push({ title: 'Suggested from this build', data: suggested })
  else if (query && suggested.length > 0) sections.push({ title: 'Suggested', data: suggested })
  if (rest.length > 0) sections.push({ title: suggested.length > 0 ? 'Other parts' : undefined, data: rest })

  return (
    <View style={pickerStyles.container}>
      <View style={pickerStyles.searchRow}>
        <TextInput
          style={pickerStyles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search parts…"
          placeholderTextColor={colors.textTertiary}
          autoFocus
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
        <Pressable onPress={onDismiss} style={pickerStyles.cancelBtn}>
          <Text style={pickerStyles.cancelText}>Cancel</Text>
        </Pressable>
      </View>

      <ScrollView
        style={pickerStyles.list}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {sections.map((section, si) => (
          <View key={si}>
            {section.title ? (
              <Text style={pickerStyles.sectionHeader}>{section.title}</Text>
            ) : null}
            {section.data.map(part => (
              <Pressable key={part.id} style={pickerStyles.partRow} onPress={() => onSelect(part)}>
                <View style={pickerStyles.partInfo}>
                  <Text style={pickerStyles.partName}>{part.name}</Text>
                  {part.category ? <Text style={pickerStyles.partCat}>{part.category}</Text> : null}
                </View>
                {part.type === 'linkable' && <View style={pickerStyles.linkDot} />}
              </Pressable>
            ))}
          </View>
        ))}
        {suggested.length === 0 && rest.length === 0 && (
          <Text style={pickerStyles.empty}>No matching parts</Text>
        )}
      </ScrollView>
    </View>
  )
}

export default function PostEditSheet({
  visible,
  post,
  parts,
  suggestedPartIds,
  isPinned,
  onClose,
  onSave,
  onTogglePin,
  onDelete,
}: PostEditSheetProps) {
  const [caption, setCaption] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  const [taggedIds, setTaggedIds] = useState<string[]>([])
  const [pickingSlot, setPickingSlot] = useState<number | null>(null) // -1 = add new, 0+ = swap slot

  useEffect(() => {
    if (visible) {
      setCaption(post.caption ?? '')
      setIsPrivate(false)
      const parsedPhotos: string[] = (() => { try { return JSON.parse(post.photos) } catch { return [] } })()
      setPhotos(parsedPhotos)
      const parsedIds: string[] = (() => { try { return JSON.parse(post.taggedPartIds) } catch { return [] } })()
      setTaggedIds(parsedIds)
      setPickingSlot(null)
    }
  }, [visible, post])

  function removePhoto(uri: string) {
    setPhotos(prev => prev.filter(p => p !== uri))
  }

  function handlePickerSelect(part: Part) {
    if (pickingSlot === -1) {
      setTaggedIds(prev => [...prev, part.id])
    } else if (pickingSlot !== null) {
      setTaggedIds(prev => prev.map((id, i) => i === pickingSlot ? part.id : id))
    }
    setPickingSlot(null)
  }

  function removeTag(index: number) {
    setTaggedIds(prev => prev.filter((_, i) => i !== index))
    setPickingSlot(null)
  }

  function handleSave() {
    onSave({ caption: caption.trim(), isPrivate, taggedPartIds: taggedIds })
    onClose()
  }

  function handleDelete() {
    Alert.alert(
      'Delete Post',
      'This post will be permanently removed. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => { onDelete(); onClose() },
        },
      ],
    )
  }

  const pickerExcludeIds = pickingSlot !== null && pickingSlot >= 0
    ? taggedIds.filter((_, i) => i !== pickingSlot)
    : taggedIds

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          style={styles.sheetWrap}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.sheet}>
            <View style={styles.handle} />

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Edit Post</Text>
              <Pressable onPress={onClose} style={styles.closeBtn}>
                <X size={20} color={colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Photos */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Photos</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.photosRow}
                >
                  {photos.map((uri, i) => (
                    <View key={i} style={styles.photoWrap}>
                      <Image source={{ uri }} style={styles.photoThumb} resizeMode="cover" />
                      <Pressable style={styles.photoRemove} onPress={() => removePhoto(uri)}>
                        <X size={11} color="#fff" />
                      </Pressable>
                    </View>
                  ))}
                  <Pressable style={styles.addPhotoBtn}>
                    <Camera size={20} color={colors.textTertiary} />
                    <Text style={styles.addPhotoBtnText}>Add</Text>
                  </Pressable>
                </ScrollView>
              </View>

              {/* Caption */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Caption</Text>
                <TextInput
                  style={[styles.input, styles.captionInput]}
                  value={caption}
                  onChangeText={setCaption}
                  placeholder="Write a caption…"
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  maxLength={1000}
                />
              </View>

              {/* Tagged Parts — editable list */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Tagged Parts</Text>

                {taggedIds.map((partId, idx) => {
                  const part = parts.find(p => p.id === partId)
                  const isEditingThis = pickingSlot === idx
                  return (
                    <View key={partId + idx}>
                      <Pressable
                        style={[styles.tagRow, isEditingThis && styles.tagRowActive]}
                        onPress={() => setPickingSlot(isEditingThis ? null : idx)}
                      >
                        <View style={styles.tagDot} />
                        <View style={styles.tagInfo}>
                          <Text style={styles.tagName} numberOfLines={1}>
                            {part?.name ?? 'Unknown part'}
                          </Text>
                          {part?.category ? (
                            <Text style={styles.tagCat}>{part.category}</Text>
                          ) : null}
                        </View>
                        <Text style={styles.tagEditHint}>
                          {isEditingThis ? 'picking…' : 'change'}
                        </Text>
                        <Pressable
                          style={styles.tagRemoveBtn}
                          onPress={(e) => { e.stopPropagation?.(); removeTag(idx) }}
                          hitSlop={8}
                        >
                          <X size={14} color={colors.textTertiary} />
                        </Pressable>
                      </Pressable>

                      {isEditingThis && (
                        <PartPicker
                          parts={parts}
                          suggestedPartIds={suggestedPartIds}
                          excludeIds={pickerExcludeIds}
                          onSelect={handlePickerSelect}
                          onDismiss={() => setPickingSlot(null)}
                        />
                      )}
                    </View>
                  )
                })}

                {/* Add tag */}
                {pickingSlot === -1 ? (
                  <PartPicker
                    parts={parts}
                    suggestedPartIds={suggestedPartIds}
                    excludeIds={pickerExcludeIds}
                    onSelect={handlePickerSelect}
                    onDismiss={() => setPickingSlot(null)}
                  />
                ) : (
                  <Pressable
                    style={styles.addTagBtn}
                    onPress={() => setPickingSlot(-1)}
                  >
                    <Text style={styles.addTagText}>+ Add tag</Text>
                  </Pressable>
                )}
              </View>

              {/* Pin to top */}
              <View style={styles.section}>
                <Pressable style={styles.toggleRow} onPress={onTogglePin}>
                  <Pin size={16} color={isPinned ? colors.accent : colors.textSecondary} />
                  <View style={styles.toggleInfo}>
                    <Text style={styles.toggleLabel}>Pin to Top</Text>
                    <Text style={styles.toggleHint}>Pinned post stays at the top of your build page</Text>
                  </View>
                  <Switch
                    value={isPinned}
                    onValueChange={onTogglePin}
                    trackColor={{ false: colors.surface3, true: colors.accent }}
                    thumbColor="#fff"
                  />
                </Pressable>
              </View>

              {/* Privacy */}
              <View style={styles.section}>
                <View style={styles.toggleRow}>
                  {isPrivate
                    ? <Lock size={16} color={colors.textSecondary} />
                    : <Globe size={16} color={colors.green} />
                  }
                  <View style={styles.toggleInfo}>
                    <Text style={styles.toggleLabel}>
                      {isPrivate ? 'Private' : 'Public'}
                    </Text>
                    <Text style={styles.toggleHint}>
                      {isPrivate
                        ? 'Only you can see this post'
                        : 'Visible to everyone who follows this build'}
                    </Text>
                  </View>
                  <Switch
                    value={isPrivate}
                    onValueChange={setIsPrivate}
                    trackColor={{ false: colors.surface3, true: colors.accent }}
                    thumbColor="#fff"
                  />
                </View>
              </View>

              {/* Delete */}
              <View style={[styles.section, { borderBottomWidth: 0, paddingBottom: 16 }]}>
                <Pressable style={styles.deleteBtn} onPress={handleDelete}>
                  <Trash size={16} color={colors.accent} />
                  <Text style={styles.deleteBtnText}>Delete Post</Text>
                </Pressable>
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <Pressable style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  )
}

const pickerStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surface3,
    marginTop: 6,
    marginBottom: 4,
    overflow: 'hidden',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    paddingVertical: 4,
  },
  cancelBtn: { paddingHorizontal: 4 },
  cancelText: {
    color: colors.textTertiary,
    fontSize: 13,
  },
  list: { maxHeight: 200 },
  sectionHeader: {
    color: colors.textTertiary,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 4,
  },
  partRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  partInfo: { flex: 1 },
  partName: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },
  partCat: {
    color: colors.textTertiary,
    fontSize: 11,
    marginTop: 1,
  },
  linkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    flexShrink: 0,
  },
  empty: {
    color: colors.textTertiary,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 16,
  },
})

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheetWrap: {
    maxHeight: '92%',
  },
  sheet: {
    backgroundColor: colors.surface1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surface3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  closeBtn: { padding: 4 },
  scroll: { maxHeight: 520 },
  scrollContent: { paddingBottom: 8 },
  section: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  // Photos
  photosRow: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 4,
  },
  photoWrap: {
    position: 'relative',
    width: 76,
    height: 76,
    borderRadius: 10,
    overflow: 'hidden',
  },
  photoThumb: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface2,
  },
  photoRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoBtn: {
    width: 76,
    height: 76,
    borderRadius: 10,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.surface3,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addPhotoBtnText: {
    color: colors.textTertiary,
    fontSize: 11,
  },
  // Caption
  input: {
    backgroundColor: colors.surface2,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: colors.textPrimary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.surface3,
    marginBottom: 4,
  },
  captionInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  // Tagged parts list
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
    backgroundColor: colors.surface2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.surface3,
    marginBottom: 6,
  },
  tagRowActive: {
    borderColor: colors.accent + '88',
    backgroundColor: colors.accent + '11',
  },
  tagDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent,
    flexShrink: 0,
  },
  tagInfo: { flex: 1 },
  tagName: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },
  tagCat: {
    color: colors.textTertiary,
    fontSize: 11,
    marginTop: 1,
  },
  tagEditHint: {
    color: colors.textTertiary,
    fontSize: 11,
  },
  tagRemoveBtn: {
    padding: 2,
  },
  addTagBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.surface3,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginTop: 2,
  },
  addTagText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  // Toggle rows
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface2,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.surface3,
    marginBottom: 8,
  },
  toggleInfo: { flex: 1 },
  toggleLabel: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  toggleHint: {
    color: colors.textTertiary,
    fontSize: 11,
    marginTop: 2,
  },
  // Delete
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: colors.accent + '18',
    borderWidth: 1,
    borderColor: colors.accent + '44',
    marginTop: 4,
  },
  deleteBtnText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  // Footer
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.surface3,
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 2,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    backgroundColor: colors.accent,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
})
