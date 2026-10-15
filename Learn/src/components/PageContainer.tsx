import type { ReactNode } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useAppTheme } from "@/theme/ThemeProvider";

type PageContainerProps = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  children?: ReactNode;
};

export default function PageContainer({
  title,
  subtitle,
  icon,
  children,
}: PageContainerProps) {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: colors.background },
      ]}
      edges={["bottom"]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.hero,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.iconBox,
              { backgroundColor: colors.softPrimary },
            ]}
          >
            <Ionicons
              name={icon}
              size={30}
              color={colors.primary}
            />
          </View>

          <Text
            style={[
              styles.title,
              { color: colors.text },
            ]}
          >
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

        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  hero: {
    borderRadius: 22,
    padding: 22,
    marginBottom: 20,
    borderWidth: 1,
  },

  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
  },
});