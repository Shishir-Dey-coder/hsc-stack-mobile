import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/theme/ThemeProvider";

export default function HomeHeader() {
  const { colors } = useAppTheme();

  return (
    <View style={styles.header}>
      <View style={styles.brand}>
        <View
          style={[
            styles.brandIcon,
            { backgroundColor: colors.primary },
          ]}
        >
          <Ionicons
            name="school-outline"
            size={21}
            color="#FFFFFF"
          />
        </View>

        <View style={styles.brandTextWrap}>
          <Text
            style={[
              styles.brandTitle,
              { color: colors.text },
            ]}
          >
            HSCStack
          </Text>

          <Text
            style={[
              styles.brandSubtitle,
              { color: colors.textMuted },
            ]}
          >
            Learn together
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    gap: 10,
  },

  brand: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  brandIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  brandTextWrap: {
    flexShrink: 1,
  },

  brandTitle: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  brandSubtitle: {
    fontSize: 10,
    marginTop: 2,
  },
});