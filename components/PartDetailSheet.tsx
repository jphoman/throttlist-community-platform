import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  Linking,
  Platform,
} from 'react-native'
import { X, ExternalLink, ShoppingCart, Wrench, Palette } from '@blinkdotnew/mobile-ui'
import { colors, buildAffiliateUrl } from '@/constants/throttlist'
import type { Part } from '@/types'

interface PartDetailSheetProps {
  part: Part | null
  visible: boolean
  onClose: () => void
  affiliateDisclosureDismissed?: boolean
  onDismissDisclosure?: () => void
}

export default function PartDetailSheet({
  part,
  visible,
  onClose,
  affiliateDisclosureDismissed = false,
  onDismissDisclosure,
}: PartDetailSheetProps) {
  const [showDisclosure, setShowDisclosure] = useState(false)

  if (!part) return null

  function handleShop() {
    if (!part?.sourceUrl) return
    if (!affiliateDisclosureDismissed) {
      setShowDisclosure(true)
    } else {
      openShopLink()
    }
  }

  function openShopLink() {
    if (!part?.sourceUrl) return
    const url = buildAffiliateUrl(part.sourceUrl)
    Linking.openURL(url)
    setShowDisclosure(false)
  }

  function handleDisclosureContinue() {
    onDismissDisclosure?.()
    openShopLink()
  }

  const typeIcon = part.type === 'reference'
    ? <Palette size={16} color={colors.textSecondary} />
    : part.type === 'service'
    ? <Wrench size={16} color={colors.textSecondary} />
    : <ShoppingCart size={16} color={colors.accent} />

  const typeLabel =
    part.type === 'linkable' ? 'Shop Link'
    : part.type === 'reference' ? 'Reference'
    : 'Service'

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.sheetHeader}>
          <View style={styles.typePill}>
            {typeIcon}
            <Text style={[
              styles.typeLabel,
              part.type === 'linkable' && { color: colors.accent },
            ]}>
              {typeLabel}
            </Text>
          </View>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <X size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.partName}>{part.name}</Text>
          <Text style={styles.partCategory}>{part.category}</Text>

          {part.notes && (
            <View style={styles.notesBox}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text style={styles.notesText}>{part.notes}</Text>
            </View>
          )}

          {part.type === 'linkable' && part.sourceUrl && !showDisclosure && (
            <Pressable style={styles.shopBtn} onPress={handleShop}>
              <ExternalLink size={16} color="#fff" />
              <Text style={styles.shopBtnText}>Shop ↗</Text>
            </Pressable>
          )}
        </ScrollView>

        {/* Affiliate disclosure */}
        {showDisclosure && (
          <View style={styles.disclosureBox}>
            <Text style={styles.disclosureTitle}>Affiliate Link</Text>
            <Text style={styles.disclosureBody}>
              This is an affiliate link. Throttlist earns a small commission if you purchase — at no extra cost to you.
            </Text>
            <Pressable style={styles.disclosureBtn} onPress={handleDisclosureContinue}>
              <Text style={styles.disclosureBtnText}>Continue to shop</Text>
            </Pressable>
            <Pressable
              style={styles.disclosureDismissBtn}
              onPress={handleDisclosureContinue}
            >
              <Text style={styles.disclosureDismissText}>Got it, don't show again</Text>
            </Pressable>
          </View>
        )}

        <View style={{ height: Platform.OS === 'ios' ? 34 : 16 }} />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: colors.surface1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 260,
    maxHeight: '70%',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: colors.surface3,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface2,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  typeLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
  },
  partName: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 4,
  },
  partCategory: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notesBox: {
    backgroundColor: colors.surface2,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  notesLabel: {
    color: colors.textTertiary,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  notesText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  shopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 8,
  },
  shopBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  disclosureBox: {
    margin: 16,
    backgroundColor: colors.surface2,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disclosureTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  disclosureBody: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  disclosureBtn: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  disclosureBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  disclosureDismissBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  disclosureDismissText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
})
