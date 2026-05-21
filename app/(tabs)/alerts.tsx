import React from 'react'
import { View, Text, StyleSheet, Platform, Image } from 'react-native'
import { Bell, Heart, MessageCircle, UserPlus } from '@/components/Icons'
import { colors, timeAgo } from '@/constants/throttlist'

// Mock alerts since we don't have a notifications table yet
const MOCK_ALERTS = [
  {
    id: 'a1',
    type: 'like',
    actor: '@moto_mx',
    actorAvatar: 'https://i.pravatar.cc/150?u=moto_mx',
    content: 'liked your post on The Cappuccino',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    read: false,
  },
  {
    id: 'a2',
    type: 'comment',
    actor: '@blacktank',
    actorAvatar: 'https://i.pravatar.cc/150?u=blacktank',
    content: 'commented: "Those JvB gaiters are on my list..."',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    read: false,
  },
  {
    id: 'a3',
    type: 'follow',
    actor: '@nineT_builds',
    actorAvatar: 'https://i.pravatar.cc/150?u=nineT_builds',
    content: 'started following The Cappuccino',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    read: true,
  },
  {
    id: 'a4',
    type: 'like',
    actor: '@ironhead_rita',
    actorAvatar: 'https://i.pravatar.cc/150?u=ironhead_rita',
    content: 'liked your post on The Cappuccino',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
  },
]

function AlertIcon({ type }: { type: string }) {
  if (type === 'like') return <Heart size={16} color={colors.accent} fill={colors.accent} />
  if (type === 'comment') return <MessageCircle size={16} color={colors.accent} />
  if (type === 'follow') return <UserPlus size={16} color={colors.accent} />
  return <Bell size={16} color={colors.accent} />
}

export default function AlertsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Bell size={20} color={colors.accent} />
        <Text style={styles.headerTitle}>Alerts</Text>
        {MOCK_ALERTS.filter(a => !a.read).length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{MOCK_ALERTS.filter(a => !a.read).length}</Text>
          </View>
        )}
      </View>

      {MOCK_ALERTS.map(alert => (
        <View
          key={alert.id}
          style={[styles.alertRow, !alert.read && styles.alertRowUnread]}
        >
          <View style={styles.avatarWrap}>
            <Image source={{ uri: alert.actorAvatar }} style={styles.avatar} />
            <View style={styles.iconBadge}>
              <AlertIcon type={alert.type} />
            </View>
          </View>
          <View style={styles.alertInfo}>
            <Text style={styles.alertText}>
              <Text style={styles.alertActor}>{alert.actor}</Text>
              {' '}{alert.content}
            </Text>
            <Text style={styles.alertTime}>{timeAgo(alert.createdAt)}</Text>
          </View>
          {!alert.read && <View style={styles.unreadDot} />}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 54 : 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  badge: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  alertRowUnread: {
    backgroundColor: colors.surface1,
  },
  avatarWrap: {
    position: 'relative',
    flexShrink: 0,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.surface3,
  },
  iconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.surface2,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  alertInfo: {
    flex: 1,
  },
  alertText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  alertActor: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  alertTime: {
    color: colors.textTertiary,
    fontSize: 12,
    marginTop: 3,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    flexShrink: 0,
  },
})
