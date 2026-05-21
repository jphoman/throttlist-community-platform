import React, { useState, useMemo, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Platform,
  Linking,
  Modal,
  FlatList,
  TextInput,
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  Users,
  Palette,
  ShoppingCart,
  Wrench,
  ExternalLink,
  MessageCircle,
  Edit2,
  MoreHorizontal,
  Pin,
  Send,
  ProBadge,
} from '@/components/Icons'
import { listBuilds, listUsers, listParts, listPosts, listComments, listBuildFollowers, addComment, isProUser } from '@/lib/data'
import { colors, formatFollowers, MOCK_USER_ID } from '@/constants/throttlist'
import InitialsAvatar from '@/components/InitialsAvatar'
import BuildEditSheet from '@/components/BuildEditSheet'
import PostEditSheet from '@/components/PostEditSheet'
import { X } from '@/components/Icons'
import type { Build, Part, Post, Comment, User } from '@/types'

type BuildTab = 'posts' | 'tags' | 'comments'

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

async function fetchBuildProfile(username: string, slug: string) {
  const allUsers = await listUsers()
  const user = allUsers.find(u => u.username === username)
  if (!user) return null

  const builds = await listBuilds({ userId: user.id, slug })
  const build = builds[0]
  if (!build) return null

  const [parts, posts, comments] = await Promise.all([
    listParts({ buildId: build.id }),
    listPosts({ buildId: build.id }),
    listComments({ targetId: build.id }),
  ])

  return { user, build, parts, posts, comments }
}

