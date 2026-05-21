import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
} from 'react-native'
import { router } from 'expo-router'
import { ArrowLeft, CheckCircle, ChevronRight } from '@/components/Icons'
import { colors } from '@/constants/throttlist'
import { ThrottlistLogo } from '@/components/ThrottlistLogo'

type Step = 'account' | 'terms' | 'build'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 60 }, (_, i) => String(CURRENT_YEAR - i))

const BUILD_STYLES = [
  { id: 'cafe_racer', label: 'Café Racer', icon: '⚡' },
  { id: 'scrambler', label: 'Scrambler', icon: '🏕️' },
  { id: 'tracker', label: 'Tracker', icon: '🏁' },
  { id: 'bobber', label: 'Bobber', icon: '🔩' },
  { id: 'chopper', label: 'Chopper', icon: '🛠️' },
  { id: 'adventure', label: 'Adventure', icon: '🏔️' },
  { id: 'bagger', label: 'Bagger', icon: '🛣️' },
  { id: 'other', label: 'Other', icon: '🏍️' },
]

const TC_TEXT = `THROTTLIST TERMS & CONDITIONS

Last updated: January 1, 2025

1. ACCEPTANCE OF TERMS
By creating an account on Throttlist you agree to be bound by these Terms and Conditions. If you do not agree, do not use the platform.

2. USER ACCOUNTS
You are responsible for maintaining the confidentiality of your account credentials. You must be at least 18 years old to create an account. You agree to provide accurate information and keep it up to date.

3. CONTENT OWNERSHIP
You retain ownership of all content you post. By posting content you grant Throttlist a non-exclusive, royalty-free, worldwide license to display and distribute your content on the platform.

4. AFFILIATE LINKS
Part links may include Throttlist affiliate codes. Pro subscribers earn a share of commissions generated through their part links, subject to the Pro payout terms.

5. PROHIBITED CONDUCT
You agree not to post illegal content, spam, or content that violates third-party intellectual property rights. Throttlist reserves the right to remove content and terminate accounts that violate these terms.

6. PRIVACY
Your use of Throttlist is also governed by our Privacy Policy. We do not sell your personal data to third parties.

7. DISCLAIMER
Throttlist is provided "as is." We make no warranties regarding uptime, accuracy of part information, or affiliate commission amounts.

8. GOVERNING LAW
These terms are governed by the laws of the State of California, United States.

9. CHANGES TO TERMS
We may update these terms at any time. Continued use of Throttlist after updates constitutes acceptance.

Contact: legal@throttlist.com`

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoCorrect,
}: {
  label: string
  value: string
  onChangeText: (v: string) => void
  placeholder?: string
  secureTextEntry?: boolean
  keyboardType?: 'default' | 'email-address'
  autoCapitalize?: 'none' | 'words'
  autoCorrect?: boolean
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize ?? 'sentences'}
        autoCorrect={autoCorrect ?? false}
      />
    </View>
  )
}

