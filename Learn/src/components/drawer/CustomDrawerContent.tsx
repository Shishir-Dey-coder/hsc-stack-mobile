import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { DrawerContentComponentProps } from "@react-navigation/drawer";

import { useAppTheme } from "@/theme/ThemeProvider";

const PURPLE = "#6C4DFF";
const RED = "#E5484D";

type MenuIcon = keyof typeof Ionicons.glyphMap;

export default function CustomDrawerContent(
  props: DrawerContentComponentProps
) {
  const insets = useSafeAreaInsets();

  const { themeMode, setThemeMode, colors, isDark } =
    useAppTheme();

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
    icon: MenuIcon,
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
        style={[styles.menuLabel, { color: colors.text }]}
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

  const goToProfile = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout unavailable",
      "Authentication sign-out has not been connected yet."
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface },
      ]}
    >
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
        {/* BRAND */}

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
            onPress={() => props.navigation.closeDrawer()}
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

        {/* TOOLS */}

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
          () => navigate("/support")
        )}

        {renderMenuItem(
          "heart-outline",
          "Donate",
          () => navigate("/donate"),
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
          () => navigate("/more")
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
            const active = themeMode === value;

            return (
              <Pressable
                key={value}
                onPress={() => setThemeMode(value)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[
                  styles.themeOption,
                  active && {
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
                    active
                      ? colors.primary
                      : colors.textMuted
                  }
                />

                <Text
                  style={[
                    styles.themeText,
                    {
                      color: active
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
            onPress={() => showComingSoon("Privacy Policy")}
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
            onPress={() => showComingSoon("Terms of Service")}
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
            onPress={() => showComingSoon("Content Policy")}
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

      {/* ACCOUNT FOOTER */}

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
          onPress={goToProfile}
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
              Account
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
          onPress={handleLogout}
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

const styles = StyleSheet.create({
  container: {
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
});