export default function BuildProfileScreen() {
  const { username, slug } = useLocalSearchParams<{ username: string; slug: string }>()
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState<BuildTab>('posts')
  const [buildEditOpen, setBuildEditOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [pinnedPostId, setPinnedPostId] = useState<string | null>(null)
  const [localBuildOverrides, setLocalBuildOverrides] = useState<{ nickname?: string; tags?: string[]; isPrivate?: boolean } | null>(null)
  const [followersSheetOpen, setFollowersSheetOpen] = useState(false)
  const [localPostEdits, setLocalPostEdits] = useState<Record<string, { caption?: string; taggedPartIds?: string[] }>>({})
  const [deletedPostIds, setDeletedPostIds] = useState<string[]>([])
  const [commentText, setCommentText] = useState('')
  const [localComments, setLocalComments] = useState<Comment[]>([])
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; username: string } | null>(null)
  const commentInputRef = useRef<any>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['build-profile', username, slug],
    queryFn: () => fetchBuildProfile(username!, slug!),
    enabled: !!username && !!slug,
  })

  const { data: buildFollowers = [] } = useQuery({
    queryKey: ['build-followers', data?.build?.id],
    queryFn: () => listBuildFollowers(data!.build.id),
    enabled: !!data?.build?.id,
  })

  // Must be before any early returns — Rules of Hooks
  const allTaggedPartIds = useMemo(() => {
    if (!data) return []
    const ids = new Set<string>()
    data.posts.forEach(p => {
      try { (JSON.parse(p.taggedPartIds) as string[]).forEach(id => ids.add(id)) } catch {}
    })
    return Array.from(ids)
  }, [data])

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.skeleton} />
        <View style={styles.skeletonNav}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={20} color="rgba(255,255,255,0.5)" />
          </Pressable>
        </View>
      </View>
    )
  }

  if (!data) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Pressable onPress={() => router.back()} style={styles.backBtnAbs}>
          <ArrowLeft size={20} color={colors.textSecondary} />
        </Pressable>
        <Text style={styles.notFound}>Build not found</Text>
      </View>
    )
  }

  const { user, build, parts, comments } = data
  const isOwner = user.id === MOCK_USER_ID

  const allComments = [...comments, ...localComments]

  async function handleSendComment() {
    const text = commentText.trim()
    if (!text) return
    setCommentText('')
    const newComment = await addComment(build.id, text, replyingTo?.commentId)
    setLocalComments(prev => [...prev, newComment])
    setReplyingTo(null)
  }

  function handleReply(commentId: string, username: string) {
    setReplyingTo({ commentId, username })
    setTimeout(() => commentInputRef.current?.focus(), 50)
  }

  // Apply local edits and filter deleted posts, pin first
  const rawPosts = data.posts
    .filter(p => !deletedPostIds.includes(p.id))
    .map(p => localPostEdits[p.id] ? { ...p, ...localPostEdits[p.id] } : p)
  const posts = [...rawPosts].sort((a, b) => {
    if (a.id === pinnedPostId) return -1
    if (b.id === pinnedPostId) return 1
    return 0
  })

  // Apply local build overrides
  const effectiveTags: string[] = localBuildOverrides?.tags
    ?? (() => { try { return JSON.parse(build.tags) } catch { return [] } })()
  const effectiveNickname = localBuildOverrides?.nickname ?? build.nickname

  const tags = effectiveTags

  const paintParts = parts.filter(p => p.category?.toLowerCase() === 'paint')
  const otherParts = parts.filter(p => p.category?.toLowerCase() !== 'paint')
  const byCategory: Record<string, Part[]> = {}
  otherParts.forEach(p => {
    const cat = p.category || 'Other'
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(p)
  })

  const TABS: { key: BuildTab; label: string; count: number }[] = [
    { key: 'posts', label: 'Posts', count: posts.length },
    { key: 'tags', label: 'Tags', count: parts.length },
    { key: 'comments', label: 'Comments', count: allComments.length },
  ]

  return (
    <View style={styles.container}>
      {/* Floating nav: back left, edit right (owner only) */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="rgba(255,255,255,0.5)" />
        </Pressable>
        {isOwner && (
          <Pressable onPress={() => setBuildEditOpen(true)} style={styles.backBtn}>
            <Edit2 size={18} color="rgba(255,255,255,0.5)" />
          </Pressable>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover photo */}
        {build.coverPhotoUrl ? (
          <Image source={{ uri: build.coverPhotoUrl }} style={styles.cover} resizeMode="cover" />
        ) : (
          <View style={[styles.cover, styles.coverFallback]} />
        )}

        {/* Build info */}
        <View style={styles.buildInfo}>
          <View style={styles.titleRow}>
            <View style={styles.titleLeft}>
              <Text style={styles.nickname}>
                {effectiveNickname || `${build.year} ${build.make}`}
              </Text>
              <Text style={styles.meta}>
                {build.year} {build.make} {build.model}
              </Text>
            </View>
            <Pressable
              style={[styles.followBtn, isFollowing && styles.followBtnActive]}
              onPress={() => setIsFollowing(!isFollowing)}
            >
              <Text style={[styles.followBtnText, isFollowing && styles.followBtnTextActive]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </Pressable>
          </View>

          <Pressable style={styles.userRow} onPress={() => router.push(`/user/${user.username}`)}>
            <InitialsAvatar name={user.displayName} photoUrl={user.avatarUrl} size={26} />
            <Text style={styles.handle}>@{user.username}</Text>
            {isProUser(user.username) && <ProBadge size={12} />}
          </Pressable>

          <Pressable style={styles.statsRow} onPress={() => setFollowersSheetOpen(true)}>
            <Users size={13} color={colors.textTertiary} />
            <Text style={[styles.statText, styles.statTextLink]}>
              {formatFollowers(build.followerCount + (isFollowing ? 1 : 0))} followers
            </Text>
          </Pressable>

          {tags.length > 0 && (
            <View style={styles.tagsRow}>
              {tags.map(tag => (
                <Pressable
                  key={tag}
                  style={styles.tagPill}
                  onPress={() => router.push(`/tag/${tag}`)}
                >
                  <Text style={styles.tagText}>#{tag}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Posts / Tags / Comments tabs */}
        <View style={styles.tabStrip}>
          {TABS.map(tab => (
            <Pressable
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
              <Text style={[styles.tabCount, activeTab === tab.key && styles.tabCountActive]}>
                {tab.count}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Tab content */}
        <View style={styles.tabContent}>
          {activeTab === 'posts' && (
            posts.length === 0 ? (
              <Text style={styles.emptyText}>No posts yet</Text>
            ) : (
              posts.map(post => {
                const photos: string[] = (() => { try { return JSON.parse(post.photos) } catch { return [] } })()
                const taggedIds: string[] = (() => { try { return JSON.parse(post.taggedPartIds ?? '[]') } catch { return [] } })()
                const thumb = photos[0]
                const isPinned = pinnedPostId === post.id
                return (
                  <Pressable
                    key={post.id}
                    style={[styles.postRow, isPinned && styles.postRowPinned]}
                    onPress={() => router.push(`/post/${post.id}`)}
                  >
                    {thumb ? (
                      <Image source={{ uri: thumb }} style={styles.postThumb} resizeMode="cover" />
                    ) : (
                      <View style={[styles.postThumb, styles.postThumbEmpty]} />
                    )}
                    <View style={styles.postRowInfo}>
                      {isPinned && (
                        <View style={styles.pinnedBadge}>
                          <Pin size={10} color={colors.accent} />
                          <Text style={styles.pinnedBadgeText}>Pinned</Text>
                        </View>
                      )}
                      <Text style={styles.postCaption} numberOfLines={2}>{post.caption || 'No caption'}</Text>
                      <Text style={styles.postMeta}>
                        {taggedIds.length} tag{taggedIds.length !== 1 ? 's' : ''} · {post.likeCount} likes · {post.commentCount} comments
                      </Text>
                    </View>
                    {isOwner && (
                      <Pressable
                        style={styles.postMenuBtn}
                        onPress={(e) => { e.stopPropagation(); setEditingPost(post) }}
                        hitSlop={8}
                      >
                        <MoreHorizontal size={18} color={colors.textTertiary} />
                      </Pressable>
                    )}
                  </Pressable>
                )
              })
            )
          )}

          {activeTab === 'tags' && (
            parts.length === 0 ? (
              <Text style={styles.emptyText}>No mods logged yet</Text>
            ) : (
              <>
                {paintParts.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Palette size={15} color={colors.accent} />
                      <Text style={styles.sectionTitle}>Paint</Text>
                    </View>
                    {paintParts.map(part => <PartRow key={part.id} part={part} />)}
                  </View>
                )}
                {Object.entries(byCategory).map(([category, catParts]) => (
                  <View key={category} style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Wrench size={15} color={colors.textTertiary} />
                      <Text style={styles.sectionTitle}>{category}</Text>
                    </View>
                    {catParts.map(part => <PartRow key={part.id} part={part} />)}
                  </View>
                ))}
              </>
            )
          )}

          {activeTab === 'comments' && (() => {
            const topLevel = allComments.filter(c => !c.parentId)
            const repliesByParent: Record<string, Comment[]> = {}
            allComments.filter(c => !!c.parentId).forEach(r => {
              if (!repliesByParent[r.parentId!]) repliesByParent[r.parentId!] = []
              repliesByParent[r.parentId!].push(r)
            })
            return topLevel.length === 0 ? (
              <Text style={styles.emptyText}>No comments yet. Be the first!</Text>
            ) : (
              topLevel.map(comment => (
                <React.Fragment key={comment.id}>
                  <View style={styles.commentRow}>
                    <InitialsAvatar
                      name={comment.displayName ?? comment.username ?? '?'}
                      photoUrl={comment.avatarUrl}
                      size={34}
                    />
                    <View style={styles.commentInfo}>
                      <View style={styles.commentHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Text style={styles.commentUsername}>@{comment.username}</Text>
                          {isProUser(comment.username) && <ProBadge size={12} />}
                        </View>
                        <Text style={styles.commentTime}>{relativeTime(comment.createdAt)}</Text>
                      </View>
                      <Text style={styles.commentBody}>{comment.body}</Text>
                      <Pressable onPress={() => handleReply(comment.id, comment.username ?? '')} style={styles.replyBtn}>
                        <Text style={styles.replyBtnText}>Reply</Text>
                      </Pressable>
                    </View>
                  </View>
                  {(repliesByParent[comment.id] ?? []).map(reply => (
                    <View key={reply.id} style={styles.replyRow}>
                      <InitialsAvatar
                        name={reply.displayName ?? reply.username ?? '?'}
                        photoUrl={reply.avatarUrl}
                        size={28}
                      />
                      <View style={styles.commentInfo}>
                        <View style={styles.commentHeader}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Text style={styles.commentUsername}>@{reply.username}</Text>
                            {isProUser(reply.username) && <ProBadge size={12} />}
                          </View>
                          <Text style={styles.commentTime}>{relativeTime(reply.createdAt)}</Text>
                        </View>
                        <Text style={styles.commentBody}>{reply.body}</Text>
                        <Pressable onPress={() => handleReply(comment.id, comment.username ?? '')} style={styles.replyBtn}>
                          <Text style={styles.replyBtnText}>Reply</Text>
                        </Pressable>
                      </View>
                    </View>
                  ))}
                </React.Fragment>
              ))
            )
          })()}
        </View>

        <View style={{ height: activeTab === 'comments' ? (replyingTo ? 104 : 80) : 48 }} />
      </ScrollView>

      {activeTab === 'comments' && (
        <View style={styles.commentInputBar}>
          {replyingTo && (
            <View style={styles.replyingBanner}>
              <Text style={styles.replyingText}>Replying to @{replyingTo.username}</Text>
              <Pressable onPress={() => { setReplyingTo(null); setCommentText('') }}>
                <X size={14} color={colors.textTertiary} />
              </Pressable>
            </View>
          )}
          <View style={styles.commentInputRow}>
            <TextInput
              ref={commentInputRef}
              style={styles.commentInput}
              placeholder={replyingTo ? `Reply to @${replyingTo.username}…` : 'Add a comment…'}
              placeholderTextColor={colors.textTertiary}
              value={commentText}
              onChangeText={setCommentText}
              multiline={false}
              returnKeyType="send"
              onSubmitEditing={handleSendComment}
            />
            <Pressable
              style={[styles.commentSendBtn, !commentText.trim() && styles.commentSendBtnDisabled]}
              onPress={handleSendComment}
              disabled={!commentText.trim()}
            >
              <Send size={16} color="#fff" />
            </Pressable>
          </View>
        </View>
      )}

      {/* Build edit sheet (owner only) */}
      <BuildEditSheet
        visible={buildEditOpen}
        build={build}
        onClose={() => setBuildEditOpen(false)}
        onSave={(updates) => setLocalBuildOverrides(prev => ({ ...prev, ...updates }))}
      />

      {/* Followers sheet */}
      <Modal
        visible={followersSheetOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setFollowersSheetOpen(false)}
      >
        <Pressable style={styles.sheetBackdrop} onPress={() => setFollowersSheetOpen(false)} />
        <View style={styles.followersSheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>
              Followers ({formatFollowers(build.followerCount + (isFollowing ? 1 : 0))})
            </Text>
            <Pressable onPress={() => setFollowersSheetOpen(false)} style={styles.sheetClose}>
              <X size={20} color={colors.textSecondary} />
            </Pressable>
          </View>
          <FlatList
            data={buildFollowers}
            keyExtractor={u => u.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.sheetEmpty}>
                <Text style={styles.sheetEmptyText}>No followers yet.</Text>
              </View>
            }
            renderItem={({ item }) => (
              <Pressable
                style={styles.followerRow}
                onPress={() => { setFollowersSheetOpen(false); router.push(`/user/${item.username}`) }}
              >
                <InitialsAvatar name={item.displayName ?? item.username} photoUrl={item.avatarUrl} size={40} />
                <View style={styles.followerInfo}>
                  <Text style={styles.followerName}>{item.displayName}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={styles.followerHandle}>@{item.username}</Text>
                    {isProUser(item.username) && <ProBadge size={11} />}
                  </View>
                </View>
              </Pressable>
            )}
          />
          <View style={{ height: Platform.OS === 'ios' ? 28 : 12 }} />
        </View>
      </Modal>

      {/* Post edit sheet */}
      {editingPost && (
        <PostEditSheet
          visible={!!editingPost}
          post={editingPost}
          parts={parts}
          suggestedPartIds={allTaggedPartIds}
          isPinned={pinnedPostId === editingPost.id}
          onClose={() => setEditingPost(null)}
          onSave={(updates) => {
            setLocalPostEdits(prev => ({
              ...prev,
              [editingPost.id]: {
                ...(prev[editingPost.id] ?? {}),
                caption: updates.caption,
                taggedPartIds: JSON.stringify(updates.taggedPartIds),
              },
            }))
            setEditingPost(null)
          }}
          onTogglePin={() =>
            setPinnedPostId(prev => prev === editingPost.id ? null : editingPost.id)
          }
          onDelete={() => setDeletedPostIds(prev => [...prev, editingPost.id])}
        />
      )}
    </View>
  )
}

function PartRow({ part }: { part: Part }) {
  const isLinkable = part.type === 'linkable'
  const isService = part.type === 'service'
  const iconColor = isLinkable ? colors.accent : colors.textTertiary

  return (
    <View style={partStyles.row}>
      <View style={partStyles.left}>
        {isLinkable ? (
          <ShoppingCart size={14} color={iconColor} />
        ) : isService ? (
          <Wrench size={14} color={iconColor} />
        ) : (
          <Palette size={14} color={iconColor} />
        )}
        <View style={partStyles.info}>
          <Text style={[partStyles.name, isLinkable && { color: colors.accent }]}>
            {part.name}
          </Text>
          {part.notes ? (
            <Text style={partStyles.notes} numberOfLines={2}>{part.notes}</Text>
          ) : null}
        </View>
      </View>
      {isLinkable && part.sourceUrl ? (
        <Pressable onPress={() => part.sourceUrl && Linking.openURL(part.sourceUrl)}>
          <ExternalLink size={14} color={colors.accent} />
        </Pressable>
      ) : null}
    </View>
  )
}

const partStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },
  info: {
    flex: 1,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  notes: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 3,
    lineHeight: 17,
  },
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeleton: {
    width: '100%',
    height: 260,
    backgroundColor: colors.surface2,
  },
  skeletonNav: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 16,
    left: 16,
    zIndex: 10,
  },
  navBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 16,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 8,
  },
  backBtnAbs: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 16,
    left: 16,
    backgroundColor: colors.surface1,
    borderRadius: 20,
    padding: 8,
  },
  cover: {
    width: '100%',
    height: 260,
    backgroundColor: colors.surface2,
  },
  coverFallback: {
    backgroundColor: '#1C1C1C',
  },
  buildInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  titleLeft: {
    flex: 1,
  },
  nickname: {
    color: colors.accent,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 3,
  },
  followBtn: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexShrink: 0,
  },
  followBtnActive: {
    backgroundColor: colors.accent,
  },
  followBtnText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  followBtnTextActive: {
    color: '#fff',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  handle: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  statText: {
    color: colors.textTertiary,
    fontSize: 13,
  },
  statTextLink: {
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
  // Followers sheet
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  followersSheet: {
    backgroundColor: colors.surface1,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '70%',
    minHeight: 240,
    paddingBottom: 0,
  },
  sheetHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surface3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sheetTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  sheetClose: { padding: 4 },
  followerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  followerInfo: { flex: 1 },
  followerName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  followerHandle: {
    color: colors.textTertiary,
    fontSize: 12,
    marginTop: 1,
  },
  sheetEmpty: {
    padding: 40,
    alignItems: 'center',
  },
  sheetEmptyText: {
    color: colors.textTertiary,
    fontSize: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagPill: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.surface2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.surface1,
  },
  tagText: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  tabStrip: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.accent,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.textPrimary,
  },
  tabCount: {
    color: colors.textTertiary,
    fontSize: 11,
    fontWeight: '500',
    backgroundColor: colors.surface2,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  tabCountActive: {
    color: colors.accent,
    backgroundColor: colors.accent + '22',
  },
  tabContent: {
    paddingBottom: 8,
  },
  emptyText: {
    color: colors.textTertiary,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 32,
  },
  postRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  postRowPinned: {
    backgroundColor: colors.accent + '0C',
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    paddingLeft: 13,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  pinnedBadgeText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  postMenuBtn: {
    padding: 6,
  },
  postThumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.surface2,
  },
  postThumbEmpty: {
    backgroundColor: colors.surface2,
  },
  postRowInfo: {
    flex: 1,
  },
  postCaption: {
    color: colors.textPrimary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  postMeta: {
    color: colors.textTertiary,
    fontSize: 11,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  commentInfo: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  commentUsername: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  commentTime: {
    color: colors.textTertiary,
    fontSize: 11,
  },
  commentBody: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  commentInputBar: {
    flexDirection: 'column',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  replyingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 6,
  },
  replyingText: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    color: colors.textPrimary,
    fontSize: 14,
  },
  commentSendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentSendBtnDisabled: {
    opacity: 0.4,
  },
  replyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingLeft: 54,
    paddingRight: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface1 + '55',
  },
  replyBtn: {
    marginTop: 5,
  },
  replyBtnText: {
    color: colors.textTertiary,
    fontSize: 12,
    fontWeight: '600',
  },
  notFound: {
    color: colors.textSecondary,
    fontSize: 16,
  },
})