export default function SignupScreen() {
  const [step, setStep] = useState<Step>('account')

  // Account step
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Terms step
  const [accepted, setAccepted] = useState(false)

  // Build step
  const [buildYear, setBuildYear] = useState('')
  const [buildMake, setBuildMake] = useState('')
  const [buildModel, setBuildModel] = useState('')
  const [buildNickname, setBuildNickname] = useState('')
  const [buildStyle, setBuildStyle] = useState('')

  const accountValid = displayName.trim() && username.trim() && email.trim() && password.length >= 8

  function handleBack() {
    if (step === 'account') { router.back(); return }
    if (step === 'terms') { setStep('account'); return }
    if (step === 'build') { setStep('terms'); return }
  }

  function handleNext() {
    if (step === 'account') { setStep('terms'); return }
    if (step === 'terms' && accepted) { setStep('build'); return }
    if (step === 'build') { router.replace('/feed'); return }
  }

  const stepIndex = step === 'account' ? 0 : step === 'terms' ? 1 : 2

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.textSecondary} />
        </Pressable>
        <ThrottlistLogo color={colors.accent} height={18} />
        <View style={{ width: 44 }} />
      </View>

      {/* Progress dots */}
      <View style={styles.progress}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.dot, i <= stepIndex && styles.dotActive]} />
        ))}
      </View>

      {step === 'account' && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.headline}>Create your account</Text>
          <Text style={styles.sub}>Join the moto community.</Text>

          <View style={styles.form}>
            <Field label="Full name" value={displayName} onChangeText={setDisplayName} placeholder="Marco Rossi" autoCapitalize="words" />
            <Field label="Username" value={username} onChangeText={setUsername} placeholder="yourusername" autoCapitalize="none" />
            <Field label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />
            <Field label="Password" value={password} onChangeText={setPassword} placeholder="8+ characters" secureTextEntry />
          </View>

          <Pressable
            style={[styles.primaryBtn, !accountValid && styles.primaryBtnDim]}
            onPress={handleNext}
            disabled={!accountValid}
          >
            <Text style={styles.primaryBtnText}>Continue</Text>
            <ChevronRight size={18} color="#fff" />
          </Pressable>

          <Pressable style={styles.switchRow} onPress={() => router.replace('/feed')}>
            <Text style={styles.switchText}>Already have an account? </Text>
            <Text style={[styles.switchText, { color: colors.accent }]}>Log in</Text>
          </Pressable>
        </ScrollView>
      )}

      {step === 'terms' && (
        <View style={styles.termsWrap}>
          <Text style={styles.headline}>Terms & Conditions</Text>
          <Text style={styles.sub}>Please read and accept before continuing.</Text>
          <ScrollView style={styles.tcScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.tcText}>{TC_TEXT}</Text>
          </ScrollView>
          <Pressable style={styles.checkRow} onPress={() => setAccepted(v => !v)}>
            <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
              {accepted && <CheckCircle size={14} color="#fff" />}
            </View>
            <Text style={styles.checkLabel}>I have read and agree to the Terms & Conditions</Text>
          </Pressable>
          <Pressable
            style={[styles.primaryBtn, !accepted && styles.primaryBtnDim]}
            onPress={handleNext}
            disabled={!accepted}
          >
            <Text style={styles.primaryBtnText}>Accept & Continue</Text>
          </Pressable>
        </View>
      )}

      {step === 'build' && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.headline}>Add your first build</Text>
          <Text style={styles.sub}>You can add more builds from your profile.</Text>

          <View style={styles.form}>
            <Field label="Year" value={buildYear} onChangeText={setBuildYear} placeholder={String(CURRENT_YEAR)} keyboardType="default" autoCapitalize="none" />
            <Field label="Make" value={buildMake} onChangeText={setBuildMake} placeholder="Yamaha" autoCapitalize="words" />
            <Field label="Model" value={buildModel} onChangeText={setBuildModel} placeholder="XSR700" autoCapitalize="words" />
            <Field label="Nickname (optional)" value={buildNickname} onChangeText={setBuildNickname} placeholder="The Cappuccino" autoCapitalize="words" />

            <Text style={styles.fieldLabel}>Build style</Text>
            <View style={styles.styleGrid}>
              {BUILD_STYLES.map(s => (
                <Pressable
                  key={s.id}
                  style={[styles.styleCard, buildStyle === s.id && styles.styleCardSelected]}
                  onPress={() => setBuildStyle(s.id)}
                >
                  <Text style={styles.styleIcon}>{s.icon}</Text>
                  <Text style={[styles.styleLabel, buildStyle === s.id && styles.styleLabelSelected]}>
                    {s.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable style={styles.primaryBtn} onPress={handleNext}>
            <Text style={styles.primaryBtnText}>
              {buildMake.trim() ? 'Finish & go to feed' : 'Skip for now'}
            </Text>
          </Pressable>
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
    paddingTop: Platform.OS === 'ios' ? 54 : 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  dotActive: {
    backgroundColor: colors.accent,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  headline: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  sub: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 28,
  },
  form: {
    gap: 16,
    marginBottom: 28,
  },
  field: { gap: 6 },
  fieldLabel: {
    color: colors.textTertiary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  primaryBtn: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  primaryBtnDim: { opacity: 0.4 },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  switchText: {
    color: colors.textTertiary,
    fontSize: 14,
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
  // Build style grid
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  styleCard: {
    width: '47%',
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.surface2,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 6,
  },
  styleCardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '18',
  },
  styleIcon: { fontSize: 24 },
  styleLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  styleLabelSelected: { color: colors.accent },
})
