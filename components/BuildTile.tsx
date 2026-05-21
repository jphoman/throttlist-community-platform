import React from 'react'
import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import { colors } from '@/constants/throttlist'
import type { Build } from '@/types'

interface Props {
  build: Build & { username?: string; avatarUrl?: string; ownerIsPro?: boolean }
  size?: number
  onPress?: () => void
  isFollowing?: boolean
  onFollow?: () => void
}

export default function BuildTile({ build, size = 120, onPress, isFollowing, onFollow }: Props) {
  const showFollow = onFollow !== undefined
  const isPro = build.ownerIsPro ?? false

  return (
    <View style={{ width: size, gap: showFollow ? 5 : 0 }}>
      <Pressable style={[styles.tile, { width: size, height: size }]} onPress={onPress}>
        {build.coverPhotoUrl ? (
          <Image source={{ uri: build.coverPhotoUrl }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
        ) : (
          <View style={[StyleSheet.absoluteFillObject, styles.fallback]} />
        )}
        <View style={styles.overlay}>
          <View style={[styles.avatarRing, isPro ? styles.avatarRingPro : styles.avatarRingDefault]}>
            {build.avatarUrl ? (
              <Image source={{ uri: build.avatarUrl }} style={styles.avatarImg} />
            ) : (
              <Text style={styles.avatarLetter}>
                {(build.username || '?')[0].toUpperCase()}
              </Text>
            )}
          </View>
          <View style={styles.textBlock}>
            {build.username && (
              <Text style={styles.username} numberOfLines={1}>@{build.username}</Text>
            )}
            <Text style={styles.model} numberOfLines={1}>
              {build.year} {build.make} {build.model}
            </Text>
          </View>
        </View>
      </Pressable>
      {showFollow && (
        <Pressable
          style={[styles.followBtn, isFollowing && styles.followBtnActive]}
          onPress={() => onFollow!()}
        >
          <Text style={[styles.followBtnText, isFollowing && styles.followBtnTextActive]}>
            {isFollowing ? 'Following' : 'Follow'}
          </Text>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  tile: {
    overflow: 'hidden',
    backgroundColor: colors.surface2,
  },
  fallback: {
    backgroundColor: colors.surface2,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 6,
    paddingVertical: 5,
    backgroundColor: 'rgba(0,0,0,0.62)',
  },
  avatarRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarRingPro: {
    borderColor: colors.accent,
  },
  avatarRingDefault: {
    borderColor: 'rgba(255,255,255,0.75)',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarLetter: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  username: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 9,
    fontWeight: '600',
  },
  model: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 13,
  },
  followBtn: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 6,
    paddingVertical: 5,
    alignItems: 'center',
  },
  followBtnActive: {
    backgroundColor: colors.accent,
  },
  followBtnText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '700',
  },
  followBtnTextActive: {
    color: '#fff',
  },
})
