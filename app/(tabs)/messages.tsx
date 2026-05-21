import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  TextInput,
  Image,
  Platform,
} from 'react-native'
import { Edit2, Search, ChevronRight, ProBadge } from '@/components/Icons'
import { isProUser } from '@/lib/data'
import { colors } from '@/constants/throttlist'
import { router } from 'expo-router'
import InitialsAvatar from '@/components/InitialsAvatar'

// ─── Mock Data ─────────────────────────────────────────────────────────────────

interface StatusNote {
  id: string
  username: string
  displayName: string
  avatarUrl: string
  note: string
}

interface Conversation {
  id: string
  isGroup: boolean
  name: string
  avatarUrl?: string
  participants?: { username: string; avatarUrl?: string }[]
  lastMessage: string
  timestamp: string
  unread: number
  isOnline?: boolean
}

interface MessageRequest {
  id: string
  username: string
  displayName: string
  avatarUrl: string
  preview: string
}

const STATUS_NOTES: StatusNote[] = [
  { id: '1', username: 'investomoto',    displayName: 'Ryan | Motorcyclist', avatarUrl: '/avatars/investomoto.jpg',    note: 'Just back from the canyon run 🏔️' },
  { id: '2', username: 'moto_feelz',     displayName: 'Rob Hamilton',        avatarUrl: '/avatars/moto_feelz.jpg',     note: 'New Quad Lock mount installed 📱' },
  { id: '3', username: 'retroscrambler_',displayName: 'Fred Neves',          avatarUrl: '/avatars/retroscrambler_.jpg',note: 'Looking for Triumph seat recs' },
  { id: '4', username: 'seven11moto',    displayName: 'Seven11Moto',         avatarUrl: '/avatars/seven11moto.jpg',    note: 'XSR900 exhaust day 🔥' },
  { id: '5', username: 'thecrocodile',   displayName: 'Chuck Schmidt',       avatarUrl: '/avatars/thecrocodile.jpg',   note: 'New Ducati shots dropping soon 📸' },
]

const CONVERSATIONS: Conversation[] = [
  { id: 'c1', isGroup: false, name: 'investomoto',    avatarUrl: '/avatars/investomoto.jpg',    lastMessage: 'Fire build, what exhaust is that?',           timestamp: '2m',       unread: 2, isOnline: true },
  { id: 'c2', isGroup: false, name: 'moto_feelz',     avatarUrl: '/avatars/moto_feelz.jpg',     lastMessage: "Thanks! It's the SC-Project slip-on",          timestamp: '18m',      unread: 0, isOnline: true },
  {
    id: 'c3', isGroup: true, name: 'Moto Gang 🏍️',
    participants: [
      { username: 'investomoto',    avatarUrl: '/avatars/investomoto.jpg' },
      { username: 'moto_feelz',     avatarUrl: '/avatars/moto_feelz.jpg' },
      { username: 'retroscrambler_',avatarUrl: '/avatars/retroscrambler_.jpg' },
    ],
    lastMessage: "investomoto: Who's bringing tools Sunday?", timestamp: '1h', unread: 5,
  },
  { id: 'c4', isGroup: false, name: 'retroscrambler_',avatarUrl: '/avatars/retroscrambler_.jpg',lastMessage: 'Group ride next Sunday, you in?',               timestamp: '3h',       unread: 1, isOnline: false },
  { id: 'c5', isGroup: false, name: 'seven11moto',    avatarUrl: '/avatars/seven11moto.jpg',    lastMessage: 'Sent a photo',                                 timestamp: 'Yesterday',unread: 0 },
  {
    id: 'c6', isGroup: true, name: 'XSR Owners',
    participants: [
      { username: 'investomoto', avatarUrl: '/avatars/investomoto.jpg' },
      { username: 'seven11moto', avatarUrl: '/avatars/seven11moto.jpg' },
    ],
    lastMessage: 'You: Same issue with the stock seat 😅', timestamp: '2d', unread: 0,
  },
  { id: 'c7', isGroup: false, name: 'thecrocodile',   avatarUrl: '/avatars/thecrocodile.jpg',   lastMessage: 'Loved the latest post 🤘',                     timestamp: '1w',       unread: 0 },
]

