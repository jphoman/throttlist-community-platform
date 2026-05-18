import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Platform,
} from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Instagram, Youtube, Settings, ChevronRight, Star } from '@blinkdotnew/mobile-ui'
import { blink } from '@/lib/blink'
import { colors, formatFollowers, MOCK_USER_ID } from '@/constants/throttlist'
import BuildCard from '@/components/BuildCard'
import type { Build } from '@/types'

async function fetchUserData() {
  const user = await blink.db.users.get(MOCK_USER_ID)
  const builds = await blink.db.builds.list({
    where: { userId: MOCK_USER_ID },
    orderBy: { createdAt: 'desc' },
  }) as Build[]

  return { user, builds }
}

export default function ProfileScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['profile', MOCK_USER_ID],
    queryFn: fetchUserData,
  })

  const user = data?.user
  const builds = data?.builds ?? []

  if (isLoading || !user) {
    return (
      <View style={styles.container}>
        <View style={styles.skeletonHeader} />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.topUsername}>@{user.username}</Text>
        <Pressable style={styles.settingsBtn}>
          <Settings size={20} color={colors.textSecondary} />
        </Pressable>
      </View>

      {/* Profile info */}
      <View style={styles.profileSection}>
        <View style={styles.avatarRow}>
          {user.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarLetter}>
                {(user.username || 'U')[0].toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.profileMeta}>
            <Text style={styles.displayName}>{user.displayName}</Text>
            {user.location && (
              <Text style={styles.location}>{user.location}</Text>
            )}
            {/* Social links */}
            <View style={styles.socialRow}>
              {user.instagramHandle && (
                <Pressable style={styles.socialLink}>
                  <Instagram size={14} color={colors.textTertiary} />
                  <Text style={styles.socialHandle}>@{user.instagramHandle}</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>

        {user.bio && <Text style={styles.bio}>{user.bio}</Text>}

        {/* Pro badge / upgrade */}
        {!Number(user.proTier) && (
          <Pressable
            style={styles.proBanner}
            onPress={() => router.push('/pro-waitlist')}
          >
            <Star size={14} color={colors.accent} fill={colors.accent} />
            <Text style={styles.proBannerText}>
              Pro is coming soon — earn 70% affiliate commissions
            </Text>
            <ChevronRight size={14} color={colors.accent} />
          </Pressable>
        )}
      </View>

      {/* Builds */}
      <View style={styles.buildsSection}>
        <Text style={styles.sectionTitle}>
          {builds.length === 1 ? '1 Build' : `${builds.length} Builds`}
        </Text>
        {builds.map(build => (
          <BuildCard
            key={build.id}
            build={{ ...build, username: user.username }}
            showFollowButton={false}
            onPress={() => router.push(`/build/${user.username}/${build.slug}`)}
          />
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 54 : 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topUsername: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  settingsBtn: {
    padding: 4,
  },
  profileSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarFallback: {
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
  },
  profileMeta: {
    flex: 1,
    paddingTop: 4,
  },
  displayName: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  location: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 3,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  socialHandle: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  bio: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  proBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.accent + '44',
    borderRadius: 8,
    padding: 12,
  },
  proBannerText: {
    color: colors.textSecondary,
    fontSize: 12,
    flex: 1,
  },
  buildsSection: {
    padding: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 14,
  },
  skeletonHeader: {
    height: 200,
    backgroundColor: colors.surface1,
  },
})
