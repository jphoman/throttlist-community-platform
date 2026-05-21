import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { colors } from '@/constants/throttlist'
import { ThrottlistLogo } from '@/components/ThrottlistLogo'

const BUILD_TYPES = [
  { id: 'cafe_racer', label: 'Café Racer', icon: '⚡' },
  { id: 'scrambler', label: 'Scrambler', icon: '🏕️' },
  { id: 'tracker', label: 'Tracker', icon: '🏁' },
  { id: 'bobber', label: 'Bobber', icon: '🔩' },
  { id: 'chopper', label: 'Chopper', icon: '🛠️' },
  { id: 'adventure', label: 'Adventure', icon: '🏔️' },
  { id: 'bagger', label: 'Bagger', icon: '🛣️' },
  { id: 'other', label: 'Other', icon: '🏍️' },
]

export default function OnboardingScreen() {
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    AsyncStorage.getItem('@throttlist_onboarded')
      .then(val => { if (val) router.replace('/feed') })
      .catch(() => {})
  }, [])

  async function handleContinue() {
    await AsyncStorage.setItem('@throttlist_onboarded', '1')
    router.replace('/feed')
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.logoWrap}>
        <ThrottlistLogo color={colors.accent} height={30} />
      </View>

      <Text style={styles.headline}>What do you build?</Text>
      <Text style={styles.sub}>
        We'll personalize your feed and discover page for your build style.
      </Text>

      <View style={styles.grid}>
        {BUILD_TYPES.map(type => (
          <Pressable
            key={type.id}
            style={[styles.card, selected === type.id && styles.cardSelected]}
            onPress={() => setSelected(type.id)}
          >
            <Text style={styles.cardIcon}>{type.icon}</Text>
            <Text style={[styles.cardLabel, selected === type.id && styles.cardLabelSelected]}>
              {type.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[styles.continueBtn, !selected && styles.continueBtnDim]}
        onPress={handleContinue}
        disabled={!selected}
      >
        <Text style={styles.continueBtnText}>Get Started</Text>
      </Pressable>

      <Pressable onPress={handleContinue} style={styles.skip} testID="skip-btn">
        <Text style={styles.skipText}>Skip for now</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 72 : 48,
    paddingBottom: 48,
  },
  logoWrap: {
    marginBottom: 40,
  },
  headline: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  sub: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 32,
  },
  card: {
    width: '47%',
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.surface2,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  cardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '18',
  },
  cardIcon: {
    fontSize: 30,
  },
  cardLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  cardLabelSelected: {
    color: colors.accent,
  },
  continueBtn: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  continueBtnDim: {
    opacity: 0.4,
  },
  continueBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  skip: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipText: {
    color: colors.textTertiary,
    fontSize: 14,
  },
})
