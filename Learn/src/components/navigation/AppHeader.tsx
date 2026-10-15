import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/theme/ThemeProvider";

type AppHeaderProps = {
  onNotificationsPress: () => void;
  onProfilePress: () => void;
};

export default function AppHeader({
  onNotificationsPress,
  onProfilePress,
}: AppHeaderProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View style={styles.container}>
      {/* Notification Icon */}
      <Pressable
        onPress={onNotificationsPress}
        accessibilityRole="button"
        accessibilityLabel="Open notifications"
        hitSlop={8}
        style={({ pressed }) => [
          styles.iconButton,
          {
            backgroundColor: pressed
              ? isDark
                ? "#303047"
                : "#F0ECFF"
              : "transparent",
          },
        ]}
      >
        <Ionicons
          name="notifications-outline"
          size={23}
          color={colors.text}
        />

        {/* Notification indicator */}
        <View
          style={[
            styles.notificationDot,
            {
              borderColor: colors.surface,
            },
          ]}
        />
      </Pressable>

      {/* Account Icon */}
      <Pressable
        onPress={onProfilePress}
        accessibilityRole="button"
        accessibilityLabel="Open profile"
        hitSlop={8}
        style={({ pressed }) => [
          styles.iconButton,
          {
            backgroundColor: pressed
              ? isDark
                ? "#303047"
                : "#F0ECFF"
              : "transparent",
          },
        ]}
      >
        <Ionicons
          name="person-circle-outline"
          size={28}
          color={colors.text}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 8,
    gap: 2,
  },

  iconButton: {
    width: 42,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  notificationDot: {
    position: "absolute",
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#FF4D67",
    borderWidth: 1,
  },
});