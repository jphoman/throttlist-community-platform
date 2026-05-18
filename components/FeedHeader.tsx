import React from 'react'
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native'
import { Bell } from '@blinkdotnew/mobile-ui'
import { colors } from '@/constants/throttlist'

interface FeedHeaderProps {
  unreadCount?: number
  onAlertsPress?: () => void
}

export default function FeedHeader({ unreadCount = 0, onAlertsPress }: FeedHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.wordmark}>THROTTLIST</Text>
      <Pressable onPress={onAlertsPress} style={styles.alertBtn}>
        <Bell size={22} color={colors.textSecondary} />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
          </View>
        )}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 54 : 16,
    paddingBottom: 12,
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  wordmark: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  alertBtn: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.accent,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
})