const MESSAGE_REQUESTS: MessageRequest[] = [
  { id: 'r1', username: 'motozuc',     displayName: 'Justin',         avatarUrl: '/avatars/motozuc.jpg',     preview: 'Are those frame sliders stock or aftermarket?' },
  { id: 'r2', username: 'coldbrewmoto',displayName: 'Cold Brew Moto', avatarUrl: '/avatars/coldbrewmoto.jpg',preview: 'Hey! Saw your XSR build on the discover page...' },
]

// ─── Sub-components ────────────────────────────────────────────────────────────

function GroupAvatar({ participants }: { participants: { username: string; avatarUrl?: string }[] }) {
  const [p0, p1] = participants
  return (
    <View style={groupAvatarStyles.wrap}>
      {p0?.avatarUrl ? (
        <Image source={{ uri: p0.avatarUrl }} style={groupAvatarStyles.back} />
      ) : (
        <View style={[groupAvatarStyles.back, { backgroundColor: colors.surface3 }]} />
      )}
      {p1?.avatarUrl ? (
        <Image source={{ uri: p1.avatarUrl }} style={groupAvatarStyles.front} />
      ) : (
        <View style={[groupAvatarStyles.front, { backgroundColor: colors.surface2 }]} />
      )}
    </View>
  )
}

