import React from 'react'
import { View, Pressable, StyleSheet, Platform } from 'react-native'
import { Home, Compass, Plus, Send, User } from '@/components/Icons'
import { colors } from '@/constants/throttlist'

function nav(path: string) {
  if (typeof window !== 'undefined') {
    window.location.href = path
  }
}

function activeTab() {
  if (typeof window === 'undefined') return null
  const seg = window.location.pathname.replace('/', '')
  return seg || 'feed'
}

export default function TabBar() {
  const tab = activeTab()

  return (
    <View style={styles.bar}>
      <Pressable style={styles.item} onPress={() => nav('/feed')}>
        <Home size={22} color={tab === 'feed' ? '#FFFFFF' : colors.textSecondary} />
      </Pressable>
      <Pressable style={styles.item} onPress={() => nav('/discover')}>
        <Compass size={22} color={tab === 'discover' ? '#FFFFFF' : colors.textSecondary} />
      </Pressable>
      <Pressable style={styles.item} onPress={() => nav('/add')}>
        <View style={styles.addCircle}>
          <Plus size={22} color="#FFFFFF" />
        </View>
      </Pressable>
      <Pressable style={styles.item} onPress={() => nav('/messages')}>
        <Send size={22} color={tab === 'messages' ? '#FFFFFF' : colors.textSecondary} />
      </Pressable>
      <Pressable style={styles.item} onPress={() => nav('/profile')}>
        <User size={22} color={tab === 'profile' ? '#FFFFFF' : colors.textSecondary} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.bg,
    borderTopColor: colors.surface1,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: Platform.OS === 'ios' ? 24 : 6,
    paddingTop: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCircle: {
    backgroundColor: colors.accent,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'ios' ? 8 : 2,
  },
})
