import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { ArrowLeft, Send as SendIcon } from '@/components/Icons'
import { colors } from '@/constants/throttlist'
import InitialsAvatar from '@/components/InitialsAvatar'

const ME = 'cappuccinomoto'

interface Message {
  id: string
  sender: string
  text: string
  ts: string
}

interface ConvoMeta {
  id: string
  name: string
  avatarUrl?: string
  isGroup?: boolean
  isOnline?: boolean
  participants?: { username: string; avatarUrl?: string }[]
}

const CONVOS: ConvoMeta[] = [
  { id: 'c1', name: 'investomoto',     avatarUrl: '/avatars/investomoto.jpg',     isOnline: true },
  { id: 'c2', name: 'moto_feelz',      avatarUrl: '/avatars/moto_feelz.jpg',      isOnline: true },
  { id: 'c3', name: 'Moto Gang 🏍️',   isGroup: true, participants: [
    { username: 'investomoto',    avatarUrl: '/avatars/investomoto.jpg' },
    { username: 'moto_feelz',     avatarUrl: '/avatars/moto_feelz.jpg' },
    { username: 'retroscrambler_',avatarUrl: '/avatars/retroscrambler_.jpg' },
  ]},
  { id: 'c4', name: 'retroscrambler_', avatarUrl: '/avatars/retroscrambler_.jpg', isOnline: false },
  { id: 'c5', name: 'seven11moto',     avatarUrl: '/avatars/seven11moto.jpg' },
  { id: 'c6', name: 'XSR Owners',      isGroup: true, participants: [
    { username: 'investomoto', avatarUrl: '/avatars/investomoto.jpg' },
    { username: 'seven11moto', avatarUrl: '/avatars/seven11moto.jpg' },
  ]},
  { id: 'c7', name: 'thecrocodile',    avatarUrl: '/avatars/thecrocodile.jpg' },
]

const THREAD_MESSAGES: Record<string, Message[]> = {
  c1: [
    { id: 'm1', sender: 'investomoto',   text: 'Hey! Just saw the new build post 🔥',             ts: '2:14 PM' },
    { id: 'm2', sender: ME,              text: 'Thanks! Been working on that setup for a while',   ts: '2:16 PM' },
    { id: 'm3', sender: 'investomoto',   text: 'That exhaust note in the reel is insane',          ts: '2:17 PM' },
    { id: 'm4', sender: 'investomoto',   text: 'Fire build, what exhaust is that?',                ts: '2:18 PM' },
    { id: 'm5', sender: 'investomoto',   text: 'Also where did you get those bar-end mirrors?',    ts: '2:18 PM' },
  ],
  c2: [
    { id: 'm1', sender: 'moto_feelz',    text: 'Your XSR looks insane mate 🤌',                   ts: 'Yesterday' },
    { id: 'm2', sender: ME,              text: 'Appreciate it! Took forever to dial in',           ts: 'Yesterday' },
    { id: 'm3', sender: ME,              text: "Thanks! It's the SC-Project slip-on",              ts: '18m' },
  ],
  c3: [
    { id: 'm1', sender: 'retroscrambler_',text: 'Anyone doing the canyon run this weekend?',       ts: 'Yesterday' },
    { id: 'm2', sender: ME,              text: "I'm in, what time are we leaving?",                ts: 'Yesterday' },
    { id: 'm3', sender: 'moto_feelz',    text: 'Same, just need to check the weather',             ts: 'Yesterday' },
    { id: 'm4', sender: 'investomoto',   text: "Who's bringing tools Sunday?",                     ts: '1h' },
    { id: 'm5', sender: 'investomoto',   text: 'I have the floor jack but need help with stands',  ts: '1h' },
  ],
  c4: [
    { id: 'm1', sender: ME,              text: 'Been thinking about that exhaust swap you mentioned', ts: '4h' },
    { id: 'm2', sender: 'retroscrambler_',text: 'Arrow or SC-Project both worth it on the Triumph', ts: '3h' },
    { id: 'm3', sender: 'retroscrambler_',text: 'Group ride next Sunday, you in?',                 ts: '3h' },
  ],
  c5: [
    { id: 'm1', sender: 'seven11moto',   text: 'Love the fork gaiter look on the XSR',            ts: '2d' },
    { id: 'm2', sender: ME,              text: 'JvB Moto, highly recommend. Transforms the front', ts: '2d' },
    { id: 'm3', sender: 'seven11moto',   text: 'Sent a photo',                                    ts: 'Yesterday' },
  ],
  c6: [
    { id: 'm1', sender: 'seven11moto',   text: 'Anyone else have issues with the stock seat on long rides?', ts: '3d' },
    { id: 'm2', sender: 'investomoto',   text: 'Yes, swapped mine after 200 miles',               ts: '3d' },
    { id: 'm3', sender: ME,              text: 'You: Same issue with the stock seat 😅',           ts: '2d' },
  ],
  c7: [
    { id: 'm1', sender: ME,              text: 'That Ducati shot from last week was 🔥',           ts: '1w' },
    { id: 'm2', sender: 'thecrocodile',  text: 'Loved the latest post 🤘',                        ts: '1w' },
  ],
}

