import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  Alert,
} from 'react-native'
import { router } from 'expo-router'
import {
  ArrowLeft,
  Star,
  CheckCircle,
  DollarSign,
  Lock,
} from '@/components/Icons'
import { colors } from '@/constants/throttlist'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Step = 'bank' | 'terms' | 'confirm'

const PRO_TC = `THROTTLIST PRO TERMS

Last updated: January 1, 2025

1. PRO SUBSCRIPTION
Throttlist Pro is billed at $7/month. Your first month is free during the Beta period. You may cancel at any time from Settings.

2. AFFILIATE PAYOUTS
Pro members earn 70% of net affiliate commissions generated through their part links. Throttlist retains 30% to cover platform and payment costs. Payout amounts vary by affiliate partner and are not guaranteed.

3. STRIPE CONNECTED ACCOUNT
Payouts are processed via Stripe Connect. By setting up a Stripe Connected Account you agree to the Stripe Connected Account Agreement (stripe.com/legal/connect-account). Throttlist is not responsible for Stripe's identity verification requirements or payout holds.

4. PAYOUT TIMING
Commissions are aggregated monthly. Payouts are sent to your linked bank account within 5 business days of the end of each calendar month, subject to a $10 minimum payout threshold.

5. ACCOUNT SUSPENSION
Throttlist reserves the right to suspend Pro access and withhold pending payouts if your account violates the Throttlist Terms of Service.

6. CHANGES TO PRO TERMS
We may update these terms at any time with 30 days notice. Continued use of Pro after notice constitutes acceptance.

Contact: pro@throttlist.com`

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  hint,
}: {
  label: string
  value: string
  onChangeText: (v: string) => void
  placeholder?: string
  secureTextEntry?: boolean
  keyboardType?: 'default' | 'numeric' | 'email-address'
  hint?: string
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {hint ? <Text style={styles.fieldHint}>{hint}</Text> : null}
      <TextInput
        style={[styles.fieldInput, Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  )
}

export default function ProSignupScreen() {
  const insets = useSafeAreaInsets()
  const [step, setStep] = useState<Step>('bank')

  // Bank step
  const [legalName, setLegalName] = useState('')
  const [accountType, setAccountType] = useState<'personal' | 'business'>('personal')
  const [routingNumber, setRoutingNumber] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [ssn, setSsn] = useState('')

  // Terms step
  const [accepted, setAccepted] = useState(false)

  const bankValid =
    legalName.trim().length > 1 &&
    routingNumber.length === 9 &&
    accountNumber.length >= 6 &&
    ssn.length >= 4

  function handleBack() {
    if (step === 'bank') { router.back(); return }
    if (step === 'terms') { setStep('bank'); return }
    if (step === 'confirm') { setStep('terms'); return }
  }

  function handleNext() {
    if (step === 'bank') { setStep('terms'); return }
    if (step === 'terms') { setStep('confirm'); return }
  }

  function handleActivate() {
    Alert.alert(
      'Pro activated!',
      'Your account is now Pro. Affiliate earnings will show up in your analytics dashboard within 24 hours.',
      [{ text: 'Go to my profile', onPress: () => router.replace('/(tabs)/profile') }]
    )
  }

  const stepIndex = step === 'bank' ? 0 : step === 'terms' ? 1 : 2

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.textSecondary} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {step === 'bank' ? 'Set up payouts' : step === 'terms' ? 'Pro Terms' : 'Review & activate'}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Progress */}
      <View style={styles.progress}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.dot, i <= stepIndex && styles.dotActive]} />
        ))}
      </View>

      {step === 'bank' && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.stripeNotice}>
            <Lock size={14} color={colors.textTertiary} />
            <Text style={styles.stripeNoticeText}>
              Bank details are securely transmitted to Stripe. Throttlist never stores your account or routing numbers.
            </Text>
          </View>

          <Text style={styles.headline}>Connect your bank</Text>
          <Text style={styles.sub}>
            Required by Stripe to verify your identity and send payouts. This is a one-time setup.
          </Text>

          {/* Account type */}
          <Text style={styles.fieldLabel}>Account type</Text>
          <View style={styles.typeRow}>
            {(['personal', 'business'] as const).map(t => (
              <Pressable
                key={t}
                style={[styles.typeBtn, accountType === t && styles.typeBtnSelected]}
                onPress={() => setAccountType(t)}
              >
                <Text style={[styles.typeBtnText, accountType === t && styles.typeBtnTextSelected]}>
                  {t === 'personal' ? 'Personal' : 'Business'}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.form}>
            <Field
              label="Legal name"
              value={legalName}
              onChangeText={setLegalName}
              placeholder={accountType === 'personal' ? 'Marco Rossi' : 'Rossi Racing LLC'}
              hint={accountType === 'personal' ? 'Must match your government ID' : 'Registered business name'}
            />
            <Field
              label="Routing number"
              value={routingNumber}
              onChangeText={v => setRoutingNumber(v.replace(/\D/g, '').slice(0, 9))}
              placeholder="9 digits"
              keyboardType="numeric"
            />
            <Field
              label="Account number"
              value={accountNumber}
              onChangeText={v => setAccountNumber(v.replace(/\D/g, ''))}
              placeholder="Bank account number"
              keyboardType="numeric"
              secureTextEntry
            />
            <Field
              label={accountType === 'personal' ? 'Last 4 of SSN' : 'EIN (last 4 digits)'}
              value={ssn}
              onChangeText={v => setSsn(v.replace(/\D/g, '').slice(0, 9))}
              placeholder={accountType === 'personal' ? '••••' : 'XX-XXXXXX'}
              keyboardType="numeric"
              secureTextEntry
              hint="Required by Stripe for identity verification (US law)"
            />
          </View>

          <View style={styles.stripeAttrib}>
            <Text style={styles.stripeAttribText}>
              Powered by{' '}
              <Text style={{ fontWeight: '700', color: '#635BFF' }}>Stripe Connect</Text>
              {' '}· Your data is protected by Stripe's PCI-DSS certified infrastructure.
            </Text>
          </View>

          <Pressable
            style={[styles.primaryBtn, !bankValid && styles.primaryBtnDim]}
            onPress={handleNext}
            disabled={!bankValid}
          >
            <Text style={styles.primaryBtnText}>Continue to Pro Terms</Text>
          </Pressable>
        </ScrollView>
      )}

      {step === 'terms' && (
        <View style={styles.termsWrap}>
          <Text style={styles.headline}>Pro Terms</Text>
          <Text style={styles.sub}>Read and accept the Pro subscription terms.</Text>
          <ScrollView style={styles.tcScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.tcText}>{PRO_TC}</Text>
          </ScrollView>
          <Pressable style={styles.checkRow} onPress={() => setAccepted(v => !v)}>
            <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
              {accepted && <CheckCircle size={14} color="#fff" />}
            </View>
            <Text style={styles.checkLabel}>
              I agree to the Throttlist Pro Terms and the Stripe Connected Account Agreement
            </Text>
          </Pressable>
          <Pressable
            style={[styles.primaryBtn, !accepted && styles.primaryBtnDim]}
            onPress={handleNext}
            disabled={!accepted}
          >
            <Text style={styles.primaryBtnText}>Accept & Review</Text>
          </Pressable>
        </View>
      )}

      {step === 'confirm' && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.confirmHero}>
            <View style={styles.starCircle}>
              <Star size={32} color={colors.accent} fill={colors.accent} />
            </View>
            <Text style={styles.headline}>Almost there</Text>
            <Text style={styles.sub}>
              Review your setup before activating Pro.
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <DollarSign size={16} color={colors.textTertiary} />
              <Text style={styles.summaryLabel}>Billing</Text>
              <Text style={styles.summaryValue}>$7 / month (1st month free)</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.summaryRow}>
              <Lock size={16} color={colors.textTertiary} />
              <Text style={styles.summaryLabel}>Payout account</Text>
              <Text style={styles.summaryValue}>
                ···{accountNumber.slice(-4)} ({accountType})
              </Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.summaryRow}>
              <Star size={16} color={colors.textTertiary} />
              <Text style={styles.summaryLabel}>Commission rate</Text>
              <Text style={styles.summaryValue}>70% of net affiliate earnings</Text>
            </View>
          </View>

          <View style={styles.includedList}>
            {[
              'PRO badge on your profile',
              'Affiliate earnings on all part links',
              'Monthly payouts to your bank',
              'Analytics dashboard',
              'Priority in Discover',
            ].map((item, i) => (
              <View key={i} style={styles.includedRow}>
                <CheckCircle size={15} color={colors.green} />
                <Text style={styles.includedText}>{item}</Text>
              </View>
            ))}
          </View>

          <Pressable style={styles.primaryBtn} onPress={handleActivate}>
            <Text style={styles.primaryBtnText}>Activate Pro — $7/month</Text>
          </Pressable>

          <Text style={styles.legalNote}>
            You won't be charged until your free month ends. Cancel any time in Settings.
          </Text>
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  backBtn: { padding: 4, width: 44 },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface3,
  },
  dotActive: { backgroundColor: colors.accent },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  stripeNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stripeNoticeText: {
    flex: 1,
    color: colors.textTertiary,
    fontSize: 12,
    lineHeight: 16,
  },
  headline: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  sub: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    marginTop: 8,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surface3,
    alignItems: 'center',
  },
  typeBtnSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '18',
  },
  typeBtnText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  typeBtnTextSelected: { color: colors.accent },
  form: { gap: 16, marginBottom: 16 },
  field: { gap: 5 },
  fieldLabel: {
    color: colors.textTertiary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldHint: {
    color: colors.textTertiary,
    fontSize: 11,
    marginBottom: 2,
  },
  fieldInput: {
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: colors.textPrimary,
    fontSize: 15,
  },
  stripeAttrib: {
    marginBottom: 20,
  },
  stripeAttribText: {
    color: colors.textTertiary,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },
  primaryBtn: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnDim: { opacity: 0.4 },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  // Terms
  termsWrap: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: 4,
  },
  tcScroll: {
    flex: 1,
    backgroundColor: colors.surface1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    padding: 14,
  },
  tcText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.surface3,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  // Confirm step
  confirmHero: {
    alignItems: 'center',
    marginBottom: 24,
  },
  starCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.accent + '44',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: colors.surface1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 13,
  },
  summaryLabel: {
    color: colors.textTertiary,
    fontSize: 13,
    flex: 1,
  },
  summaryValue: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  includedList: {
    gap: 10,
    marginBottom: 24,
  },
  includedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  includedText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  legalNote: {
    color: colors.textTertiary,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
})
