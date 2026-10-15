import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAppTheme } from "@/theme/ThemeProvider";

import Stat from "@/components/home/Stat";

import type { Blog } from "@/types/home";

type Props = {
  blog: Blog;
  onPress: () => void;
};

export default function BlogCard({
  blog,
  onPress,
}: Props) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.84 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Open blog: ${blog.title}`}
    >
      <View
        style={[
          styles.thumbnail,
          { backgroundColor: colors.softPrimary },
        ]}
      >
        <Ionicons
          name={blog.icon}
          size={30}
          color={colors.primary}
        />
      </View>

      <View style={styles.body}>
        <Text
          style={[
            styles.category,
            { color: colors.primary },
          ]}
        >
          {blog.category}
        </Text>

        <Text
          style={[
            styles.title,
            { color: colors.text },
          ]}
          numberOfLines={2}
        >
          {blog.title}
        </Text>

        <Text
          style={[
            styles.meta,
            { color: colors.textMuted },
          ]}
        >
          {blog.author} · {blog.time}
        </Text>

        <View style={styles.stats}>
          <Stat
            icon="heart-outline"
            value={String(blog.likes)}
            color={colors.textMuted}
          />

          <Stat
            icon="chatbubble-outline"
            value={String(blog.comments)}
            color={colors.textMuted}
          />

          <Stat
            icon="eye-outline"
            value={blog.views}
            color={colors.textMuted}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 17,
    padding: 12,
    flexDirection: "row",
    gap: 12,
    marginBottom: 11,
  },

  thumbnail: {
    width: 84,
    minHeight: 104,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  body: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },

  category: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginBottom: 5,
  },

  title: {
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
  },

  meta: {
    fontSize: 9,
    lineHeight: 14,
    marginTop: 5,
  },

  stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginTop: 10,
  },
});