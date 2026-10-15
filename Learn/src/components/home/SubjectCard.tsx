import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/theme/ThemeProvider";
import type { Subject } from "@/types/home";

type Props = {
  subject: Subject;
  onPress: (subject: Subject) => void;
};

export default function SubjectCard({
  subject,
  onPress,
}: Props) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={() => onPress(subject)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.82 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${subject.title}, ${subject.chapters} chapters`}
    >
      <View
        style={[
          styles.iconBox,
          { backgroundColor: colors.softPrimary },
        ]}
      >
        <Ionicons
          name={subject.icon}
          size={22}
          color={colors.primary}
        />
      </View>

      <View style={styles.info}>
        <Text
          style={[
            styles.title,
            { color: colors.text },
          ]}
        >
          {subject.title}
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: colors.textMuted },
          ]}
        >
          {subject.chapters} Chapters
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={19}
        color={colors.textMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 76,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  info: {
    flex: 1,
    minWidth: 0,
  },

  title: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
  },

  subtitle: {
    fontSize: 11,
    marginTop: 4,
  },
});