import React from 'react'
import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import { Users, Tag, MessageCircle } from '@/components/Icons'
import { colors, formatFollowers } from '@/constants/throttlist'
import { MOCK_PARTS, MOCK_COMMENTS } from '@/lib/data'
import type { Build } from '@/types'

interface BuildCardProps {
  build: Build
  onPress?: () => void
  onFollow?: () => void
  isFollowing?: boolean
  showFollowButton?: boolean
}

export default function BuildCard({
  build,
  onPress,
  onFollow,
  isFollowing = false,
  showFollowButton = true,
}: BuildCardProps) {
  const tags: string[] = (() => {
    try { return JSON.parse(build.tags) } catch { return [] }
  })()

  const tagCount = MOCK_PARTS.filter(p => p.buildId === build.id).length
  const commentCount = MOCK_COMMENTS.filter(c => c.targetId === build.id).length

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* Cover photo */}
      <View style={styles.coverWrap}>
        {build.coverPhotoUrl ? (
          <Image source={{ uri: build.coverPhotoUrl }} style={styles.cover} resizeMode="cover" />
        ) : (
          <View style={[styles.cover, styles.coverFallback]} />
        )}
        {build.status === 'archived' && (
          <View style={styles.archivedBanner}>
            <Text style={styles.archivedText}>ARCHIVED</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            <Text style={styles.nickname} numberOfLines={1}>
              {build.nickname || `${build.year} ${build.make}`}
            </Text>
            <Text style={styles.meta}>
              {build.year} {build.make} {build.model}
            </Text>
          </View>
          {showFollowButton && build.status !== 'archived' && (
            <Pressable
              style={[styles.followBtn, isFollowing && styles.followBtnActive]}
              onPress={e => { e.stopPropagation(); onFollow?.() }}
            >
              <Text style={[styles.followBtnText, isFollowing && styles.followBtnTextActive]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Users size={12} color={colors.textTertiary} />
            <Text style={styles.statText}>{formatFollowers(build.followerCount)}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Tag size={12} color={colors.textTertiary} />
            <Text style={styles.statText}>{tagCount}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <MessageCircle size={12} color={colors.textTertiary} />
            <Text style={styles.statText}>{commentCount}</Text>
          </View>
        </View>

        {/* Tags */}
        {tags.length > 0 && (
          <View style={styles.tagsRow}>
            {tags.slice(0, 3).map(tag => (
              <View key={tag} style={styles.tagPill}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface1,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  coverWrap: {
    position: 'relative',
  },
  cover: {
    width: '100%',
    height: 160,
    backgroundColor: colors.surface2,
  },
  coverFallback: {
    backgroundColor: '#1C1C1C',
  },
  archivedBanner: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.textTertiary,
  },
  archivedText: {
    color: colors.textTertiary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  info: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 8,
  },
  titleLeft: {
    flex: 1,
  },
  nickname: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  handle: {
    color: colors.textTertiary,
    fontSize: 11,
    marginTop: 2,
  },
  followBtn: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  followBtnActive: {
    backgroundColor: colors.accent,
  },
  followBtnText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  followBtnTextActive: {
    color: '#fff',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 10,
    backgroundColor: colors.surface2,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagPill: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.surface3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: colors.surface2,
  },
  tagText: {
    color: colors.textTertiary,
    fontSize: 11,
  },
})
