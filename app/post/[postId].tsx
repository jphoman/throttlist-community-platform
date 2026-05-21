import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  Platform,
  Linking,
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Heart, MessageCircle, Share2, ExternalLink, MoreHorizontal, ProBadge } from '@/components/Icons'
import { getPost, listParts, listComments, isProUser } from '@/lib/data'
import { colors, timeAgo, formatFollowers, MOCK_USER_ID } from '@/constants/throttlist'
import InitialsAvatar from '@/components/InitialsAvatar'
import CommentSheet from '@/components/CommentSheet'
import PostEditSheet from '@/components/PostEditSheet'
import ShareSheet from '@/components/ShareSheet'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const PHOTO_HEIGHT = Math.round(SCREEN_WIDTH * 0.9)

export default function PostDetailScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>()
  const [liked, setLiked] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [commentSheetOpen, setCommentSheetOpen] = useState(false)
  const [shareSheetOpen, setShareSheetOpen] = useState(false)
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [localCaption, setLocalCaption] = useState<string | null>(null)
  const [localTaggedIds, setLocalTaggedIds] = useState<string[] | null>(null)
  const [deleted, setDeleted] = useState(false)

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId!),
    enabled: !!postId,
  })

  const { data: allParts = [] } = useQuery({
    queryKey: ['parts', post?.buildId],
    queryFn: () => listParts({ buildId: post!.buildId }),
    enabled: !!post?.buildId,
  })

  const { data: fetchedComments = [] } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => listComments({ targetId: postId! }),
    enabled: !!postId,
  })

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.photoSkeleton} />
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.textSecondary} />
        </Pressable>
      </View>
    )
  }

  if (!post) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.textSecondary} />
        </Pressable>
        <Text style={styles.notFound}>Post not found</Text>
      </View>
    )
  }

  const isOwner = post.userId === MOCK_USER_ID
  const displayCaption = localCaption ?? post.caption
  const photos: string[] = (() => { try { return JSON.parse(post.photos) } catch { return [] } })()
  const effectiveTaggedIds = localTaggedIds ?? (() => { try { return JSON.parse(post.taggedPartIds) } catch { return [] } })()
  const taggedParts = allParts.filter(p => effectiveTaggedIds.includes(p.id))

  const topComments = [...fetchedComments]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3)
  const totalCommentCount = fetchedComments.length || post.commentCount

  if (deleted) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.textSecondary} />
        </Pressable>
        <Text style={styles.notFound}>Post deleted</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Floating nav */}
      <View style={styles.navRow}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.textSecondary} />
        </Pressable>
        {isOwner && (
          <Pressable onPress={() => setEditSheetOpen(true)} style={styles.backBtn}>
            <MoreHorizontal size={20} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Photo carousel */}
        {photos.length > 0 ? (
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
                <Image key={i} source={{ uri }} style={styles.photo} resizeMode="cover" />
              ))}
            </ScrollView>

            {/* Overlaid author row */}
            <Pressable
              style={styles.overlayAuthor}
              onPress={() => {
                if (post.username && post.buildSlug) {
                  router.push(`/build/${post.username}/${post.buildSlug}`)
                }
              }}
            >
              <InitialsAvatar
                name={post.buildNickname ?? post.buildMake ?? ''}
                photoUrl={post.buildCoverPhotoUrl ?? null}
                size={34}
              />
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={styles.overlayHandle}>@{post.username}</Text>
                  {isProUser(post.username) && <ProBadge size={12} />}
                </View>
                <Text style={styles.overlayBuild} numberOfLines={1}>
                  {post.buildNickname || `${post.buildYear} ${post.buildMake} ${post.buildModel}`}
                </Text>
              </View>
            </Pressable>

            {/* Dot indicators */}
            {photos.length > 1 && (
              <View style={styles.dotRow} pointerEvents="none">
                {photos.map((_, i) => (
                  <View key={i} style={[styles.dot, photoIndex === i && styles.dotActive]} />
                ))}
              </View>
            )}

            {/* Timestamp */}
            <Text style={styles.overlayTime} pointerEvents="none">
              {timeAgo(post.createdAt)}
            </Text>
          </View>
        ) : (
          <View style={[styles.photoSkeleton, { backgroundColor: colors.surface2 }]}>
            <Pressable
              style={styles.overlayAuthor}
              onPress={() => {
                if (post.username && post.buildSlug) {
                  router.push(`/build/${post.username}/${post.buildSlug}`)
                }
              }}
            >
              <InitialsAvatar name={post.buildNickname ?? ''} size={34} />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={styles.overlayHandle}>@{post.username}</Text>
                {isProUser(post.username) && <ProBadge size={12} />}
              </View>
            </Pressable>
          </View>
        )}

        {/* Action bar */}
        <View style={styles.actionBar}>
          <Pressable style={styles.actionBtn} onPress={() => setLiked(v => !v)}>
            <Heart
              size={24}
              color={liked ? colors.accent : colors.textPrimary}
              fill={liked ? colors.accent : 'none'}
            />
            <Text style={[styles.actionCount, liked && { color: colors.accent }]}>
              {formatFollowers(post.likeCount + (liked ? 1 : 0))}
            </Text>
          </Pressable>

          <Pressable style={styles.actionBtn} onPress={() => setCommentSheetOpen(true)}>
            <MessageCircle size={24} color={colors.textPrimary} />
            <Text style={styles.actionCount}>{post.commentCount}</Text>
          </Pressable>

          <Pressable style={styles.actionBtn} onPress={() => setShareSheetOpen(true)}>
            <Share2 size={24} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* Caption */}
        {!!displayCaption && (
          <View style={styles.captionWrap}>
            <Text style={styles.caption}>{displayCaption}</Text>
          </View>
        )}

        {/* Top comments — inline preview */}
        <View style={styles.commentsSection}>
          {topComments.length === 0 ? (
            <Pressable style={styles.noCommentsRow} onPress={() => setCommentSheetOpen(true)}>
              <Text style={styles.noCommentsText}>Be the first to comment</Text>
            </Pressable>
          ) : (
            <>
              {topComments.map(comment => (
                <Pressable
                  key={comment.id}
                  style={styles.inlineComment}
                  onPress={() => setCommentSheetOpen(true)}
                >
                  {comment.avatarUrl ? (
                    <Image source={{ uri: comment.avatarUrl }} style={styles.inlineAvatar} />
                  ) : (
                    <InitialsAvatar name={comment.displayName ?? comment.username ?? '?'} size={28} />
                  )}
                  <View style={styles.inlineCommentBody}>
                    <Text style={styles.inlineCommentText} numberOfLines={2}>
                      <Text style={styles.inlineCommentUser}>@{comment.username} </Text>
                      {comment.body}
                    </Text>
                  </View>
                  <View style={styles.inlineLikeCol}>
                    <Heart size={13} color={colors.textTertiary} />
                    <Text style={styles.inlineLikeCount}>{comment.likes}</Text>
                  </View>
                </Pressable>
              ))}

              {totalCommentCount > 3 && (
                <Pressable style={styles.moreDots} onPress={() => setCommentSheetOpen(true)}>
                  <View style={styles.dot3} />
                  <View style={styles.dot3} />
                  <View style={styles.dot3} />
                </Pressable>
              )}
            </>
          )}
        </View>

        {/* Tagged parts */}
        {taggedParts.length > 0 && (
          <View style={styles.partsSection}>
            {taggedParts.map(part => (
              <View key={part.id} style={styles.partRow}>
                <View style={[
                  styles.partDot,
                  part.type === 'linkable' && { backgroundColor: colors.accent },
                ]} />
                <View style={styles.partInfo}>
                  <Text style={[styles.partName, part.type === 'linkable' && { color: colors.accent }]}>
                    {part.name}
                  </Text>
                  {part.category ? (
                    <Text style={styles.partCategory}>{part.category}</Text>
                  ) : null}
                </View>
                {part.type === 'linkable' && part.sourceUrl ? (
                  <Pressable onPress={() => Linking.openURL(part.sourceUrl!)}>
                    <ExternalLink size={14} color={colors.accent} />
                  </Pressable>
                ) : null}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 48 }} />
      </ScrollView>

      <CommentSheet
        visible={commentSheetOpen}
        postId={post.id}
        onClose={() => setCommentSheetOpen(false)}
      />

      <ShareSheet
        visible={shareSheetOpen}
        postUrl={`https://throttlist.com/post/${post.id}`}
        onClose={() => setShareSheetOpen(false)}
      />

      {isOwner && (
        <PostEditSheet
          visible={editSheetOpen}
          post={post}
          parts={allParts}
          isPinned={isPinned}
          onClose={() => setEditSheetOpen(false)}
          onSave={(updates) => {
            setLocalCaption(updates.caption)
            setLocalTaggedIds(updates.taggedPartIds)
          }}
          onTogglePin={() => setIsPinned(v => !v)}
          onDelete={() => setDeleted(true)}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navRow: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 16,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backBtn: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 20,
    padding: 8,
  },
  photoSkeleton: {
    width: SCREEN_WIDTH,
    height: PHOTO_HEIGHT,
    backgroundColor: colors.surface2,
  },
  photoWrap: {
    position: 'relative',
  },
  photo: {
    width: SCREEN_WIDTH,
    height: PHOTO_HEIGHT,
    backgroundColor: colors.surface2,
  },
  overlayAuthor: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 22,
    left: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  overlayHandle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  overlayBuild: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    marginTop: 1,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    maxWidth: SCREEN_WIDTH * 0.55,
  },
  overlayTime: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
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
  // Action bar
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionCount: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  // Caption
  captionWrap: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 4,
  },
  caption: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
  },
  // Parts
  partsSection: {
    marginTop: 8,
    paddingBottom: 4,
  },
  partRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  partDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.surface3,
    flexShrink: 0,
  },
  partInfo: {
    flex: 1,
  },
  partName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  partCategory: {
    color: colors.textTertiary,
    fontSize: 11,
    marginTop: 1,
  },
  notFound: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  // Inline top comments
  commentsSection: {
    marginTop: 12,
    paddingBottom: 4,
  },
  noCommentsRow: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  noCommentsText: {
    color: colors.textTertiary,
    fontSize: 13,
  },
  inlineComment: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  inlineAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    flexShrink: 0,
    borderWidth: 1,
    borderColor: colors.surface3,
  },
  inlineCommentBody: {
    flex: 1,
  },
  inlineCommentText: {
    color: colors.textPrimary,
    fontSize: 13,
    lineHeight: 18,
  },
  inlineCommentUser: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  inlineLikeCol: {
    alignItems: 'center',
    gap: 3,
    paddingTop: 2,
    width: 28,
    flexShrink: 0,
  },
  inlineLikeCount: {
    color: colors.textTertiary,
    fontSize: 10,
    fontWeight: '600',
  },
  moreDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingTop: 8,
    paddingBottom: 4,
  },
  dot3: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surface3,
  },
})
