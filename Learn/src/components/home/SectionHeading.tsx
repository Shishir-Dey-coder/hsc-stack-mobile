import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/theme/ThemeProvider";

type Props = {
  title: string;
  subtitle: string;
  action?: string;
  onAction?: () => void;
};

export default function SectionHeading({
  title,
  subtitle,
  action,
  onAction,
}: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: colors.textMuted },
          ]}
        >
          {subtitle}
        </Text>
      </View>

      {action && onAction ? (
        <Pressable
          onPress={onAction}
          style={styles.action}
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.actionText,
              { color: colors.primary },
            ]}
          >
            {action}
          </Text>

          <Ionicons
            name="arrow-forward"
            size={14}
            color={colors.primary}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 15,
    marginTop: 4,
  },

  textContainer: {
    flex: 1,
    minWidth: 0,
  },

  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  subtitle: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
  },

  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  actionText: {
    fontSize: 11,
    fontWeight: "700",
  },
});