import { useFrameworkReady } from '@/hooks/useFrameworkReady'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  BlinkProvider,
  BlinkToastProvider,
  Theme,
  createTamagui,
  tamaguiDefaultConfig,
} from '@blinkdotnew/mobile-ui'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const config = createTamagui({ ...tamaguiDefaultConfig })
const queryClient = new QueryClient()

export default function RootLayout() {
  useFrameworkReady()

  return (
    <BlinkProvider config={config} defaultTheme="dark">
      <Theme name="dark">
        <QueryClientProvider client={queryClient}>
          <BlinkToastProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="light" />
          </BlinkToastProvider>
        </QueryClientProvider>
      </Theme>
    </BlinkProvider>
  )
}
