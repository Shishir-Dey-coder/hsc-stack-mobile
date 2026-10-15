import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/theme/ThemeProvider";

export default function HomeHero() {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.eyebrow,
          { backgroundColor: colors.softPrimary },
        ]}
      >
        <Ionicons
          name="sparkles-outline"
          size={14}
          color={colors.primary}
        />

        <Text
          style={[
            styles.eyebrowText,
            { color: colors.primary },
          ]}
        >
          YOUR LEARNING COMMUNITY
        </Text>
      </View>

      <Text
        style={[styles.title, { color: colors.text }]}
      >
        {"Everything You Need,\n"}
        <Text style={{ color: colors.primary }}>
          Together with Peers
        </Text>
      </Text>

      <Text
        style={[
          styles.description,
          { color: colors.textMuted },
        ]}
      >
        পড়াশোনা, resources আর discussion—সবকিছু এক
        জায়গায়, তোমার HSC journey-র জন্য।
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 22,
  },

  eyebrow: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 14,
  },

  eyebrowText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  title: {
    fontSize: 29,
    lineHeight: 36,
    fontWeight: "900",
    letterSpacing: -0.8,
  },

  description: {
    fontSize: 13,
    lineHeight: 21,
    marginTop: 10,
  },
});