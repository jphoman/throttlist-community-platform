import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  Switch,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native'
import { X, Camera, Plus, Lock, Globe } from '@/components/Icons'
import { colors } from '@/constants/throttlist'
import type { Build } from '@/types'

interface BuildEditSheetProps {
  visible: boolean
  build: Build
  onClose: () => void
  onSave: (updates: {
    nickname?: string
    tags?: string[]
    isPrivate?: boolean
  }) => void
}

export default function BuildEditSheet({ visible, build, onClose, onSave }: BuildEditSheetProps) {
  const [nickname, setNickname] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)

  useEffect(() => {
    if (visible) {
      setNickname(build.nickname ?? '')
      const parsed: string[] = (() => { try { return JSON.parse(build.tags) } catch { return [] } })()
      setTags(parsed)
      setIsPrivate(build.status === 'private')
    }
  }, [visible, build])

  function addTag() {
    const raw = tagInput.trim().toLowerCase().replace(/^#/, '').replace(/\s+/g, '-')
    if (!raw || tags.includes(raw)) { setTagInput(''); return }
    setTags(prev => [...prev, raw])
    setTagInput('')
  }

  function removeTag(tag: string) {
    setTags(prev => prev.filter(t => t !== tag))
  }

  function handleSave() {
    onSave({ nickname: nickname.trim(), tags, isPrivate })
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          style={styles.sheetWrap}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.sheet}>
            {/* Handle */}
            <View style={styles.handle} />

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Edit Build</Text>
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
              {/* Cover photo */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Cover Photo</Text>
                <Pressable style={styles.coverPhotoBtn}>
                  <Camera size={18} color={colors.textSecondary} />
                  <Text style={styles.coverPhotoBtnText}>Change Cover Photo</Text>
                </Pressable>
              </View>

              {/* Nickname */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Build Nickname</Text>
                <TextInput
                  style={styles.input}
                  value={nickname}
                  onChangeText={setNickname}
                  placeholder="e.g. The Cappuccino"
                  placeholderTextColor={colors.textTertiary}
                  returnKeyType="done"
                  maxLength={60}
                />
              </View>

              {/* Year / Make / Model — display only for now */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Bike</Text>
                <View style={styles.readonlyRow}>
                  <Text style={styles.readonlyValue}>
                    {build.year} {build.make} {build.model}
                  </Text>
                  <Text style={styles.readonlyHint}>Contact support to update</Text>
                </View>
              </View>

              {/* Hashtags */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Hashtags</Text>
                <View style={styles.tagWrap}>
                  {tags.map(tag => (
                    <View key={tag} style={styles.tagPill}>
                      <Text style={styles.tagPillText}>#{tag}</Text>
                      <Pressable onPress={() => removeTag(tag)} style={styles.tagRemove}>
                        <X size={11} color={colors.textSecondary} />
                      </Pressable>
                    </View>
                  ))}
                </View>
                <View style={styles.tagInputRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={tagInput}
                    onChangeText={setTagInput}
                    placeholder="#add-tag"
                    placeholderTextColor={colors.textTertiary}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={addTag}
                    maxLength={40}
                  />
                  <Pressable
                    style={[styles.addTagBtn, !tagInput.trim() && styles.addTagBtnDisabled]}
                    onPress={addTag}
                    disabled={!tagInput.trim()}
                  >
                    <Plus size={16} color={tagInput.trim() ? colors.accent : colors.textTertiary} />
                  </Pressable>
                </View>
              </View>

              {/* Privacy */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Visibility</Text>
                <View style={styles.toggleRow}>
                  {isPrivate
                    ? <Lock size={16} color={colors.textSecondary} />
                    : <Globe size={16} color={colors.green} />
                  }
                  <Text style={styles.toggleLabel}>
                    {isPrivate ? 'Private — only you can see this build' : 'Public — visible to everyone'}
                  </Text>
                  <Switch
                    value={isPrivate}
                    onValueChange={setIsPrivate}
                    trackColor={{ false: colors.surface3, true: colors.accent }}
                    thumbColor="#fff"
                  />
                </View>
              </View>

              <View style={{ height: 24 }} />
            </ScrollView>

            {/* Save */}
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

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheetWrap: {
    maxHeight: '90%',
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
  scroll: { maxHeight: 500 },
  scrollContent: { paddingBottom: 8 },
  // Sections
  section: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 4,
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
  // Cover photo
  coverPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface2,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.surface3,
    borderStyle: 'dashed',
    marginBottom: 8,
  },
  coverPhotoBtnText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  // Input
  input: {
    backgroundColor: colors.surface2,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: colors.textPrimary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.surface3,
    marginBottom: 8,
  },
  // Readonly
  readonlyRow: {
    backgroundColor: colors.surface2,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  readonlyValue: {
    color: colors.textPrimary,
    fontSize: 15,
  },
  readonlyHint: {
    color: colors.textTertiary,
    fontSize: 11,
  },
  // Tags
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 10,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.surface3,
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 6,
    paddingVertical: 5,
  },
  tagPillText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },
  tagRemove: {
    padding: 2,
  },
  tagInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  addTagBtn: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTagBtnDisabled: {
    backgroundColor: colors.surface2,
  },
  // Toggle
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface2,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.surface3,
  },
  toggleLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
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
