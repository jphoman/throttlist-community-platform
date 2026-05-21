import React, { useState } from 'react'
import { View, Text, StyleSheet, Pressable, TextInput, Platform, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { ArrowLeft, Star, DollarSign, TrendingUp, CheckCircle } from '@/components/Icons'
import { colors } from '@/constants/throttlist'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function ProWaitlistScreen() {
  const insets = useSafeAreaInsets()
  const [email, setEmail] = useState('marco@example.com')
  const [joined, setJoined] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleJoin() {
    if (!email.trim() || loading) return
    setLoading(true)
    try {
      // no-op: waitlist submission not yet implemented
      setJoined(true)
    } catch (e) {
      setJoined(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Icon */}
        <View style={styles.iconCircle}>
          <Star size={32} color={colors.accent} fill={colors.accent} />
        </View>

        <Text style={styles.title}>Pro is coming soon</Text>
        <Text style={styles.subtitle}>
          Earn 70% of affiliate commissions on every part link you share.
          Be first to know when Pro launches.
        </Text>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.featureRow}>
            <DollarSign size={18} color={colors.accent} />
            <Text style={styles.featureText}>Keep 70% of every affiliate commission</Text>
          </View>
          <View style={styles.featureRow}>
            <TrendingUp size={18} color={colors.accent} />
            <Text style={styles.featureText}>Advanced analytics on your links</Text>
          </View>
          <View style={styles.featureRow}>
            <Star size={18} color={colors.accent} />
            <Text style={styles.featureText}>PRO badge on your builds and profile</Text>
          </View>
        </View>

        {/* Callout */}
        <View style={styles.callout}>
          <Text style={styles.calloutText}>
            You generated an estimated{' '}
            <Text style={styles.calloutAmount}>$62</Text>
            {' '}in commission this month.{'\n'}
            Upgrade to Pro to keep 70% — that's{' '}
            <Text style={styles.calloutAmount}>$43.40</Text> back in your pocket.
          </Text>
        </View>

        {joined ? (
          <View style={styles.successBox}>
            <CheckCircle size={24} color={colors.green} />
            <Text style={styles.successTitle}>You're on the list!</Text>
            <Text style={styles.successBody}>
              We'll email you when Pro launches. First come, first served.
            </Text>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.formLabel}>Email address</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={[styles.input, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
              placeholderTextColor={colors.textTertiary}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Pressable
              style={[styles.joinBtn, loading && styles.joinBtnDisabled]}
              onPress={handleJoin}
            >
              <Text style={styles.joinBtnText}>
                {loading ? 'Joining...' : 'Join the waitlist'}
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: 4, alignSelf: 'flex-start' },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.accent + '44',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  features: {
    width: '100%',
    gap: 14,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface1,
    borderRadius: 8,
    padding: 14,
  },
  featureText: {
    color: colors.textSecondary,
    fontSize: 14,
    flex: 1,
  },
  callout: {
    width: '100%',
    backgroundColor: colors.accent + '18',
    borderWidth: 1,
    borderColor: colors.accent + '44',
    borderRadius: 10,
    padding: 16,
    marginBottom: 28,
  },
  calloutText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  calloutAmount: {
    color: colors.accent,
    fontWeight: '700',
  },
  form: {
    width: '100%',
    gap: 10,
  },
  formLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: colors.textPrimary,
    fontSize: 15,
  },
  joinBtn: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  joinBtnDisabled: { opacity: 0.6 },
  joinBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  successBox: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.surface1,
    borderRadius: 12,
    padding: 24,
    gap: 10,
  },
  successTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  successBody: { color: colors.textSecondary, fontSize: 14, textAlign: 'center', lineHeight: 20 },
})
