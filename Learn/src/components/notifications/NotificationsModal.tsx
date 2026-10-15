import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/theme/ThemeProvider";

type NotificationsModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function NotificationsModal({
  visible,
  onClose,
}: NotificationsModalProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
      >
        <Pressable
          style={[
            styles.modal,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={styles.header}>
            <View style={styles.headingGroup}>
              <View
                style={[
                  styles.headingIcon,
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
                  color={colors.primary}
                />
              </View>

              <View style={styles.headingText}>
                <Text
                  style={[
                    styles.title,
                    { color: colors.text },
                  ]}
                >
                  Notifications
                </Text>

                <Text
                  style={[
                    styles.subtitle,
                    { color: colors.textMuted },
                  ]}
                >
                  Your latest updates
                </Text>
              </View>
            </View>

            <Pressable
              onPress={onClose}
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
              styles.divider,
              { backgroundColor: colors.border },
            ]}
          />

          <View style={styles.emptyState}>
            <View
              style={[
                styles.emptyIcon,
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
                color={colors.primary}
              />
            </View>

            <Text
              style={[
                styles.emptyTitle,
                { color: colors.text },
              ]}
            >
              You're all caught up!
            </Text>

            <Text
              style={[
                styles.emptyDescription,
                { color: colors.textMuted },
              ]}
            >
              New announcements, forum replies and study
              updates will appear here.
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.doneButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={onClose}
            accessibilityRole="button"
          >
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.42)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 75,
    paddingHorizontal: 12,
  },

  modal: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 18,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headingGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    flex: 1,
  },

  headingIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  headingText: {
    flex: 1,
  },

  title: {
    fontSize: 17,
    fontWeight: "800",
  },

  subtitle: {
    fontSize: 11,
    marginTop: 3,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    marginTop: 16,
  },

  emptyState: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 28,
    paddingBottom: 25,
  },

  emptyIcon: {
    width: 74,
    height: 74,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },

  emptyDescription: {
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 8,
  },

  doneButton: {
    minHeight: 44,
    borderRadius: 13,
    backgroundColor: "#6C4DFF",
    alignItems: "center",
    justifyContent: "center",
  },

  doneText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});