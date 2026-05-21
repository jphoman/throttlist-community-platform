import React from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { Plus } from '@/components/Icons'
import { colors } from '@/constants/throttlist'

export default function AddScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Plus size={20} color={colors.accent} />
        <Text style={styles.headerTitle}>Add Tag</Text>
      </View>
      <View style={styles.body}>
        <Plus size={48} color={colors.textTertiary} />
        <Text style={styles.title}>Tag a Mod or Part</Text>
        <Text style={styles.body2}>
          Document every change to your build — mods, paint, and service.
        </Text>
      </View>
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
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  body2: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
})
