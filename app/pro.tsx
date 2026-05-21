import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native'
import { router } from 'expo-router'
import {
  ArrowLeft,
  Star,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Users,
  Globe,
  ShoppingCart,
  ProBadge,
} from '@/components/Icons'
import { colors } from '@/constants/throttlist'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const FEATURES = [
  {
    icon: <ShoppingCart size={20} color={colors.accent} />,
    title: 'Customized storefront on your profile',
    body: 'Showcase up to 20 products — tagged parts, Meta Shop items, or personal picks — in a dedicated store section on your profile.',
  },
  {
    icon: <DollarSign size={20} color={colors.accent} />,
    title: 'Earn affiliate commissions',
    body: 'Keep 70% of every commission generated through your part links. Payments land in your bank monthly.',
  },
  {
    icon: <TrendingUp size={20} color={colors.accent} />,
    title: 'Advanced link analytics',
    body: 'See click-through rates, top-performing parts, and estimated earnings — updated in real time.',
  },
  {
    icon: <Star size={20} color={colors.accent} fill={colors.accent} />,
    title: 'Pro badge on your profile',
    body: 'Stand out with a verified Pro badge on your profile and all your builds.',
  },
  {
    icon: <Users size={20} color={colors.accent} />,
    title: 'Priority in Discover',
    body: 'Pro builds get boosted placement in Discover, putting your work in front of more riders.',
  },
  {
    icon: <Globe size={20} color={colors.accent} />,
    title: 'Custom profile link',
    body: 'Get a short throttlist.com/@you link to share everywhere — your own moto hub.',
  },
]

const INCLUDED = [
  'Everything in Basic — always free',
  'Customized storefront on your profile',
  'Affiliate earnings on all part links',
  '70% payout rate (Throttlist keeps 30%)',
  'Monthly bank payouts via Stripe',
  'Analytics dashboard',
  'Pro badge',
  'Priority Discover placement',
]

export default function ProScreen() {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.textSecondary} />
        </Pressable>
        <Text style={styles.headerTitle}>Throttlist Pro</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.starCircle}>
            <Star size={36} color={colors.accent} fill={colors.accent} />
          </View>
          <Text style={styles.heroTitle}>Get paid to build.</Text>
          <Text style={styles.heroSub}>
            Every part link you share can earn you money. Pro unlocks your payouts and puts your builds front and center.
          </Text>
        </View>

        {/* Pricing */}
        <View style={styles.pricingCard}>
          <View style={styles.pricingTop}>
            <View>
              <Text style={styles.price}>$5</Text>
              <Text style={styles.pricePer}>/month</Text>
            </View>
            <ProBadge size={27} />
          </View>
          <Text style={styles.pricingNote}>
            Cancel any time. First month free for Beta users.
          </Text>
        </View>

        {/* What's included */}
        <Text style={styles.sectionTitle}>What's included</Text>
        <View style={styles.includedList}>
          {INCLUDED.map((item, i) => (
            <View key={i} style={styles.includedRow}>
              <CheckCircle size={16} color={colors.green} />
              <Text style={styles.includedText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Feature cards */}
        <Text style={styles.sectionTitle}>Why Pro</Text>
        <View style={styles.featureList}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureCard}>
              <View style={styles.featureIcon}>{f.icon}</View>
              <View style={styles.featureBody}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureText}>{f.body}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Earnings callout */}
        <View style={styles.callout}>
          <Text style={styles.calloutText}>
            Beta builders are averaging{' '}
            <Text style={styles.calloutAccent}>$38/month</Text>
            {' '}in affiliate commissions. At 70% that's{' '}
            <Text style={styles.calloutAccent}>$26.60</Text>
            {' '}back in your pocket each month — after the $5 Pro fee.
          </Text>
        </View>

        {/* CTA */}
        <Pressable style={styles.ctaBtn} onPress={() => router.push('/pro-signup')}>
          <Text style={styles.ctaBtnText}>Set up payouts & unlock Pro</Text>
        </Pressable>

        <Text style={styles.legalNote}>
          By upgrading you agree to the Throttlist Pro Terms and the Stripe Connected Account Agreement. Payout amounts depend on affiliate partner rates and are not guaranteed.
        </Text>

        <View style={{ height: 32 }} />
      </ScrollView>
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
  content: {
    padding: 20,
  },
  // Hero
  hero: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 8,
  },
  starCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.accent + '44',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 10,
    textAlign: 'center',
  },
  heroSub: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  // Pricing
  pricingCard: {
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.accent + '55',
    borderRadius: 14,
    padding: 20,
    marginBottom: 28,
  },
  pricingTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  price: {
    color: colors.textPrimary,
    fontSize: 42,
    fontWeight: '800',
    lineHeight: 46,
  },
  pricePer: {
    color: colors.textTertiary,
    fontSize: 14,
  },
  proBadge: {
    backgroundColor: colors.accent,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  proBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  pricingNote: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  // Included
  includedList: {
    backgroundColor: colors.surface1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 28,
    gap: 0,
  },
  includedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  includedText: {
    color: colors.textSecondary,
    fontSize: 14,
    flex: 1,
  },
  // Features
  featureList: {
    gap: 10,
    marginBottom: 24,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 14,
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.accent + '18',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureBody: { flex: 1 },
  featureTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  featureText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  // Callout
  callout: {
    backgroundColor: colors.accent + '18',
    borderWidth: 1,
    borderColor: colors.accent + '44',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
  },
  calloutText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  calloutAccent: {
    color: colors.accent,
    fontWeight: '700',
  },
  // CTA
  ctaBtn: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  ctaBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  legalNote: {
    color: colors.textTertiary,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },
})
