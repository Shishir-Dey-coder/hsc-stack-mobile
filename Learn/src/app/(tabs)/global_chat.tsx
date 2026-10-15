import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";

import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  background: "#0D1117",
  surface: "#161B22",
  bubble: "#1E242C",
  border: "#30363D",
  text: "#F0F6FC",
  muted: "#8B949E",
  purple: "#8B5CF6",
  purpleLight: "#C4B5FD",
  blue: "#58A6FF",
  green: "#3FB950",
  official: "#7453D8",
};

type Reaction = {
  emoji: string;
  count: number;
  selected?: boolean;
};

type ReplyPreview = {
  id: string;
  senderName: string;
  text: string;
};

type ChatMessage = {
  id: string;
  senderName: string;
  username: string;
  avatar: string;
  isVerified: boolean;
  isOfficial: boolean;
  text: string;
  timestamp: number;
  reactions: Reaction[];
  replyTo?: ReplyPreview;
};

const EMOJIS = [
  "😀", "😃", "😄", "😁", "😆", "😅",
  "😂", "🤣", "😊", "😇", "🙂", "🙃",
  "😉", "😍", "🥰", "😘", "😎", "🤩",
  "🤔", "🤗", "🥳", "😭", "😢", "😴",
  "🙏", "👏", "🙌", "👍", "👎", "❤️",
  "💜", "🔥", "✨", "💯", "🎉", "💪",
  "📚", "📝", "💡", "🚀", "✅", "⭐",
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    senderName: "Maimuna Tasnim",
    username: "maimunatasnim",
    avatar: "M",
    isVerified: false,
    isOfficial: false,
    text: "Apnader ki kono mobile app ache?",
    timestamp: new Date().setHours(0, 38, 0, 0),
    reactions: [],
  },
  {
    id: "2",
    senderName: "HSCStack Official",
    username: "hscstack",
    avatar: "H",
    isVerified: true,
    isOfficial: true,
    text: "Play Store e nai. But mobile app install korar option ase.",
    timestamp: new Date().setHours(0, 49, 0, 0),
    reactions: [
      { emoji: "👍", count: 2 },
      { emoji: "❤️", count: 1 },
    ],
  },
  {
    id: "3",
    senderName: "Arif Hasan",
    username: "arifhasan",
    avatar: "A",
    isVerified: false,
    isOfficial: false,
    text: "Browser theke install korle app er moto use kora jabe?",
    timestamp: new Date().setHours(0, 53, 0, 0),
    reactions: [{ emoji: "👍", count: 1 }],
  },
  {
    id: "4",
    senderName: "HSCStack Official",
    username: "hscstack",
    avatar: "H",
    isVerified: true,
    isOfficial: true,
    text: "Hae, supported browser e Add to Home Screen option use korte paro.",
    timestamp: new Date().setHours(1, 2, 0, 0),
    reactions: [{ emoji: "👍", count: 3 }],
  },
];

function getDateLabel(timestamp: number): string {
  const messageDate = new Date(timestamp);
  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(messageDate, today)) return "Today";

  if (sameDay(messageDate, yesterday)) return "Yesterday";

  return messageDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function renderMessageText(text: string) {
  const parts = text.split(/(@[a-zA-Z0-9_.]+)/g);

  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      return (
        <Text
          key={`${part}-${index}`}
          style={styles.mention}
        >
          {part}
        </Text>
      );
    }

    return (
      <Text key={`text-${index}`}>
        {part}
      </Text>
    );
  });
}

