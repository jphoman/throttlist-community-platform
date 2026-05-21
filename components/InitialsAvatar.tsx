import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { colors, getInitials } from '@/constants/throttlist'

interface Props {
  name?: string | null
  photoUrl?: string | null
  size?: number
}

export default function InitialsAvatar({ name, photoUrl, size = 38 }: Props) {
  const initials = getInitials(name)
  const radius = size / 2

  if (photoUrl) {
    return (
      <Image
        source={{ uri: photoUrl }}
        style={[
          styles.base,
          { width: size, height: size, borderRadius: radius },
        ]}
        resizeMode="cover"
      />
    )
  }

  return (
    <View
      style={[
        styles.base,
        styles.circle,
        { width: size, height: size, borderRadius: radius },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.surface3,
  },
  circle: {
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.textPrimary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
})