const groupAvatarStyles = StyleSheet.create({
  wrap: {
    width: 52,
    height: 52,
    position: 'relative',
  },
  back: {
    width: 38,
    height: 38,
    borderRadius: 19,
    position: 'absolute',
    top: 0,
    left: 0,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  front: {
    width: 38,
    height: 38,
    borderRadius: 19,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: colors.bg,
  },
})

// ─── Main Screen ───────────────────────────────────────────────────────────────

export default function MessagesScreen() {
  const [search, setSearch] = useState('')
  const [requestsOpen, setRequestsOpen] = useState(false)

  const q = search.trim().toLowerCase()

  const filteredConvos = q
    ? CONVERSATIONS.filter(c => c.name.toLowerCase().includes(q))
    : CONVERSATIONS

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Direct Messages</Text>
        <Pressable style={styles.composeBtn}>
          <Edit2 size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Search */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <Search size={15} color={colors.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search messages"
              placeholderTextColor={colors.textTertiary}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
              clearButtonMode="while-editing"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Status notes — horizontal scroll */}
        {!q && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.notesRow}
          >
            {STATUS_NOTES.map(note => (
              <Pressable key={note.id} style={styles.noteItem} onPress={() => router.push(`/user/${note.username}` as any)}>
                <View style={styles.noteAvatarWrap}>
                  {note.avatarUrl ? (
                    <Image source={{ uri: note.avatarUrl }} style={styles.noteAvatar} />
                  ) : (
                    <InitialsAvatar name={note.displayName} size={56} />
                  )}
                  <View style={styles.noteBubble}>
                    <Text style={styles.noteBubbleText} numberOfLines={2}>{note.note}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={styles.noteUsername} numberOfLines={1}>@{note.username}</Text>
                  {isProUser(note.username) && <ProBadge size={11} />}
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* Divider */}
        {!q && <View style={styles.divider} />}

        {/* Conversations */}
        {filteredConvos.map(convo => (
          <Pressable key={convo.id} style={styles.convoRow} onPress={() => router.push(`/conversation/${convo.id}` as any)}>
            {/* Avatar */}
            <View style={styles.avatarCol}>
              {convo.isGroup ? (
                <GroupAvatar participants={convo.participants ?? []} />
              ) : convo.avatarUrl ? (
                <View>
                  <Image source={{ uri: convo.avatarUrl }} style={styles.avatar} />
                  {convo.isOnline && <View style={styles.onlineDot} />}
                </View>
              ) : (
                <InitialsAvatar name={convo.name} size={52} />
              )}
            </View>

            {/* Text */}
            <View style={styles.convoText}>
              <View style={styles.convoTopRow}>
                <Text style={[styles.convoName, convo.unread > 0 && styles.convoNameUnread]}>
                  {convo.name}
                </Text>
                <Text style={[styles.convoTime, convo.unread > 0 && styles.convoTimeUnread]}>
                  {convo.timestamp}
                </Text>
              </View>
              <View style={styles.convoBottomRow}>
                <Text
                  style={[styles.convoPreview, convo.unread > 0 && styles.convoPreviewUnread]}
                  numberOfLines={1}
                >
                  {convo.lastMessage}
                </Text>
                {convo.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{convo.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </Pressable>
        ))}

        {/* No search results */}
        {q && filteredConvos.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No conversations matching "{search}"</Text>
          </View>
        )}

        {/* Message Requests */}
        {!q && MESSAGE_REQUESTS.length > 0 && (
          <>
            <View style={styles.divider} />
            <Pressable
              style={styles.requestsRow}
              onPress={() => setRequestsOpen(v => !v)}
            >
              <Text style={styles.requestsLabel}>
                Requests{' '}
                <Text style={styles.requestsCount}>({MESSAGE_REQUESTS.length})</Text>
              </Text>
              <ChevronRight
                size={16}
                color={colors.textSecondary}
              />
            </Pressable>

            {requestsOpen && MESSAGE_REQUESTS.map(req => (
              <Pressable key={req.id} style={[styles.convoRow, styles.requestItem]}>
                <View style={styles.avatarCol}>
                  {req.avatarUrl ? (
                    <Image source={{ uri: req.avatarUrl }} style={styles.avatar} />
                  ) : (
                    <InitialsAvatar name={req.displayName} size={52} />
                  )}
                </View>
                <View style={styles.convoText}>
                  <View style={styles.convoTopRow}>
                    <Text style={styles.convoName}>{req.displayName}</Text>
                    <Text style={styles.requestTag}>Not following</Text>
                  </View>
                  <Text style={styles.convoPreview} numberOfLines={1}>{req.preview}</Text>
                </View>
              </Pressable>
            ))}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

// ─── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 54 : 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  composeBtn: {
    padding: 4,
  },
  // Search
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.surface2,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    padding: 0,
    margin: 0,
  },
  // Status notes
  notesRow: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 16,
    flexDirection: 'row',
  },
  noteItem: {
    alignItems: 'center',
    width: 72,
    gap: 6,
  },
  noteAvatarWrap: {
    alignItems: 'center',
  },
  noteAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.surface3,
  },
  noteBubble: {
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.surface2,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: -10,
    marginLeft: 28,
    maxWidth: 110,
    minWidth: 60,
  },
  noteBubbleText: {
    color: colors.textPrimary,
    fontSize: 10,
    lineHeight: 13,
  },
  noteUsername: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 6,
  },
  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  // Conversation rows
  convoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  avatarCol: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.surface3,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: colors.green,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  convoText: {
    flex: 1,
    gap: 3,
  },
  convoTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  convoName: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  convoNameUnread: {
    fontWeight: '700',
  },
  convoTime: {
    color: colors.textTertiary,
    fontSize: 12,
    marginLeft: 8,
  },
  convoTimeUnread: {
    color: colors.accent,
    fontWeight: '600',
  },
  convoBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  convoPreview: {
    color: colors.textSecondary,
    fontSize: 13,
    flex: 1,
  },
  convoPreviewUnread: {
    color: colors.textPrimary,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  // Requests
  requestsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  requestsLabel: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  requestsCount: {
    color: colors.accent,
  },
  requestItem: {
    backgroundColor: colors.surface1,
    borderRadius: 10,
    marginHorizontal: 12,
    marginBottom: 6,
  },
  requestTag: {
    color: colors.textTertiary,
    fontSize: 11,
    borderWidth: 1,
    borderColor: colors.surface3,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
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