export default function GlobalChatScreen() {
  const [messages, setMessages] =
    useState<ChatMessage[]>(INITIAL_MESSAGES);

  const [messageText, setMessageText] = useState("");

  const [replyTo, setReplyTo] =
    useState<ReplyPreview | null>(null);

  const [emojiPickerVisible, setEmojiPickerVisible] =
    useState(false);

  const [reactionPickerFor, setReactionPickerFor] =
    useState<string | null>(null);

  const listRef = useRef<FlatList<ChatMessage>>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      listRef.current?.scrollToEnd({
        animated: false,
      });
    }, 250);

    return () => clearTimeout(timeout);
  }, []);

  // Send message, including optional reply reference.
  const sendMessage = () => {
    const text = messageText.trim();

    if (!text) return;

    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      senderName: "Shishir Ronjon Dey",
      username: "sronjon",
      avatar: "S",
      isVerified: false,
      isOfficial: false,
      text,
      timestamp: Date.now(),
      reactions: [],
      replyTo: replyTo
        ? {
            id: replyTo.id,
            senderName: replyTo.senderName,
            text: replyTo.text,
          }
        : undefined,
    };

    setMessages((previous) => [
      ...previous,
      newMessage,
    ]);

    setMessageText("");
    setReplyTo(null);
    setEmojiPickerVisible(false);

    Keyboard.dismiss();

    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({
        animated: true,
      });
    });
  };

  // Start replying to a selected message.
  const startReply = (message: ChatMessage) => {
    setReplyTo({
      id: message.id,
      senderName: message.senderName,
      text: message.text,
    });

    setEmojiPickerVisible(false);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  // Add selected emoji to the input.
  const insertEmoji = (emoji: string) => {
    setMessageText((previous) => previous + emoji);
  };

  // Toggle a reaction.
  const toggleReaction = (
    messageId: string,
    emoji: string
  ) => {
    setMessages((previous) =>
      previous.map((message) => {
        if (message.id !== messageId) {
          return message;
        }

        const existing = message.reactions.find(
          (reaction) => reaction.emoji === emoji
        );

        if (!existing) {
          return {
            ...message,
            reactions: [
              ...message.reactions,
              {
                emoji,
                count: 1,
                selected: true,
              },
            ],
          };
        }

        const updatedReactions = message.reactions
          .map((reaction) => {
            if (reaction.emoji !== emoji) {
              return reaction;
            }

            if (reaction.selected) {
              return {
                ...reaction,
                count: Math.max(0, reaction.count - 1),
                selected: false,
              };
            }

            return {
              ...reaction,
              count: reaction.count + 1,
              selected: true,
            };
          })
          .filter((reaction) => reaction.count > 0);

        return {
          ...message,
          reactions: updatedReactions,
        };
      })
    );
  };

  // Open full emoji picker for reactions.
  const showReactionOptions = (message: ChatMessage) => {
    setReactionPickerFor(message.id);
  };

  // Long-press message menu.
  const showMessageOptions = (message: ChatMessage) => {
    Alert.alert(
      message.senderName,
      "Choose an action",
      [
        {
          text: "↩ Reply",
          onPress: () => startReply(message),
        },
        {
          text: "😊 React",
          onPress: () => showReactionOptions(message),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const renderDateSeparator = (label: string) => (
    <View style={styles.dateSeparator}>
      <View style={styles.dateLine} />

      <View style={styles.datePill}>
        <Text style={styles.dateText}>
          {label}
        </Text>
      </View>

      <View style={styles.dateLine} />
    </View>
  );

  const renderReplyQuote = (
    message: ChatMessage
  ) => {
    if (!message.replyTo) return null;

    return (
      <View style={styles.replyQuote}>
        <View style={styles.replyQuoteAccent} />

        <View style={styles.replyQuoteContent}>
          <Text
            style={styles.replyQuoteName}
            numberOfLines={1}
          >
            {message.replyTo.senderName}
          </Text>

          <Text
            style={styles.replyQuoteText}
            numberOfLines={2}
          >
            {message.replyTo.text}
          </Text>
        </View>
      </View>
    );
  };

  const renderMessage = ({
    item,
    index,
  }: {
    item: ChatMessage;
    index: number;
  }) => {
    const previousMessage = messages[index - 1];

    const showDateSeparator =
      !previousMessage ||
      getDateLabel(previousMessage.timestamp) !==
        getDateLabel(item.timestamp);

    return (
      <View>
        {showDateSeparator &&
          renderDateSeparator(
            getDateLabel(item.timestamp)
          )}

        <View style={styles.messageRow}>
          <View
            style={[
              styles.avatar,
              item.isOfficial && styles.officialAvatar,
            ]}
          >
            {item.isOfficial ? (
              <Ionicons
                name="school"
                size={20}
                color="#FFFFFF"
              />
            ) : (
              <Text style={styles.avatarText}>
                {item.avatar}
              </Text>
            )}
          </View>

          <View style={styles.messageContent}>
            <View style={styles.messageHeader}>
              <View style={styles.senderNameRow}>
                <Text
                  style={[
                    styles.senderName,
                    item.isOfficial && styles.officialName,
                  ]}
                  numberOfLines={1}
                >
                  {item.senderName}
                </Text>

                {item.isVerified && (
                  <Ionicons
                    name="checkmark-circle"
                    size={15}
                    color={COLORS.blue}
                  />
                )}
              </View>

              <Text style={styles.timestamp}>
                {formatTime(item.timestamp)}
              </Text>
            </View>

            {item.isOfficial && (
              <View style={styles.officialTag}>
                <Ionicons
                  name="shield-checkmark"
                  size={10}
                  color={COLORS.purpleLight}
                />

                <Text style={styles.officialTagText}>
                  OFFICIAL
                </Text>
              </View>
            )}

            <Pressable
              onLongPress={() =>
                showMessageOptions(item)
              }
              delayLongPress={300}
              style={[
                styles.messageBubble,
                item.isOfficial && styles.officialBubble,
              ]}
            >
              {renderReplyQuote(item)}

              <Text style={styles.messageText}>
                {renderMessageText(item.text)}
              </Text>
            </Pressable>

            <View style={styles.reactionsRow}>
              {item.reactions.map((reaction) => (
                <Pressable
                  key={reaction.emoji}
                  onPress={() =>
                    toggleReaction(
                      item.id,
                      reaction.emoji
                    )
                  }
                  style={[
                    styles.reactionPill,
                    reaction.selected &&
                      styles.reactionPillSelected,
                  ]}
                >
                  <Text style={styles.reactionEmoji}>
                    {reaction.emoji}
                  </Text>

                  <Text style={styles.reactionCount}>
                    {reaction.count}
                  </Text>
                </Pressable>
              ))}

              <Pressable
                onPress={() =>
                  showReactionOptions(item)
                }
                style={styles.addReactionButton}
              >
                <Ionicons
                  name="add"
                  size={14}
                  color={COLORS.muted}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["left", "right"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
        translucent={false}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === "ios" ? "padding" : undefined
        }
        keyboardVerticalOffset={0}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.groupAvatar}>
              <Ionicons
                name="people"
                size={22}
                color={COLORS.purpleLight}
              />
            </View>

            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>
                HSC Stack Community
              </Text>

              <View style={styles.onlineRow}>
                <View style={styles.onlineIndicator} />

                <Text style={styles.headerSubtitle}>
                  Group discussion
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            style={styles.headerIcon}
            onPress={() =>
              Alert.alert(
                "Group information",
                "HSC Stack Community"
              )
            }
          >
            <Ionicons
              name="information-circle-outline"
              size={23}
              color={COLORS.text}
            />
          </Pressable>
        </View>

        {/* MESSAGES */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          style={styles.chatList}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({
              animated: true,
            })
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons
                name="chatbubbles-outline"
                size={42}
                color={COLORS.muted}
              />

              <Text style={styles.emptyTitle}>
                No messages yet
              </Text>

              <Text style={styles.emptySubtitle}>
                Start the conversation!
              </Text>
            </View>
          }
        />

        {/* INPUT AREA */}
        <View style={styles.inputArea}>
          {/* REPLY PREVIEW */}
          {replyTo && (
            <View style={styles.replyPreview}>
              <View style={styles.replyPreviewAccent} />

              <View style={styles.replyPreviewContent}>
                <View style={styles.replyPreviewTitleRow}>
                  <Ionicons
                    name="return-down-forward"
                    size={14}
                    color={COLORS.purpleLight}
                  />

                  <Text
                    style={styles.replyPreviewName}
                    numberOfLines={1}
                  >
                    Replying to {replyTo.senderName}
                  </Text>
                </View>

                <Text
                  style={styles.replyPreviewText}
                  numberOfLines={2}
                >
                  {replyTo.text}
                </Text>
              </View>

              <Pressable
                onPress={() => setReplyTo(null)}
                style={styles.closeReplyButton}
                hitSlop={8}
                accessibilityLabel="Cancel reply"
              >
                <Ionicons
                  name="close"
                  size={19}
                  color={COLORS.muted}
                />
              </Pressable>
            </View>
          )}

          {/* EMOJI PICKER FOR INPUT */}
          {emojiPickerVisible && (
            <View style={styles.emojiPanel}>
              <View style={styles.emojiPanelHeader}>
                <View>
                  <Text style={styles.emojiPanelTitle}>
                    Choose an emoji
                  </Text>

                  <Text style={styles.emojiPanelSubtitle}>
                    Express yourself
                  </Text>
                </View>

                <Pressable
                  onPress={() =>
                    setEmojiPickerVisible(false)
                  }
                  style={styles.emojiCloseButton}
                  hitSlop={8}
                >
                  <Ionicons
                    name="close"
                    size={19}
                    color={COLORS.muted}
                  />
                </Pressable>
              </View>

              <View style={styles.emojiGrid}>
                {EMOJIS.map((emoji, index) => (
                  <Pressable
                    key={`${emoji}-${index}`}
                    onPress={() => insertEmoji(emoji)}
                    style={({ pressed }) => [
                      styles.emojiCell,
                      pressed && styles.emojiCellPressed,
                    ]}
                  >
                    <Text style={styles.emojiText}>
                      {emoji}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* INPUT BAR */}
          <View style={styles.inputContainer}>
            <Pressable
              style={[
                styles.emojiToggle,
                emojiPickerVisible &&
                  styles.emojiToggleActive,
              ]}
              onPress={() => {
                Keyboard.dismiss();
                setEmojiPickerVisible(
                  (previous) => !previous
                );
              }}
              accessibilityLabel="Open emoji picker"
            >
              <Ionicons
                name={
                  emojiPickerVisible
                    ? "keypad-outline"
                    : "happy-outline"
                }
                size={23}
                color={
                  emojiPickerVisible
                    ? COLORS.purpleLight
                    : COLORS.muted
                }
              />
            </Pressable>

            <TextInput
              ref={inputRef}
              style={styles.messageInput}
              value={messageText}
              onChangeText={setMessageText}
              onFocus={() =>
                setEmojiPickerVisible(false)
              }
              placeholder="Send a message..."
              placeholderTextColor={COLORS.muted}
              multiline
              maxLength={2000}
              textAlignVertical="center"
              blurOnSubmit={false}
              returnKeyType="default"
            />

            <Pressable
              onPress={sendMessage}
              disabled={!messageText.trim()}
              style={[
                styles.sendButton,
                !messageText.trim() &&
                  styles.sendButtonDisabled,
              ]}
              accessibilityLabel="Send message"
            >
              <Ionicons
                name="send"
                size={18}
                color="#FFFFFF"
              />
            </Pressable>
          </View>

          <Text style={styles.inputHint}>
            Be kind. Help your fellow learners.
          </Text>
        </View>

        {/* REACTION EMOJI PICKER OVERLAY */}
        {reactionPickerFor && (
          <Pressable
            style={styles.reactionOverlay}
            onPress={() => setReactionPickerFor(null)}
          >
            <Pressable
              style={styles.reactionPickerPanel}
              onPress={(event) => event.stopPropagation()}
            >
              <View style={styles.reactionPickerHeader}>
                <View>
                  <Text style={styles.reactionPickerTitle}>
                    React with emoji
                  </Text>

                  <Text style={styles.reactionPickerSubtitle}>
                    Pick any emoji
                  </Text>
                </View>

                <Pressable
                  onPress={() => setReactionPickerFor(null)}
                  hitSlop={8}
                  style={styles.reactionPickerClose}
                >
                  <Ionicons
                    name="close"
                    size={19}
                    color={COLORS.muted}
                  />
                </Pressable>
              </View>

              <View style={styles.reactionPickerGrid}>
                {EMOJIS.map((emoji, index) => (
                  <Pressable
                    key={`react-${emoji}-${index}`}
                    onPress={() => {
                      toggleReaction(reactionPickerFor, emoji);
                      setReactionPickerFor(null);
                    }}
                    style={({ pressed }) => [
                      styles.reactionPickerCell,
                      pressed && styles.reactionPickerCellPressed,
                    ]}
                  >
                    <Text style={styles.reactionPickerEmoji}>
                      {emoji}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Pressable>
          </Pressable>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // HEADER
  header: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  groupAvatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#29213F",
    borderWidth: 1,
    borderColor: "#493878",
    alignItems: "center",
    justifyContent: "center",
  },

  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },

  headerTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
  },

  onlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },

  headerSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
  },

  onlineIndicator: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.green,
  },

  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  // CHAT LIST
  chatList: {
    flex: 1,
  },

  chatContent: {
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 20,
    flexGrow: 1,
  },

  // DATE SEPARATOR
  dateSeparator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 18,
    gap: 10,
  },

  dateLine: {
    height: 1,
    backgroundColor: COLORS.border,
    flex: 1,
  },

  datePill: {
    backgroundColor: "#202631",
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 20,
  },

  dateText: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "700",
  },

  // MESSAGE
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  avatar: {
    width: 39,
    height: 39,
    borderRadius: 14,
    backgroundColor: "#263448",
    borderWidth: 1,
    borderColor: "#35455A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 2,
  },

  officialAvatar: {
    backgroundColor: COLORS.official,
    borderColor: "#A78BFA",
  },

  avatarText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
  },

  messageContent: {
    flex: 1,
    minWidth: 0,
  },

  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 5,
    marginBottom: 7,
  },

  senderNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexShrink: 1,
  },

  senderName: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "800",
    flexShrink: 1,
  },

  officialName: {
    color: COLORS.purpleLight,
  },

  timestamp: {
    color: COLORS.muted,
    fontSize: 9,
  },

  officialTag: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#29213F",
    borderWidth: 1,
    borderColor: "#493878",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },

  officialTagText: {
    color: COLORS.purpleLight,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  messageBubble: {
    alignSelf: "flex-start",
    maxWidth: "100%",
    backgroundColor: COLORS.bubble,
    borderWidth: 1,
    borderColor: "#2A323D",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },

  officialBubble: {
    backgroundColor: "#211D32",
    borderColor: "#41365F",
  },

  messageText: {
    color: "#E6EDF3",
    fontSize: 13,
    lineHeight: 20,
  },

  mention: {
    color: COLORS.blue,
    fontWeight: "700",
  },

  // REPLY QUOTE INSIDE MESSAGE
  replyQuote: {
    flexDirection: "row",
    overflow: "hidden",
    backgroundColor: "rgba(139, 92, 246, 0.10)",
    borderRadius: 8,
    marginBottom: 9,
    minWidth: 180,
  },

  replyQuoteAccent: {
    width: 3,
    backgroundColor: COLORS.purpleLight,
  },

  replyQuoteContent: {
    flex: 1,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },

  replyQuoteName: {
    color: COLORS.purpleLight,
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 4,
  },

  replyQuoteText: {
    color: "#C3CBD5",
    fontSize: 11,
    lineHeight: 16,
  },

  // REACTIONS
  reactionsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 7,
    marginLeft: 3,
  },

  reactionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#252D38",
    borderWidth: 1,
    borderColor: "#394452",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 15,
  },

  reactionPillSelected: {
    borderColor: COLORS.purple,
    backgroundColor: "#30254C",
  },

  reactionEmoji: {
    fontSize: 12,
  },

  reactionCount: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: "700",
  },

  addReactionButton: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  // INPUT AREA
  inputArea: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: Platform.OS === "android" ? 8 : 10,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 7,
    backgroundColor: "#202631",
    borderWidth: 1,
    borderColor: "#343E4B",
    borderRadius: 24,
    paddingLeft: 8,
    paddingRight: 6,
    paddingVertical: 5,
  },

  emojiToggle: {
    width: 39,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  emojiToggleActive: {
    backgroundColor: "#30254C",
  },

  messageInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 110,
    paddingTop: 10,
    paddingBottom: 10,
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 19,
  },

  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
  },

  sendButtonDisabled: {
    backgroundColor: "#49405E",
  },

  inputHint: {
    color: COLORS.muted,
    fontSize: 9,
    textAlign: "center",
    marginTop: 7,
    marginBottom: 2,
  },

  // REPLY PREVIEW ABOVE INPUT
  replyPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#211D32",
    borderWidth: 1,
    borderColor: "#41365F",
    borderRadius: 13,
    marginBottom: 9,
    overflow: "hidden",
    minHeight: 66,
  },

  replyPreviewAccent: {
    width: 4,
    alignSelf: "stretch",
    backgroundColor: COLORS.purple,
  },

  replyPreviewContent: {
    flex: 1,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },

  replyPreviewTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 5,
  },

  replyPreviewName: {
    color: COLORS.purpleLight,
    fontSize: 11,
    fontWeight: "800",
    flex: 1,
  },

  replyPreviewText: {
    color: "#C3CBD5",
    fontSize: 11,
    lineHeight: 16,
  },

  closeReplyButton: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: "#2B263B",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 9,
  },

  // EMOJI PICKER PANEL (FOR INPUT)
  emojiPanel: {
    backgroundColor: "#171D27",
    borderWidth: 1,
    borderColor: "#343E4B",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingTop: 13,
    paddingBottom: 12,
    marginBottom: 10,
  },

  emojiPanelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  emojiPanelTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "800",
  },

  emojiPanelSubtitle: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 3,
  },

  emojiCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: "#252D38",
    alignItems: "center",
    justifyContent: "center",
  },

  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  emojiCell: {
    width: "12.5%",
    height: 39,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginBottom: 3,
  },

  emojiCellPressed: {
    backgroundColor: "#30254C",
  },

  emojiText: {
    fontSize: 23,
  },

  // REACTION EMOJI PICKER OVERLAY
  reactionOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  reactionPickerPanel: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#171D27",
    borderWidth: 1,
    borderColor: "#343E4B",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
  },

  reactionPickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  reactionPickerTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "800",
  },

  reactionPickerSubtitle: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 3,
  },

  reactionPickerClose: {
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: "#252D38",
    alignItems: "center",
    justifyContent: "center",
  },

  reactionPickerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  reactionPickerCell: {
    width: "12.5%",
    height: 41,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginBottom: 3,
  },

  reactionPickerCellPressed: {
    backgroundColor: "#30254C",
  },

  reactionPickerEmoji: {
    fontSize: 24,
  },

  // EMPTY STATE
  emptyState: {
    flex: 1,
    minHeight: 250,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 15,
  },

  emptySubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 6,
  },
});