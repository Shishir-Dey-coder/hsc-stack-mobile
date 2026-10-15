import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAppTheme } from "@/theme/ThemeProvider";

import type { Discussion, Vote } from "@/types/home";

type Props = {
  post: Discussion;
  vote?: Vote;
  onVote: (postId: string, vote?: Vote) => void;
};

export default function DiscussionCard({
  post,
  vote,
  onVote,
}: Props) {
  const { colors, isDark } = useAppTheme();

  const score =
    post.score +
    (vote === "up" ? 1 : vote === "down" ? -1 : 0);

  const answered = post.status === "Answered";

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.voteColumn}>
        <Pressable
          onPress={() =>
            onVote(post.id, vote === "up" ? undefined : "up")
          }
          accessibilityRole="button"
          accessibilityLabel="Upvote discussion"
          accessibilityState={{ selected: vote === "up" }}
          hitSlop={8}
        >
          <Ionicons
            name={
              vote === "up"
                ? "arrow-up-circle"
                : "arrow-up-circle-outline"
            }
            size={25}
            color={vote === "up" ? colors.primary : colors.textMuted}
          />
        </Pressable>

        <Text
          style={[
            styles.score,
            { color: colors.text },
          ]}
        >
          {score}
        </Text>

        <Pressable
          onPress={() =>
            onVote(
              post.id,
              vote === "down" ? undefined : "down"
            )
          }
          accessibilityRole="button"
          accessibilityLabel="Downvote discussion"
          accessibilityState={{ selected: vote === "down" }}
          hitSlop={8}
        >
          <Ionicons
            name={
              vote === "down"
                ? "arrow-down-circle"
                : "arrow-down-circle-outline"
            }
            size={25}
            color={
              vote === "down" ? colors.primary : colors.textMuted
            }
          />
        </Pressable>
      </View>

      <View style={styles.body}>
        <View style={styles.tags}>
          <Text
            style={[
              styles.tag,
              {
                color: colors.primary,
                backgroundColor: colors.softPrimary,
              },
            ]}
          >
            {post.category}
          </Text>

          <Text
            style={[
              styles.tag,
              {
                color: answered ? "#16845B" : colors.textMuted,
                backgroundColor: answered
                  ? isDark
                    ? "#173A30"
                    : "#E5F7EF"
                  : colors.background,
              },
            ]}
          >
            {post.status}
          </Text>
        </View>

        <Text
          style={[
            styles.title,
            { color: colors.text },
          ]}
        >
          {post.title}
        </Text>

        <Text
          style={[
            styles.preview,
            { color: colors.textMuted },
          ]}
          numberOfLines={2}
        >
          {post.preview}
        </Text>

        <View style={styles.footer}>
          <View style={styles.author}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: colors.softPrimary },
              ]}
            >
              <Ionicons
                name="person"
                size={12}
                color={colors.primary}
              />
            </View>

            <Text
              style={[
                styles.meta,
                { color: colors.textMuted },
              ]}
              numberOfLines={1}
            >
              {post.author} · {post.time}
            </Text>
          </View>

          <View style={styles.answerCount}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={14}
              color={colors.textMuted}
            />

            <Text
              style={[
                styles.meta,
                { color: colors.textMuted },
              ]}
            >
              {post.answers} answers
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 17,
    padding: 13,
    flexDirection: "row",
    gap: 11,
    marginBottom: 11,
  },

  voteColumn: {
    alignItems: "center",
    gap: 3,
    paddingTop: 2,
  },

  score: {
    fontSize: 12,
    fontWeight: "800",
  },

  body: {
    flex: 1,
    minWidth: 0,
  },

  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 9,
  },

  tag: {
    overflow: "hidden",
    fontSize: 9,
    fontWeight: "800",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },

  title: {
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 19,
  },

  preview: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },

  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 12,
  },

  author: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexShrink: 1,
  },

  avatar: {
    width: 22,
    height: 22,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  meta: {
    fontSize: 9,
    lineHeight: 14,
  },

  answerCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});