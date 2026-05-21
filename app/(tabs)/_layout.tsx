import { Tabs } from 'expo-router'
import { Home, Compass, Plus, Send, User } from '@/components/Icons'
import { View, StyleSheet, Platform } from 'react-native'
import { colors } from '@/constants/throttlist'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: styles.tabLabel,
        tabBarShowLabel: true,
        tabBarItemStyle: styles.tabItem,
        tabBarActiveBackgroundColor: 'transparent',
        tabBarInactiveBackgroundColor: 'transparent',
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ focused }) => (
            <Home size={22} color={focused ? '#FFFFFF' : colors.textSecondary} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ focused }) => (
            <Compass size={22} color={focused ? '#FFFFFF' : colors.textSecondary} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarLabel: () => null,
          tabBarIcon: () => (
            <View style={styles.addCircle}>
              <Plus size={22} color="#FFFFFF" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ focused }) => (
            <Send size={22} color={focused ? '#FFFFFF' : colors.textSecondary} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="alerts"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <User size={22} color={focused ? '#FFFFFF' : colors.textSecondary} />
          ),
          tabBarLabel: () => null,
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.bg,
    borderTopColor: colors.surface1,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: Platform.OS === 'ios' ? 24 : 6,
    paddingTop: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    backgroundColor: 'transparent',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
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
