import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native'
import { Heart, MessageCircle, Share2, ExternalLink } from '@blinkdotnew/mobile-ui'
import { colors, timeAgo, formatFollowers } from '@/constants/throttlist'
import InitialsAvatar from '@/components/InitialsAvatar'
import type { Post, Part } from '@/types'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
// 4:3 ratio for post photo
const PHOTO_HEIGHT = Math.round(SCREEN_WIDTH * 0.75)

interface PostCardProps {
  post: Post
  parts?: Part[]
  onPartPress?: (part: Part) => void
  onBuildPress?: () => void
  onLike?: () => void
  onComment?: () => void
  onShare?: () => void
  onShopPress?: (part: Part) => void
}

export default function PostCard({
  post,
  parts = [],
  onPartPress,
  onBuildPress,
  onLike,
  onComment,
  onShare,
  onShopPress,
}: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)

  const photos: string[] = (() => {
    try { return JSON.parse(post.photos) } catch { return [] }
  })()
  const taggedIds: string[] = (() => {
    try { return JSON.parse(post.taggedPartIds) } catch { return [] }
  })()

  const taggedParts = parts.filter(p => taggedIds.includes(p.id))

  function handleLike() {
    setLiked(!liked)
    onLike?.()
  }

  return (
    <View style={styles.card}>
      {/* Header row */}
      <Pressable style={styles.header} onPress={onBuildPress}>
        {/* Build cover photo as avatar */}
        <InitialsAvatar
          name={post.buildNickname || post.buildMake}
          photoUrl={post.buildCoverPhotoUrl || null}
          size={38}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.handle}>@{post.username}</Text>
          <Text style={styles.buildName} numberOfLines={1}>
            {post.buildNickname || `${post.buildYear} ${post.buildMake} ${post.buildModel}`}
          </Text>
        </View>
        <Text style={styles.timestamp}>{timeAgo(post.createdAt)}</Text>
      </Pressable>

      {/* Photo carousel — bleeds edge to edge */}
      {photos.length > 0 && (
        <View style={styles.photoWrap}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={e => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH)
              setPhotoIndex(idx)
            }}
          >
            {photos.map((uri, i) => (
              <Image
                key={i}
                source={{ uri }}
                style={styles.photo}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          {photos.length > 1 && (
            <View style={styles.dotRow}>
              {photos.map((_, i) => (
                <View key={i} style={[styles.dot, photoIndex === i && styles.dotActive]} />
              ))}
            </View>
          )}
          {taggedParts.length > 1 && (
            <View style={styles.partsBadge}>
              <Text style={styles.partsBadgeText}>{taggedParts.length} parts</Text>
            </View>
          )}
        </View>
      )}

      {/* Caption */}
      {!!post.caption && (
        <View style={styles.captionWrap}>
          <Text style={styles.caption}>{post.caption}</Text>
        </View>
      )}

      {/* Tagged parts pills */}
      {taggedParts.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pillScroll}
          contentContainerStyle={styles.pillRow}
        >
          {taggedParts.map(part => (
            <Pressable
              key={part.id}
              style={[
                styles.pill,
                part.type === 'linkable' && styles.pillLinkable,
                part.type === 'reference' && styles.pillReference,
                part.type === 'service' && styles.pillService,
              ]}
              onPress={() => {
                if (part.type === 'linkable') onShopPress?.(part)
                else onPartPress?.(part)
              }}
            >
              <View style={[
                styles.pillDot,
                part.type === 'linkable' && { backgroundColor: colors.accent },
                part.type === 'reference' && { backgroundColor: colors.reference },
                part.type === 'service' && { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.reference },
              ]} />
              <Text
                style={[
                  styles.pillText,
                  part.type === 'linkable' && { color: colors.accent },
                ]}
                numberOfLines={1}
              >
                {part.name}
              </Text>
              {part.type === 'linkable' && (
                <ExternalLink size={11} color={colors.accent} />
              )}
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Action row */}
      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={handleLike}>
          <Heart
            size={21}
            color={liked ? colors.accent : colors.textSecondary}
            fill={liked ? colors.accent : 'none'}
          />
          <Text style={[styles.actionCount, liked && { color: colors.accent }]}>
            {formatFollowers(post.likeCount + (liked ? 1 : 0))}
          </Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={onComment}>
          <MessageCircle size={21} color={colors.textSecondary} />
          <Text style={styles.actionCount}>{formatFollowers(post.commentCount)}</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={onShare}>
          <Share2 size={21} color={colors.textSecondary} />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface1,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 10,
  },
  headerInfo: {
    flex: 1,
  },
  handle: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  buildName: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 1,
  },
  timestamp: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  photoWrap: {
    position: 'relative',
  },
  photo: {
    width: SCREEN_WIDTH,
    height: PHOTO_HEIGHT,
    backgroundColor: colors.surface2,
  },
  dotRow: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
  },
  partsBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  partsBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  captionWrap: {
    paddingHorizontal: 14,
    paddingTop: 11,
  },
  caption: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  pillScroll: {
    marginTop: 10,
  },
  pillRow: {
    paddingHorizontal: 14,
    gap: 7,
    flexDirection: 'row',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.surface2,
    backgroundColor: colors.surface2,
    maxWidth: 180,
  },
  pillLinkable: {
    borderColor: colors.accent + '66',
    backgroundColor: colors.accent + '18',
  },
  pillReference: {
    borderColor: colors.surface2,
  },
  pillService: {
    borderColor: colors.surface2,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    flexShrink: 0,
  },
  pillText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    flexShrink: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 11,
    gap: 2,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginRight: 6,
  },
  actionCount: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
})
