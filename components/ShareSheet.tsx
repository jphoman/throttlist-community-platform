import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Image,
  Platform,
  Share,
  Alert,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native'
import { X, CheckCircle, Copy, Instagram, Twitter, MessageCircle, MoreHorizontal, Send } from '@/components/Icons'
import { colors } from '@/constants/throttlist'
import InitialsAvatar from '@/components/InitialsAvatar'

interface ShareContact {
  id: string
  username: string
  displayName: string
  avatarUrl?: string
}

interface ShareSheetProps {
  visible: boolean
  postUrl: string
  onClose: () => void
}

const DM_CONTACTS: ShareContact[] = [
  { id: '1', username: 'investomoto',    displayName: 'Ryan | Motorcyclist', avatarUrl: '/avatars/investomoto.jpg' },
  { id: '2', username: 'moto_feelz',     displayName: 'Rob Hamilton',        avatarUrl: '/avatars/moto_feelz.jpg' },
  { id: '3', username: 'retroscrambler_',displayName: 'Fred Neves',          avatarUrl: '/avatars/retroscrambler_.jpg' },
  { id: '4', username: 'seven11moto',    displayName: 'Seven11Moto',         avatarUrl: '/avatars/seven11moto.jpg' },
  { id: '5', username: 'coldbrewmoto',   displayName: 'Cold Brew Moto',      avatarUrl: '/avatars/coldbrewmoto.jpg' },
]

interface ShareAction {
  id: string
  label: string
  renderIcon: (color: string) => React.ReactNode
}

const SHARE_ACTIONS: ShareAction[] = [
  { id: 'copy',      label: 'Copy Link',  renderIcon: (c) => <Copy size={22} color={c} /> },
  { id: 'instagram', label: 'Instagram',  renderIcon: (c) => <Instagram size={22} color={c} /> },
  { id: 'twitter',   label: 'X / Twitter', renderIcon: (c) => <Twitter size={22} color={c} /> },
  { id: 'sms',       label: 'Message',    renderIcon: (c) => <MessageCircle size={22} color={c} /> },
  { id: 'more',      label: 'More',       renderIcon: (c) => <MoreHorizontal size={22} color={c} /> },
]

async function copyToClipboard(text: string) {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {}
  return false
}

export default function ShareSheet({ visible, postUrl, onClose }: ShareSheetProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')

  const filteredContacts = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return DM_CONTACTS
    return DM_CONTACTS.filter(c =>
      c.username.toLowerCase().includes(q) || c.displayName.toLowerCase().includes(q)
    )
  }, [search])

  function handleToggleContact(contact: ShareContact) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(contact.id)) next.delete(contact.id)
      else next.add(contact.id)
      return next
    })
  }

  async function handleAction(id: string) {
    if (id === 'copy') {
      const ok = await copyToClipboard(postUrl)
      if (ok) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } else {
        Alert.alert('Link', postUrl)
      }
      return
    }

    if (id === 'more') {
      try {
        await Share.share({ message: postUrl, url: postUrl })
      } catch {}
      return
    }

    // Other platforms — just copy on web for now, native would deep-link
    const ok = await copyToClipboard(postUrl)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else {
      try { await Share.share({ message: postUrl }) } catch {}
    }
  }

  function handleClose() {
    setSelected(new Set())
    setCopied(false)
    setSearch('')
    setMessage('')
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header: Share | search | X */}
          <View style={styles.header}>
            <Text style={styles.title}>Share</Text>
            <View style={styles.searchWrap}>
              <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Search…"
                placeholderTextColor={colors.textTertiary}
                returnKeyType="search"
                clearButtonMode="while-editing"
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>
            <Pressable onPress={handleClose} style={styles.closeBtn}>
              <X size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* DM contacts */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.contactsRow}
          >
            {filteredContacts.map(contact => {
              const isSelected = selected.has(contact.id)
              return (
                <Pressable
                  key={contact.id}
                  style={styles.contactItem}
                  onPress={() => handleToggleContact(contact)}
                >
                  <View style={[styles.contactAvatarWrap, isSelected && styles.contactAvatarSelected]}>
                    {contact.avatarUrl ? (
                      <Image source={{ uri: contact.avatarUrl }} style={styles.contactAvatar} />
                    ) : (
                      <InitialsAvatar name={contact.displayName} size={56} />
                    )}
                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <CheckCircle size={16} color={colors.green} />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.contactUsername, isSelected && styles.contactUsernameSelected]} numberOfLines={1}>
                    @{contact.username}
                  </Text>
                </Pressable>
              )
            })}
          </ScrollView>

          {/* Message input — shown when contacts are selected */}
          {selected.size > 0 && (
            <View style={styles.messageRow}>
              <TextInput
                style={styles.messageInput}
                value={message}
                onChangeText={setMessage}
                placeholder="Add a message…"
                placeholderTextColor={colors.textTertiary}
                returnKeyType="send"
                onSubmitEditing={handleClose}
              />
              <Pressable style={styles.messageSendBtn} onPress={handleClose}>
                <Send size={18} color="#fff" />
              </Pressable>
            </View>
          )}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Share actions grid */}
          <View style={styles.actionsGrid}>
            {SHARE_ACTIONS.map(action => {
              const isCopied = action.id === 'copy' && copied
              const iconColor = isCopied ? colors.green : colors.textSecondary
              return (
                <Pressable
                  key={action.id}
                  style={styles.actionItem}
                  onPress={() => handleAction(action.id)}
                >
                  <View style={[styles.actionIconBox, isCopied && styles.actionIconBoxCopied]}>
                    {isCopied
                      ? <CheckCircle size={22} color={colors.green} />
                      : action.renderIcon(iconColor)
                    }
                  </View>
                  <Text style={styles.actionLabel}>
                    {isCopied ? 'Copied!' : action.label}
                  </Text>
                </Pressable>
              )
            })}
          </View>

          <View style={{ height: Platform.OS === 'ios' ? 28 : 12 }} />
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
  sheet: {
    backgroundColor: colors.surface1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  searchWrap: {
    flex: 1,
    backgroundColor: colors.surface2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.surface3,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  searchInput: {
    color: colors.textPrimary,
    fontSize: 13,
  },
  closeBtn: { padding: 4 },
  // DM contacts
  contactsRow: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 18,
    flexDirection: 'row',
  },
  contactItem: {
    alignItems: 'center',
    gap: 5,
    width: 68,
  },
  contactAvatarWrap: {
    position: 'relative',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  contactAvatarSelected: {
    borderColor: colors.green,
  },
  contactAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  selectedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.surface1,
    borderRadius: 10,
  },
  contactUsername: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
  },
  contactUsernameSelected: {
    color: colors.green,
  },
  // Message input
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  messageInput: {
    flex: 1,
    backgroundColor: colors.surface2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.surface3,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: colors.textPrimary,
    fontSize: 14,
  },
  messageSendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  // Actions grid
  actionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 16,
    gap: 4,
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  actionIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.surface3,
  },
  actionIconBoxCopied: {
    backgroundColor: colors.green + '22',
    borderColor: colors.green + '55',
  },
  actionLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
  },
})