function GroupAvatar({ participants }: { participants: { username: string; avatarUrl?: string }[] }) {
  const [p0, p1] = participants
  return (
    <View style={{ width: 38, height: 38, position: 'relative' }}>
      {p0?.avatarUrl
        ? <Image source={{ uri: p0.avatarUrl }} style={avatarStyles.back} />
        : <View style={[avatarStyles.back, { backgroundColor: colors.surface3 }]} />}
      {p1?.avatarUrl
        ? <Image source={{ uri: p1.avatarUrl }} style={avatarStyles.front} />
        : <View style={[avatarStyles.front, { backgroundColor: colors.surface2 }]} />}
    </View>
  )
}

const avatarStyles = StyleSheet.create({
  back:  { width: 28, height: 28, borderRadius: 14, position: 'absolute', top: 0, left: 0, borderWidth: 1.5, borderColor: colors.bg },
  front: { width: 28, height: 28, borderRadius: 14, position: 'absolute', bottom: 0, right: 0, borderWidth: 1.5, borderColor: colors.bg },
})

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<Message[]>(THREAD_MESSAGES[id] ?? [])
  const listRef = useRef<FlatList>(null)

  const convo = CONVOS.find(c => c.id === id)
  if (!convo) return null

  function send() {
    if (!text.trim()) return
    setMessages(prev => [...prev, {
      id: `m${Date.now()}`,
      sender: ME,
      text: text.trim(),
      ts: 'Now',
    }])
    setText('')
  }

  const senderAvatars: Record<string, string> = {}
  CONVOS.forEach(c => { if (c.avatarUrl && !c.isGroup) senderAvatars[c.name] = c.avatarUrl })
  convo.participants?.forEach(p => { if (p.avatarUrl) senderAvatars[p.username] = p.avatarUrl })

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.textSecondary} />
        </Pressable>
        <Pressable
          style={styles.headerCenter}
          onPress={() => {
            if (!convo.isGroup && convo.name) router.push(`/user/${convo.name}` as any)
          }}
        >
          {convo.isGroup ? (
            <GroupAvatar participants={convo.participants ?? []} />
          ) : convo.avatarUrl ? (
            <View>
              <Image source={{ uri: convo.avatarUrl }} style={styles.headerAvatar} />
              {convo.isOnline && <View style={styles.onlineDot} />}
            </View>
          ) : (
            <InitialsAvatar name={convo.name} size={36} />
          )}
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{convo.name}</Text>
            {!convo.isGroup && convo.isOnline !== undefined && (
              <Text style={styles.headerStatus}>{convo.isOnline ? 'Active now' : 'Offline'}</Text>
            )}
          </View>
        </Pressable>
        <View style={styles.headerSpacer} />
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={m => m.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item, index }) => {
          const isMe = item.sender === ME
          const prevSender = index > 0 ? messages[index - 1].sender : null
          const showAvatar = !isMe && item.sender !== prevSender

          return (
            <View style={[styles.msgRow, isMe && styles.msgRowMe]}>
              {!isMe && (
                <View style={styles.msgAvatarSlot}>
                  {showAvatar && (
                    senderAvatars[item.sender]
                      ? <Image source={{ uri: senderAvatars[item.sender] }} style={styles.msgAvatar} />
                      : <InitialsAvatar name={item.sender} size={28} />
                  )}
                </View>
              )}
              <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                {convo.isGroup && !isMe && showAvatar && (
                  <Text style={styles.senderName}>@{item.sender}</Text>
                )}
                <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>{item.text}</Text>
              </View>
            </View>
          )
        }}
      />

      {/* Compose */}
      <View style={styles.compose}>
        <TextInput
          style={styles.input}
          placeholder="Message…"
          placeholderTextColor={colors.textTertiary}
          value={text}
          onChangeText={setText}
          multiline
          onSubmitEditing={send}
          returnKeyType="send"
          blurOnSubmit={false}
        />
        <Pressable
          style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
          onPress={send}
          disabled={!text.trim()}
        >
          <SendIcon size={18} color={text.trim() ? '#fff' : colors.textTertiary} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 54 : 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 8,
  },
  backBtn: { padding: 4 },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.surface3,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: colors.green,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  headerInfo: { gap: 1 },
  headerName: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  headerStatus: {
    color: colors.textTertiary,
    fontSize: 11,
  },
  headerSpacer: { width: 28 },
  messageList: {
    padding: 16,
    gap: 4,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    marginVertical: 2,
  },
  msgRowMe: {
    justifyContent: 'flex-end',
  },
  msgAvatarSlot: {
    width: 28,
    alignItems: 'center',
  },
  msgAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  bubble: {
    maxWidth: '72%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
  },
  bubbleMe: {
    backgroundColor: colors.accent,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: colors.surface1,
    borderBottomLeftRadius: 4,
  },
  senderName: {
    color: colors.textTertiary,
    fontSize: 10,
    marginBottom: 2,
  },
  bubbleText: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextMe: {
    color: '#fff',
  },
  compose: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    color: colors.textPrimary,
    fontSize: 15,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.surface2,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: colors.surface2,
  },
})
