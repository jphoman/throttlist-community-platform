import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from 'react-native'
import { router } from 'expo-router'
import { ArrowLeft, ProBadge, CheckCircle, DollarSign, ExternalLink } from '@/components/Icons'
import { colors } from '@/constants/throttlist'

const MEMBER_SINCE = 'March 12, 2024'
const RENEWAL_DATE = 'June 12, 2026'

export default function MembershipScreen() {
  function handleStripe() {
    Alert.alert(
      'Stripe Payout Account',
      'Your Stripe payout account is linked. Visit your Stripe dashboard to manage bank account details, view payout history, and update tax information.',
      [{ text: 'OK' }]
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.textSecondary} />
        </Pressable>
        <Text style={styles.headerTitle}>Pro Membership</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Status card */}
        <View style={styles.statusCard}>
          <View style={styles.statusTop}>
            <View style={styles.statusBadgeRow}>
              <ProBadge size={20} />
              <Text style={styles.statusTitle}>Pro Member</Text>
            </View>
            <View style={styles.activePill}>
              <CheckCircle size={12} color="#22c55e" />
              <Text style={styles.activeText}>Active</Text>
            </View>
          </View>
          <Text style={styles.statusMeta}>Member since {MEMBER_SINCE}</Text>
        </View>

        {/* Subscription info */}
        <Text style={styles.sectionLabel}>Subscription</Text>
        <View style={styles.group}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Plan</Text>
            <Text style={styles.rowValue}>Throttlist Pro</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Status</Text>
            <Text style={[styles.rowValue, { color: '#22c55e' }]}>Active</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Auto-renews</Text>
            <Text style={styles.rowValue}>{RENEWAL_DATE}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Member since</Text>
            <Text style={styles.rowValue}>{MEMBER_SINCE}</Text>
          </View>
        </View>

        {/* Payout */}
        <Text style={styles.sectionLabel}>Payouts</Text>
        <View style={styles.group}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Payout account</Text>
            <View style={styles.linkedPill}>
              <Text style={styles.linkedText}>Linked</Text>
            </View>
          </View>
          <View style={styles.separator} />
          <Pressable style={styles.row} onPress={handleStripe}>
            <View style={styles.rowLeft}>
              <DollarSign size={16} color={colors.textSecondary} />
              <Text style={styles.rowText}>Edit Payout Info</Text>
            </View>
            <ExternalLink size={15} color={colors.textTertiary} />
          </Pressable>
        </View>

        <Text style={styles.footerNote}>
          Payout settings are managed securely through Stripe. Throttlist does not store your banking information.
        </Text>

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
  content: { paddingBottom: 24 },
  statusCard: {
    margin: 16,
    backgroundColor: colors.surface1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent + '55',
    padding: 20,
    gap: 8,
  },
  statusTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#22c55e22',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activeText: { color: '#22c55e', fontSize: 12, fontWeight: '600' },
  statusMeta: { color: colors.textTertiary, fontSize: 13 },
  sectionLabel: {
    color: colors.textTertiary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  group: {
    backgroundColor: colors.surface1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowLabel: { color: colors.textSecondary, fontSize: 15 },
  rowValue: { color: colors.textPrimary, fontSize: 15, fontWeight: '500' },
  rowText: { color: colors.textPrimary, fontSize: 15 },
  separator: { height: 1, backgroundColor: colors.border, marginLeft: 16 },
  linkedPill: {
    backgroundColor: colors.surface2,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  linkedText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  footerNote: {
    color: colors.textTertiary,
    fontSize: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    lineHeight: 18,
  },
})
