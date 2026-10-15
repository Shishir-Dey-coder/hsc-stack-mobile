import { useState } from "react";

import {
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Drawer } from "expo-router/drawer";
import { router } from "expo-router";

import { StatusBar } from "expo-status-bar";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemeProvider, useAppTheme } from "@/theme/ThemeProvider";

import CustomDrawerContent from "@/components/drawer/CustomDrawerContent";
import AppHeader from "@/components/navigation/AppHeader";
import NotificationsModal from "@/components/notifications/NotificationsModal";

function DrawerNavigator() {
  const { isDark, colors } = useAppTheme();

  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const openProfile = () => {
    router.navigate("/profile");
  };

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <Drawer
        drawerPosition="right"
        drawerContent={(props) => (
          <CustomDrawerContent {...props} />
        )}
        screenOptions={{
          headerShown: true,

          headerTitleAlign: "left",

          // HSCStack logo and title stay on the left
          headerTitle: () => (
            <View style={styles.brandContainer}>
              <Image
                source={require("@/assets/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />

              <Text
                style={[
                  styles.brandTitle,
                  { color: colors.text },
                ]}
              >
                HSC
                <Text style={{ color: colors.primary }}>
                  Stack
                </Text>
              </Text>
            </View>
          ),

          // Notification and account icons stay on the right
          headerRight: () => (
            <AppHeader
              onNotificationsPress={() =>
                setNotificationsOpen(true)
              }
              onProfilePress={openProfile}
            />
          ),

          headerStyle: {
            backgroundColor: colors.surface,
          },

          headerTitleStyle: {
            color: colors.text,
          },

          headerShadowVisible: false,

          headerTintColor: colors.text,

          drawerStyle: {
            backgroundColor: colors.surface,
            width: 310,
          },

          drawerType: "front",

          sceneStyle: {
            backgroundColor: colors.background,
          },

          swipeEdgeWidth: 60,
        }}
      >
        {/* Main bottom-tab navigator */}

        <Drawer.Screen
          name="(tabs)"
          options={{
            title: "HSCStack",
            drawerItemStyle: { display: "none" },
          }}
        />

        {/* Dashboard */}

        <Drawer.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            drawerItemStyle: { display: "none" },
          }}
        />

        {/* Profile */}

        <Drawer.Screen
          name="profile"
          options={{
            title: "Account",
            drawerItemStyle: { display: "none" },
          }}
        />

        {/* Support */}

        <Drawer.Screen
          name="support"
          options={{
            title: "Support Center",
            drawerItemStyle: { display: "none" },
          }}
        />

        {/* Contributors */}

        <Drawer.Screen
          name="contributors"
          options={{
            title: "Our Contributors",
            drawerItemStyle: { display: "none" },
          }}
        />

        {/* Join Contributor */}

        <Drawer.Screen
          name="join-contributor"
          options={{
            title: "Join Our Team",
            drawerItemStyle: { display: "none" },
          }}
        />

        {/* AI Assistant */}

        <Drawer.Screen
          name="ai-assistant"
          options={{
            title: "AI Study Assistant",
            drawerItemStyle: { display: "none" },
          }}
        />

        {/* Donate */}

        <Drawer.Screen
          name="donate"
          options={{
            title: "Donate",
            drawerItemStyle: { display: "none" },
          }}
        />

        {/* More */}

        <Drawer.Screen
          name="more"
          options={{
            title: "More From Us",
            drawerItemStyle: { display: "none" },
          }}
        />
      </Drawer>

      {/* Notifications Modal */}

      <NotificationsModal
        visible={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <DrawerNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  logo: {
    width: 30,
    height: 30,
  },

  brandTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
});