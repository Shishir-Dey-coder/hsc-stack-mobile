import { useState } from "react";

import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Drawer } from "expo-router/drawer";
import { router } from "expo-router";

import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import type { DrawerContentComponentProps } from "@react-navigation/drawer";

import {
  ThemeProvider,
  useAppTheme,
} from "@/theme/ThemeProvider";

const PURPLE = "#6C4DFF";
const RED = "#E5484D";

/* =====================================================
   CUSTOM DRAWER
===================================================== */

function CustomDrawerContent(
  props: DrawerContentComponentProps
) {
  const insets = useSafeAreaInsets();

  const {
    themeMode,
    setThemeMode,
    colors,
    isDark,
  } = useAppTheme();

  const navigate = (path: string) => {
    props.navigation.closeDrawer();

    router.navigate(path as never);
  };

  const showComingSoon = (title: string) => {
    props.navigation.closeDrawer();

    Alert.alert(
      title,
      `${title} will be available soon.`
    );
  };

  const renderSectionTitle = (title: string) => (
    <Text
      style={[
        styles.sectionTitle,
        { color: colors.textMuted },
      ]}
    >
      {title}
    </Text>
  );

  const renderMenuItem = (
    icon: keyof typeof Ionicons.glyphMap,
    label: string,
    onPress: () => void,
    iconColor?: string
  ) => (
    <Pressable
      key={label}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.menuItem,
        {
          backgroundColor: pressed
            ? isDark
              ? "#29283A"
              : "#F0ECFF"
            : "transparent",
        },
      ]}
    >
      <View
        style={[
          styles.menuIconContainer,
          {
            backgroundColor: isDark
              ? "#252432"
              : "#F5F4FA",
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={19}
          color={iconColor ?? colors.textMuted}
        />
      </View>

      <Text
        style={[
          styles.menuLabel,
          { color: colors.text },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={15}
        color={isDark ? "#65647A" : "#B7B6C5"}
      />
    </Pressable>
  );

  return (
    <View
      style={[
        styles.drawerContainer,
        { backgroundColor: colors.surface },
      ]}
    >
      {/* SCROLLABLE DRAWER MENU */}

      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 12),
            paddingBottom: 18,
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* BRAND HEADER */}

        <View style={styles.brand}>
          <Image
            source={require("@/assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.brandInfo}>
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

            <Text
              style={[
                styles.brandSubtitle,
                { color: colors.textMuted },
              ]}
            >
              Your learning companion
            </Text>
          </View>

          <Pressable
            onPress={() =>
              props.navigation.closeDrawer()
            }
            accessibilityRole="button"
            accessibilityLabel="Close drawer"
            hitSlop={8}
            style={[
              styles.closeButton,
              {
                backgroundColor: isDark
                  ? "#252432"
                  : "#F6F5FA",
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="close"
              size={21}
              color={colors.text}
            />
          </Pressable>
        </View>

        <View
          style={[
            styles.divider,
            { backgroundColor: colors.border },
          ]}
        />

        {/* TOOLS & MORE */}

        {renderSectionTitle("TOOLS & MORE")}

        {renderMenuItem(
          "podium-outline",
          "Leaderboard",
          () => navigate("/ranking"),
          PURPLE
        )}

        {renderMenuItem(
          "hardware-chip-outline",
          "AI Study Assistant",
          () => navigate("/ai-assistant"),
          PURPLE
        )}

        {renderMenuItem(
          "help-circle-outline",
          "Support Center",
          () => navigate("/support-center")
        )}

        {renderMenuItem(
          "heart-outline",
          "Donate",
          () => showComingSoon("Donate"),
          "#F06A91"
        )}

        {renderMenuItem(
          "grid-outline",
          "Dashboard",
          () => navigate("/dashboard"),
          PURPLE
        )}

        {renderMenuItem(
          "document-text-outline",
          "My Submissions",
          () => showComingSoon("My Submissions")
        )}

        <View
          style={[
            styles.divider,
            { backgroundColor: colors.border },
          ]}
        />

        {/* PLATFORM */}

        {renderSectionTitle("PLATFORM")}

        {renderMenuItem(
          "people-outline",
          "Our Contributors",
          () => navigate("/contributors"),
          PURPLE
        )}

        {renderMenuItem(
          "person-add-outline",
          "Join Our Team",
          () => navigate("/join-contributor"),
          PURPLE
        )}

        {renderMenuItem(
          "apps-outline",
          "More From Us",
          () => showComingSoon("More From Us")
        )}

        <View
          style={[
            styles.divider,
            { backgroundColor: colors.border },
          ]}
        />

        {/* APPEARANCE */}

        {renderSectionTitle("APPEARANCE")}

        <View
          style={[
            styles.themeContainer,
            {
              backgroundColor: isDark
                ? "#14141D"
                : "#F4F3F9",
              borderColor: colors.border,
            },
          ]}
        >
          {(
            [
              ["Light", "sunny-outline"],
              ["Dark", "moon-outline"],
              ["System", "phone-portrait-outline"],
            ] as const
          ).map(([value, icon]) => {
            const isActive = themeMode === value;

            return (
              <Pressable
                key={value}
                onPress={() => setThemeMode(value)}
                accessibilityRole="button"
                accessibilityState={{
                  selected: isActive,
                }}
                style={[
                  styles.themeOption,
                  isActive && {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                  },
                ]}
              >
                <Ionicons
                  name={icon}
                  size={15}
                  color={
                    isActive
                      ? colors.primary
                      : colors.textMuted
                  }
                />

                <Text
                  style={[
                    styles.themeText,
                    {
                      color: isActive
                        ? colors.primary
                        : colors.textMuted,
                    },
                  ]}
                >
                  {value}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View
          style={[
            styles.divider,
            { backgroundColor: colors.border },
          ]}
        />

        {/* LEGAL */}

        {renderSectionTitle("LEGAL")}

        <View style={styles.legalRow}>
          <Pressable
            onPress={() =>
              showComingSoon("Privacy Policy")
            }
            hitSlop={8}
          >
            <Text
              style={[
                styles.legalText,
                { color: colors.textMuted },
              ]}
            >
              Privacy
            </Text>
          </Pressable>

          <View
            style={[
              styles.legalDot,
              { backgroundColor: colors.border },
            ]}
          />

          <Pressable
            onPress={() =>
              showComingSoon("Terms of Service")
            }
            hitSlop={8}
          >
            <Text
              style={[
                styles.legalText,
                { color: colors.textMuted },
              ]}
            >
              Terms
            </Text>
          </Pressable>

          <View
            style={[
              styles.legalDot,
              { backgroundColor: colors.border },
            ]}
          />

          <Pressable
            onPress={() =>
              showComingSoon("Content Policy")
            }
            hitSlop={8}
          >
            <Text
              style={[
                styles.legalText,
                { color: colors.textMuted },
              ]}
            >
              Content Policy
            </Text>
          </Pressable>
        </View>

        <Text
          style={[
            styles.versionText,
            { color: colors.textMuted },
          ]}
        >
          HSCStack · Learning Platform
        </Text>
      </ScrollView>

      {/* FIXED ACCOUNT FOOTER */}

      <View
        style={[
          styles.accountContainer,
          {
            paddingBottom: Math.max(insets.bottom, 12),
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
        ]}
      >
        <Pressable
          style={styles.accountButton}
          onPress={() => navigate("/profile")}
          accessibilityRole="button"
          accessibilityLabel="Open account profile"
        >
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: isDark
                  ? "#30284D"
                  : "#F0ECFF",
                borderColor: isDark
                  ? "#51447A"
                  : "#DDD5FF",
              },
            ]}
          >
            <Ionicons
              name="person"
              size={22}
              color={PURPLE}
            />
          </View>

          <View style={styles.accountInfo}>
            <Text
              style={[
                styles.accountTitle,
                { color: colors.text },
              ]}
              numberOfLines={1}
            >
              Shishir Ronjon Dey
            </Text>

            <Text
              style={[
                styles.accountSubtitle,
                { color: colors.textMuted },
              ]}
              numberOfLines={1}
            >
              deyshuvo2022@gmail.com
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            {
              backgroundColor: pressed
                ? isDark
                  ? "#49252C"
                  : "#FFE3E5"
                : isDark
                  ? "#352027"
                  : "#FFF0F0",
            },
          ]}
          onPress={() =>
            Alert.alert(
              "Log out",
              "Authentication sign-out is not connected yet.",
              [{ text: "OK" }]
            )
          }
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <Ionicons
            name="log-out-outline"
            size={21}
            color={RED}
          />
        </Pressable>
      </View>
    </View>
  );
}

/* =====================================================
   ROOT DRAWER NAVIGATOR
===================================================== */

function DrawerNavigator() {
  const { isDark, colors } = useAppTheme();

  const [
    notificationsOpen,
    setNotificationsOpen,
  ] = useState(false);

  const openProfile = () => {
    router.navigate("/profile" as never);
  };

  return (
    <>
      <StatusBar
        style={isDark ? "light" : "dark"}
      />

      <Drawer
        drawerPosition="right"
        drawerContent={(props) => (
          <CustomDrawerContent {...props} />
        )}
        screenOptions={{
          headerShown: true,
          headerTitleAlign: "left",

          headerTitle: () => (
            <View style={styles.headerTitle}>
              <Image
                source={require("@/assets/logo.png")}
                style={styles.headerLogo}
                resizeMode="contain"
              />

              <Text
                style={[
                  styles.headerText,
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

          headerRight: () => (
            <View style={styles.headerActions}>
              {/* NOTIFICATIONS */}

              <Pressable
                style={({ pressed }) => [
                  styles.headerIconButton,
                  {
                    backgroundColor: pressed
                      ? isDark
                        ? "#303047"
                        : "#F0ECFF"
                      : "transparent",
                  },
                ]}
                onPress={() =>
                  setNotificationsOpen(true)
                }
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Open notifications"
              >
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color={colors.text}
                />

                <View
                  style={styles.notificationDot}
                />
              </Pressable>

              {/* PROFILE */}

              <Pressable
                style={({ pressed }) => [
                  styles.headerIconButton,
                  {
                    backgroundColor: pressed
                      ? isDark
                        ? "#303047"
                        : "#F0ECFF"
                      : "transparent",
                  },
                ]}
                onPress={openProfile}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Open profile"
              >
                <Ionicons
                  name="person-circle-outline"
                  size={27}
                  color={colors.text}
                />
              </Pressable>
            </View>
          ),

          headerTintColor: colors.text,

          headerStyle: {
            backgroundColor: colors.surface,
          },

          headerShadowVisible: false,

          drawerActiveTintColor: PURPLE,
          drawerInactiveTintColor: colors.textMuted,

          drawerStyle: {
            backgroundColor: colors.surface,
            width: 310,
          },

          sceneStyle: {
            backgroundColor: colors.background,
          },

          swipeEdgeWidth: 60,
        }}
      >
        {/* BOTTOM TABS */}

        <Drawer.Screen
          name="(tabs)"
          options={{
            title: "HSCStack",
            drawerLabel: "Pages",
            drawerItemStyle: {
              display: "none",
            },
          }}
        />

        {/* DASHBOARD */}

        <Drawer.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            drawerItemStyle: {
              display: "none",
            },
          }}
        />

        {/* CONTRIBUTORS */}

        <Drawer.Screen
          name="join-contributor"
          options={{
            title: "Join Our Team",
            drawerItemStyle: {
              display: "none",
            },
          }}
        />

        <Drawer.Screen
          name="contributors"
          options={{
            title: "Our Contributors",
            drawerItemStyle: {
              display: "none",
            },
          }}
        />

        {/* PROFILE */}

        <Drawer.Screen
          name="profile"
          options={{
            title: "Account",
            drawerItemStyle: {
              display: "none",
            },
          }}
        />
      </Drawer>

      {/* NOTIFICATION MODAL */}

      <Modal
        visible={notificationsOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() =>
          setNotificationsOpen(false)
        }
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() =>
            setNotificationsOpen(false)
          }
        >
          <Pressable
            style={[
              styles.notificationModal,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={(event) =>
              event.stopPropagation()
            }
          >
            {/* MODAL HEADER */}

            <View
              style={styles.notificationHeader}
            >
              <View
                style={styles.notificationHeadingGroup}
              >
                <View
                  style={[
                    styles.notificationHeadingIcon,
                    {
                      backgroundColor: isDark
                        ? "#30284C"
                        : "#F0ECFF",
                    },
                  ]}
                >
                  <Ionicons
                    name="notifications"
                    size={21}
                    color={PURPLE}
                  />
                </View>

                <View>
                  <Text
                    style={[
                      styles.notificationTitle,
                      { color: colors.text },
                    ]}
                  >
                    Notifications
                  </Text>

                  <Text
                    style={[
                      styles.notificationSubtitle,
                      { color: colors.textMuted },
                    ]}
                  >
                    Your latest updates
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() =>
                  setNotificationsOpen(false)
                }
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Close notifications"
              >
                <Ionicons
                  name="close"
                  size={23}
                  color={colors.textMuted}
                />
              </Pressable>
            </View>

            <View
              style={[
                styles.notificationDivider,
                { backgroundColor: colors.border },
              ]}
            />

            {/* EMPTY STATE */}

            <View
              style={styles.emptyNotification}
            >
              <View
                style={[
                  styles.emptyNotificationIcon,
                  {
                    backgroundColor: isDark
                      ? "#25253A"
                      : "#F5F2FF",
                  },
                ]}
              >
                <Ionicons
                  name="notifications-off-outline"
                  size={34}
                  color={PURPLE}
                />
              </View>

              <Text
                style={[
                  styles.emptyNotificationTitle,
                  { color: colors.text },
                ]}
              >
                You're all caught up!
              </Text>

              <Text
                style={[
                  styles.emptyNotificationText,
                  { color: colors.textMuted },
                ]}
              >
                New announcements, forum replies
                and study updates will appear here.
              </Text>
            </View>

            <Pressable
              style={styles.notificationDoneButton}
              onPress={() =>
                setNotificationsOpen(false)
              }
            >
              <Text
                style={styles.notificationDoneText}
              >
                Done
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

/* =====================================================
   ROOT LAYOUT
===================================================== */

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <DrawerNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },

  mainScroll: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 17,
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 2,
    paddingVertical: 12,
    marginBottom: 7,
  },

  logo: {
    width: 43,
    height: 43,
  },

  brandInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },

  brandTitle: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.7,
  },

  brandSubtitle: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: "500",
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.25,
    paddingHorizontal: 5,
    paddingTop: 7,
    paddingBottom: 9,
  },

  menuItem: {
    minHeight: 45,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
    borderRadius: 12,
    marginBottom: 2,
    gap: 11,
  },

  menuIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  menuLabel: {
    flex: 1,
    minWidth: 0,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.05,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 2,
    marginVertical: 13,
  },

  themeContainer: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 13,
    borderWidth: 1,
    marginTop: 3,
    gap: 3,
  },

  themeOption: {
    flex: 1,
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: 9,
  },

  themeText: {
    fontSize: 10,
    fontWeight: "700",
  },

  legalRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    paddingHorizontal: 1,
    paddingTop: 10,
    paddingBottom: 14,
  },

  legalText: {
    fontSize: 10,
    fontWeight: "600",
  },

  legalDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },

  versionText: {
    textAlign: "center",
    fontSize: 9,
    fontWeight: "500",
    marginTop: 2,
    marginBottom: 5,
  },

  accountContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 17,
    paddingTop: 13,
    borderTopWidth: 1,
    gap: 9,
  },

  accountButton: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  accountInfo: {
    flex: 1,
    minWidth: 0,
  },

  accountTitle: {
    fontSize: 11,
    fontWeight: "800",
  },

  accountSubtitle: {
    fontSize: 9,
    marginTop: 4,
  },

  logoutButton: {
    width: 39,
    height: 39,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },

  headerLogo: {
    width: 31,
    height: 31,
    marginRight: 7,
  },

  headerText: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.4,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 6,
    gap: 2,
  },

  headerIconButton: {
    width: 39,
    height: 39,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  notificationDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#FF4D67",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.42)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 75,
    paddingHorizontal: 12,
  },

  notificationModal: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 18,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.16,
    shadowRadius: 12,
  },

  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  notificationHeadingGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  notificationHeadingIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  notificationTitle: {
    fontSize: 17,
    fontWeight: "800",
  },

  notificationSubtitle: {
    fontSize: 11,
    marginTop: 3,
  },

  notificationDivider: {
    height: StyleSheet.hairlineWidth,
    marginTop: 16,
  },

  emptyNotification: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 28,
    paddingBottom: 25,
  },

  emptyNotificationIcon: {
    width: 74,
    height: 74,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  emptyNotificationTitle: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },

  emptyNotificationText: {
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 8,
  },

  notificationDoneButton: {
    minHeight: 44,
    borderRadius: 13,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },

  notificationDoneText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});