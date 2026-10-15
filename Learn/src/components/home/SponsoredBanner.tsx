import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAppTheme } from "@/theme/ThemeProvider";

export default function SponsoredBanner() {
  const { colors, isDark } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? "#29213F" : "#F0ECFF",
          borderColor: isDark ? "#45366B" : "#E2DAFF",
        },
      ]}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: isDark ? "#45366B" : "#DED5FF",
            },
          ]}
        >
          <Ionicons
            name="megaphone-outline"
            size={12}
            color={colors.primary}
          />

          <Text
            style={[
              styles.badgeText,
              { color: colors.primary },
            ]}
          >
            SPONSORED
          </Text>
        </View>

        <Ionicons
          name="open-outline"
          size={17}
          color={colors.primary}
        />
      </View>

      <Text
        style={[
          styles.title,
          { color: colors.text },
        ]}
      >
        Your Ad Goes Here
      </Text>

      <Text
        style={[
          styles.description,
          { color: colors.textMuted },
        ]}
      >
        Reach students and promote your education-focused
        service on HSCStack.
      </Text>

      <Pressable
        onPress={() =>
          Alert.alert(
            "Book Ad Space",
            "Advertising enquiries can be connected to your contact page or website."
          )
        }
        style={[
          styles.button,
          { backgroundColor: colors.primary },
        ]}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>
          Book Ad Space
        </Text>

        <Ionicons
          name="arrow-forward"
          size={16}
          color="#FFFFFF"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 17,
    marginBottom: 30,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  badgeText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 15,
  },

  description: {
    fontSize: 12,
    lineHeight: 19,
    marginTop: 6,
  },

  button: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 11,
    marginTop: 15,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
});