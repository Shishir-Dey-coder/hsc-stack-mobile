import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/theme/ThemeProvider";
import TabIcon from "@/components/navigation/TabIcon";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  const bottomInset = Math.max(insets.bottom, 6);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,

        tabBarShowLabel: true,
        tabBarLabelPosition: "below-icon",
        tabBarHideOnKeyboard: true,

        tabBarStyle: {
          backgroundColor: colors.tabBar,

          height: 72 + bottomInset,
          paddingTop: 6,
          paddingBottom: bottomInset,

          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,

          elevation: 10,

          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },

        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },

        tabBarIconStyle: {
          marginTop: 1,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },

        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              focusedIcon="home"
              unfocusedIcon="home-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="tracker"
        options={{
          title: "Tracker",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              focusedIcon="analytics"
              unfocusedIcon="analytics-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="people"
        options={{
          title: "People",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              focusedIcon="people"
              unfocusedIcon="people-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="blog"
        options={{
          title: "Blog",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              focusedIcon="newspaper"
              unfocusedIcon="newspaper-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="forum"
        options={{
          title: "Forum",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              focusedIcon="chatbubbles"
              unfocusedIcon="chatbubbles-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="global_chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              focusedIcon="chatbox"
              unfocusedIcon="chatbox-outline"
            />
          ),
        }}
      />

      {/* Hidden routes */}

      <Tabs.Screen
        name="study"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="ranking"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}