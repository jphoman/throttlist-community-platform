import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { X, Heart, Send, ProBadge } from '@/components/Icons'
import { listComments, isProUser } from '@/lib/data'
import { colors, timeAgo, MOCK_USER_ID } from '@/constants/throttlist'
import InitialsAvatar from '@/components/InitialsAvatar'
import type { Comment } from '@/types'

interface CommentSheetProps {
  visible: boolean
  postId: string
  onClose: () => void
}

interface CommentRowProps {
  comment: Comment
  isMine: boolean
  isReply?: boolean
  onDelete: (id: string) => void
  onReport: (id: string) => void
  onReply: (comment: Comment) => void
}

function CommentRow({ comment, isMine, isReply, onDelete, onReport, onReply }: CommentRowProps) {
  const [liked, setLiked] = useState(false)
  const [actionsOpen, setActionsOpen] = useState(false)

  return (
    <View style={[styles.commentRow, isReply && styles.commentRowReply]}>
      {/* Indent line for replies */}
      {isReply && <View style={styles.replyLine} />}

      {/* Avatar */}
      <View style={styles.avatarCol}>
        {comment.avatarUrl ? (
          <Image source={{ uri: comment.avatarUrl }} style={[styles.avatar, isReply && styles.avatarSmall]} />
        ) : (
          <InitialsAvatar name={comment.displayName ?? comment.username ?? '?'} size={isReply ? 28 : 34} />
        )}
        {!isReply && (comment.isPinned === '1' || comment.isPinned === 1) ? (
          <View style={styles.pinnedDot} />
        ) : null}
      </View>

      {/* Body — long-press zone for delete/report */}
      <Pressable
        style={styles.commentBody}
        onLongPress={() => setActionsOpen(v => !v)}
        delayLongPress={400}
      >
        <View style={styles.commentTop}>
          <View style={styles.usernameRow}>
            <Text style={[styles.commentUsername, isReply && styles.commentUsernameSmall]}>
              @{comment.username}
            </Text>
            {isProUser(comment.username) && <ProBadge size={12} />}
          </View>
          <Text style={styles.commentTime}>{timeAgo(comment.createdAt)}</Text>
        </View>
        <Text style={[styles.commentText, isReply && styles.commentTextSmall]}>
          {comment.body}
        </Text>

        {/* Reply link + action menu */}
        <View style={styles.commentMeta}>
          {actionsOpen ? (
            <View style={styles.actionRow}>
              {isMine ? (
                <Pressable
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => { onDelete(comment.id); setActionsOpen(false) }}
                >
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={[styles.actionBtn, styles.reportBtn]}
                  onPress={() => { onReport(comment.id); setActionsOpen(false) }}
                >
                  <Text style={styles.reportBtnText}>Report</Text>
                </Pressable>
              )}
              <Pressable style={styles.actionBtn} onPress={() => setActionsOpen(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
            </View>
          ) : (
            <Text onPress={() => onReply(comment)} style={styles.replyBtnText}>
              Reply
            </Text>
          )}
        </View>
      </Pressable>

      {/* Like */}
      <Pressable style={styles.likeCol} onPress={() => setLiked(v => !v)}>
        <Heart
          size={isReply ? 14 : 16}
          color={liked ? colors.accent : colors.textTertiary}
          fill={liked ? colors.accent : 'none'}
        />
        <Text style={[styles.likeCount, liked && { color: colors.accent }]}>
          {comment.likes + (liked ? 1 : 0)}
        </Text>
      </Pressable>
    </View>
  )
}

export default function CommentSheet({ visible, postId, onClose }: CommentSheetProps) {
  const [draft, setDraft] = useState('')
  const [localComments, setLocalComments] = useState<Comment[]>([])
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null)
  const inputRef = useRef<TextInput>(null)

  const { data: fetched = [] } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => listComments({ targetId: postId }),
    enabled: visible,
  })

  // Merge fetched + local, pin top-level first
  const allComments = [...localComments, ...fetched]
  const topLevel = allComments
    .filter(c => !c.parentId)
    .sort((a, b) => {
      const ap = a.isPinned === '1' || a.isPinned === 1 ? 1 : 0
      const bp = b.isPinned === '1' || b.isPinned === 1 ? 1 : 0
      return bp - ap
    })
  const repliesById: Record<string, Comment[]> = {}
  allComments.filter(c => c.parentId).forEach(c => {
    const key = c.parentId!
    if (!repliesById[key]) repliesById[key] = []
    repliesById[key].push(c)
  })

  // Flatten into render list: parent, ...its replies, parent, ...
  type ListItem = { comment: Comment; isReply: boolean }
  const listItems: ListItem[] = []
  topLevel.forEach(parent => {
    listItems.push({ comment: parent, isReply: false })
    ;(repliesById[parent.id] ?? []).forEach(reply => {
      listItems.push({ comment: reply, isReply: true })
    })
  })

  function handleReply(comment: Comment) {
    setReplyingTo(comment)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function handleSend() {
    const body = draft.trim()
    if (!body) return

    // Replies always attach to the root parent (flatten threading)
    const parentId = replyingTo
      ? (replyingTo.parentId ?? replyingTo.id)
      : undefined

    const newComment: Comment = {
      id: `local_${Date.now()}`,
      body,
      authorUserId: MOCK_USER_ID,
      parentId,
      targetType: 'post',
      targetId: postId,
      likes: 0,
      isPinned: '0',
      createdAt: new Date().toISOString(),
      username: 'cappuccinomoto',
      displayName: 'Cappuccino Moto',
      avatarUrl: '/cappuccino-logo.jpg',
    }
    setLocalComments(prev => [...prev, newComment])
    setDraft('')
    setReplyingTo(null)
  }

  function handleDelete(id: string) {
    setLocalComments(prev => prev.filter(c => c.id !== id))
  }

  function handleReport(_id: string) {
    // no-op for mock
  }

  const totalCount = listItems.length

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <KeyboardAvoidingView
        style={styles.sheetWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>
              Comments{totalCount > 0 ? ` (${totalCount})` : ''}
            </Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* Comment list */}
          <FlatList
            data={listItems}
            keyExtractor={item => item.comment.id}
            renderItem={({ item }) => (
              <CommentRow
                comment={item.comment}
                isMine={item.comment.authorUserId === MOCK_USER_ID}
                isReply={item.isReply}
                onDelete={handleDelete}
                onReport={handleReport}
                onReply={handleReply}
              />
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No comments yet. Be the first.</Text>
              </View>
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />

          {/* Replying-to banner */}
          {replyingTo && (
            <View style={styles.replyBanner}>
              <Text style={styles.replyBannerText}>
                Replying to{' '}
                <Text style={styles.replyBannerUsername}>@{replyingTo.username}</Text>
              </Text>
              <Pressable onPress={() => setReplyingTo(null)} hitSlop={8}>
                <X size={14} color={colors.textTertiary} />
              </Pressable>
            </View>
          )}

          {/* Input row */}
          <View style={styles.inputRow}>
            <InitialsAvatar name="Cappuccino Moto" size={32} />
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder={replyingTo ? `Reply to @${replyingTo.username}…` : 'Add a comment…'}
              placeholderTextColor={colors.textTertiary}
              value={draft}
              onChangeText={setDraft}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
            <Pressable
              onPress={handleSend}
              style={[styles.sendBtn, !draft.trim() && styles.sendBtnDisabled]}
              disabled={!draft.trim()}
            >
              <Send size={18} color={draft.trim() ? colors.accent : colors.textTertiary} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheetWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheet: {
    backgroundColor: colors.surface1,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '80%',
    minHeight: 300,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
  },
  handle: {
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
  closeBtn: { padding: 4 },
  // Comment rows
  listContent: {
    paddingVertical: 4,
    flexGrow: 1,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  commentRowReply: {
    paddingLeft: 28,
    backgroundColor: colors.surface1,
    borderBottomColor: colors.border,
  },
  replyLine: {
    position: 'absolute',
    left: 40,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.surface3,
  },
  avatarCol: { position: 'relative' },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.surface3,
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.surface3,
  },
  pinnedDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: colors.surface1,
  },
  commentBody: { flex: 1 },
  commentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentUsername: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  commentUsernameSmall: {
    fontSize: 12,
  },
  commentTime: {
    color: colors.textTertiary,
    fontSize: 11,
  },
  commentText: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  commentTextSmall: {
    fontSize: 13,
    lineHeight: 18,
  },
  commentMeta: {
    marginTop: 6,
  },
  replyBtnText: {
    color: colors.textTertiary,
    fontSize: 12,
    fontWeight: '600',
  },
  // Inline actions
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: colors.surface2,
  },
  deleteBtn: {
    backgroundColor: colors.accent + '22',
  },
  deleteBtnText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  reportBtn: {
    backgroundColor: colors.surface2,
  },
  reportBtnText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  cancelBtnText: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  // Like
  likeCol: {
    alignItems: 'center',
    gap: 3,
    paddingTop: 2,
    width: 32,
  },
  likeCount: {
    color: colors.textTertiary,
    fontSize: 11,
    fontWeight: '600',
  },
  // Replying-to banner
  replyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.surface2,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  replyBannerText: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  replyBannerUsername: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  // Input
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface2,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    color: colors.textPrimary,
    fontSize: 14,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.surface3,
  },
  sendBtn: {
    padding: 8,
    marginBottom: 1,
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  // Empty
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textTertiary,
    fontSize: 14,
  },
})
