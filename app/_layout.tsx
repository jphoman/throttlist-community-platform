import { useFrameworkReady } from '@/hooks/useFrameworkReady'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import TabBar from '@/components/TabBar'

const queryClient = new QueryClient()

const HIDE_TAB_BAR = new Set(['onboarding', 'signup', 'settings', 'pro', 'pro-signup'])

export default function RootLayout() {
  useFrameworkReady()
  const segments = useSegments()
  const showTabBar = !HIDE_TAB_BAR.has(segments[0] as string)

  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="following" />
          <Stack.Screen name="pro" />
          <Stack.Screen name="pro-signup" />
          <Stack.Screen name="build/[username]/[slug]" />
          <Stack.Screen name="user/[username]" />
          <Stack.Screen name="post/[postId]" />
          <Stack.Screen name="conversation/[id]" />
          <Stack.Screen name="+not-found" />
        </Stack>
        {showTabBar && <TabBar />}
      </View>
      <StatusBar style="light" />
    </QueryClientProvider>
  )
}
