import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native'
import { router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, TrendingUp, Users, ShoppingCart, Zap } from '@/components/Icons'
import { getUser, listBuilds, getUserHorsepower, getFollowingCount, getUserStoreItems } from '@/lib/data'
import { colors, MOCK_USER_ID } from '@/constants/throttlist'

const PERIODS = ['7D', '30D', '90D'] as const
type Period = typeof PERIODS[number]

const WEEKLY = {
  '7D':  { views: [142, 218, 195, 340, 287, 412, 378], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  '30D': { views: [980, 1240, 1105, 1480, 1320, 1870, 1650], labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'] },
  '90D': { views: [4200, 5100, 4800, 6300, 5700, 7100, 6600], labels: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7'] },
}

const TOP_LOCATIONS = [
  { city: 'Los Angeles, CA', pct: 18 },
  { city: 'New York, NY', pct: 13 },
  { city: 'Austin, TX', pct: 11 },
  { city: 'Miami, FL', pct: 9 },
  { city: 'Chicago, IL', pct: 7 },
]

const PEAK_HOURS = [
  { label: '6–9 AM', pct: 22 },
  { label: '12–2 PM', pct: 35 },
  { label: '5–8 PM', pct: 58 },
  { label: '8–11 PM', pct: 72 },
  { label: 'Late night', pct: 18 },
]

async function fetchAnalyticsData() {
  const user = await getUser(MOCK_USER_ID)
  const builds = await listBuilds({ userId: MOCK_USER_ID })
  const hp = getUserHorsepower(MOCK_USER_ID)
  const storeItems = getUserStoreItems(MOCK_USER_ID)
  const totalFollowers = builds.reduce((sum, b) => sum + (b.followerCount ?? 0), 0)
  return { user, builds, hp, storeItems, totalFollowers }
}

export default function AnalyticsScreen() {
  const [period, setPeriod] = useState<Period>('7D')

  const { data, isLoading } = useQuery({
    queryKey: ['analytics', MOCK_USER_ID],
    queryFn: fetchAnalyticsData,
  })

  if (isLoading || !data) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={20} color={colors.textSecondary} />
          </Pressable>
          <Text style={styles.headerTitle}>Pro Analytics</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.skeleton} />
      </View>
    )
  }

  const { builds, hp, storeItems, totalFollowers } = data
  const chart = WEEKLY[period]
  const weekMax = Math.max(...chart.views)

  // Computed metrics that scale with real data
  const profileViews = chart.views.reduce((a, b) => a + b, 0)
  const reach = Math.round(profileViews * 2.4)
  const storeClicks = storeItems.length > 0 ? storeItems.length * 47 + 120 : 0
  const followerGrowth = period === '7D' ? builds.length * 8 + 14 : period === '30D' ? builds.length * 31 + 58 : builds.length * 94 + 172

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.textSecondary} />
        </Pressable>
        <Text style={styles.headerTitle}>Pro Analytics</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Period selector */}
      <View style={styles.periodRow}>
        {PERIODS.map(p => (
          <Pressable
            key={p}
            style={[styles.periodBtn, period === p && styles.periodBtnActive]}
            onPress={() => setPeriod(p)}
          >
            <Text style={[styles.periodText, period === p && styles.periodTextActive]}>{p}</Text>
          </Pressable>
        ))}
      </View>

      {/* Overview */}
      <Text style={styles.sectionTitle}>OVERVIEW</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <TrendingUp size={14} color={colors.accent} />
          <Text style={styles.statValue}>{profileViews.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Profile Views</Text>
          <Text style={styles.statDelta}>↑ 12% vs prior period</Text>
        </View>
        <View style={styles.statCard}>
          <Users size={14} color={colors.accent} />
          <Text style={styles.statValue}>{totalFollowers.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Followers</Text>
          <Text style={styles.statDelta}>+{followerGrowth} this period</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={14} color={colors.accent} />
          <Text style={styles.statValue}>{reach.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Reach</Text>
          <Text style={styles.statDelta}>↑ 24% vs prior period</Text>
        </View>
        <View style={styles.statCard}>
          <Zap size={14} color={colors.accent} />
          <Text style={styles.statValue}>{hp.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Horsepower</Text>
          <Text style={styles.statDelta}>Your community score</Text>
        </View>
      </View>

      {/* Bar chart */}
      <Text style={styles.sectionTitle}>PROFILE VIEWS</Text>
      <View style={styles.chartCard}>
        <View style={styles.chart}>
          {chart.views.map((v, i) => (
            <View key={i} style={styles.chartBarWrap}>
              <Text style={styles.chartBarValue}>{v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}</Text>
              <View style={[styles.bar, { height: Math.max(4, Math.round((v / weekMax) * 100)) }]} />
              <Text style={styles.chartBarLabel}>{chart.labels[i]}</Text>
            </View>
          ))}
        </View>
        <View style={styles.chartFooter}>
          <Text style={styles.chartFooterText}>
            {profileViews.toLocaleString()} total views · {period} window
          </Text>
        </View>
      </View>

      {/* Build performance */}
      <Text style={styles.sectionTitle}>BUILD PERFORMANCE</Text>
      {builds.map((build, idx) => {
        const buildViews = Math.round((build.followerCount ?? 0) * 4.2 + 280)
        const shareOfFollowers = totalFollowers > 0
          ? Math.round(((build.followerCount ?? 0) / totalFollowers) * 100)
          : 0
        return (
          <View key={build.id} style={[styles.buildCard, idx < builds.length - 1 && { marginBottom: 10 }]}>
            <View style={styles.buildCardHeader}>
              <View>
                <Text style={styles.buildCardName}>{build.nickname || `${build.year} ${build.make}`}</Text>
                <Text style={styles.buildCardMeta}>{build.year} {build.make} {build.model}</Text>
              </View>
              <Text style={styles.buildCardShare}>{shareOfFollowers}% of audience</Text>
            </View>
            <View style={styles.buildMetrics}>
              <View style={styles.buildMetricCol}>
                <Text style={styles.buildMetricValue}>{(build.followerCount ?? 0).toLocaleString()}</Text>
                <Text style={styles.buildMetricLabel}>Followers</Text>
              </View>
              <View style={[styles.buildMetricCol, styles.buildMetricDivider]}>
                <Text style={styles.buildMetricValue}>{buildViews.toLocaleString()}</Text>
                <Text style={styles.buildMetricLabel}>Views</Text>
              </View>
              <View style={[styles.buildMetricCol, styles.buildMetricDivider]}>
                <Text style={styles.buildMetricValue}>{Math.round(buildViews / 7)}</Text>
                <Text style={styles.buildMetricLabel}>Views/day</Text>
              </View>
            </View>
            <View style={styles.buildProgressBar}>
              <View style={[styles.buildProgressFill, { width: `${shareOfFollowers}%` }]} />
            </View>
          </View>
        )
      })}

      {/* Store */}
      {storeItems.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>STORE PERFORMANCE</Text>
          <View style={styles.storeRow}>
            <View style={[styles.storeCard, { borderColor: colors.border }]}>
              <ShoppingCart size={14} color={colors.accent} />
              <Text style={styles.statValue}>{storeItems.length}</Text>
              <Text style={styles.statLabel}>Items listed</Text>
            </View>
            <View style={[styles.storeCard, { borderColor: colors.border }]}>
              <TrendingUp size={14} color={colors.accent} />
              <Text style={styles.statValue}>{storeClicks}</Text>
              <Text style={styles.statLabel}>Link clicks</Text>
            </View>
            <View style={[styles.storeCard, { borderColor: colors.border }]}>
              <Zap size={14} color={colors.accent} />
              <Text style={styles.statValue}>{Math.round(storeClicks / 7)}</Text>
              <Text style={styles.statLabel}>Clicks/day</Text>
            </View>
          </View>
        </>
      )}

      {/* Audience */}
      <Text style={styles.sectionTitle}>AUDIENCE</Text>
      <View style={styles.audienceCard}>
        <Text style={styles.audienceSubheading}>TOP LOCATIONS</Text>
        {TOP_LOCATIONS.map(loc => (
          <View key={loc.city} style={styles.audienceRow}>
            <Text style={styles.audienceLabel}>{loc.city}</Text>
            <View style={styles.audienceTrack}>
              <View style={[styles.audienceFill, { width: `${loc.pct * 4.5}%` }]} />
            </View>
            <Text style={styles.audiencePct}>{loc.pct}%</Text>
          </View>
        ))}
      </View>

      <View style={[styles.audienceCard, { marginBottom: 0 }]}>
        <Text style={styles.audienceSubheading}>PEAK ACTIVITY HOURS</Text>
        {PEAK_HOURS.map(slot => (
          <View key={slot.label} style={styles.audienceRow}>
            <Text style={styles.audienceLabel}>{slot.label}</Text>
            <View style={styles.audienceTrack}>
              <View style={[styles.audienceFill, { width: `${slot.pct}%` }]} />
            </View>
            <Text style={styles.audiencePct}>{slot.pct}%</Text>
          </View>
        ))}
      </View>

      <View style={{ height: 48 }} />
    </ScrollView>
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
  skeleton: { height: 200, backgroundColor: colors.surface1, margin: 16, borderRadius: 8 },
  periodRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
    gap: 8,
  },
  periodBtn: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.surface3,
  },
  periodBtnActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  periodText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  periodTextActive: { color: '#fff' },
  sectionTitle: {
    color: colors.textTertiary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  statCard: {
    flex: 1,
    minWidth: '44%',
    backgroundColor: colors.surface1,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  statValue: { color: colors.textPrimary, fontSize: 22, fontWeight: '800' },
  statLabel: { color: colors.textSecondary, fontSize: 12 },
  statDelta: { color: colors.accent, fontSize: 11, fontWeight: '600' },
  // Chart
  chartCard: {
    marginHorizontal: 16,
    backgroundColor: colors.surface1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    gap: 5,
  },
  chartBarWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  chartBarValue: { color: colors.textTertiary, fontSize: 8, fontWeight: '600' },
  bar: { width: '100%', backgroundColor: colors.accent, borderRadius: 3, opacity: 0.9 },
  chartBarLabel: { color: colors.textTertiary, fontSize: 9 },
  chartFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  chartFooterText: { color: colors.textSecondary, fontSize: 12, textAlign: 'center' },
  // Builds
  buildCard: {
    marginHorizontal: 16,
    backgroundColor: colors.surface1,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 0,
  },
  buildCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  buildCardName: { color: colors.textPrimary, fontSize: 14, fontWeight: '700' },
  buildCardMeta: { color: colors.textTertiary, fontSize: 12, marginTop: 1 },
  buildCardShare: { color: colors.accent, fontSize: 11, fontWeight: '600' },
  buildMetrics: { flexDirection: 'row', marginBottom: 12 },
  buildMetricCol: { flex: 1, alignItems: 'center' },
  buildMetricDivider: { borderLeftWidth: 1, borderLeftColor: colors.border },
  buildMetricValue: { color: colors.textPrimary, fontSize: 18, fontWeight: '800' },
  buildMetricLabel: { color: colors.textTertiary, fontSize: 11, marginTop: 2 },
  buildProgressBar: { height: 4, backgroundColor: colors.surface3, borderRadius: 2 },
  buildProgressFill: { height: 4, backgroundColor: colors.accent, borderRadius: 2 },
  // Store
  storeRow: { flexDirection: 'row', paddingHorizontal: 12, gap: 8 },
  storeCard: {
    flex: 1,
    backgroundColor: colors.surface1,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  // Audience
  audienceCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: colors.surface1,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  audienceSubheading: {
    color: colors.textTertiary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  audienceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  audienceLabel: { color: colors.textSecondary, fontSize: 12, width: 108 },
  audienceTrack: { flex: 1, height: 4, backgroundColor: colors.surface3, borderRadius: 2 },
  audienceFill: { height: 4, backgroundColor: colors.accent, borderRadius: 2 },
  audiencePct: { color: colors.textTertiary, fontSize: 11, width: 32, textAlign: 'right' },
})
