import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/theme/ThemeProvider";
import type { Repository } from "@/types/home";
import { repositories } from "@/data/homeData";

type Props = {
  value: Repository;
  onChange: (repository: Repository) => void;
};

export default function RepositorySelector({
  value,
  onChange,
}: Props) {
  const { colors } = useAppTheme();

  const [menuOpen, setMenuOpen] = React.useState(false);

  const subtitle =
    value === "HSC"
      ? "আপনি HSC এর কন্টেন্টগুলো দেখছেন"
      : value === "SSC"
        ? "আপনি SSC এর কন্টেন্টগুলো দেখছেন"
        : "আপনি Admission প্রস্তুতির কন্টেন্ট দেখছেন";

  return (
    <View style={styles.wrapper}>
      <Text
        style={[
          styles.label,
          { color: colors.textMuted },
        ]}
      >
        ACTIVE REPOSITORY
      </Text>

      <Pressable
        onPress={() => setMenuOpen((open) => !open)}
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Select repository"
        accessibilityState={{ expanded: menuOpen }}
      >
        <View
          style={[
            styles.iconBox,
            { backgroundColor: colors.softPrimary },
          ]}
        >
          <Ionicons
            name="library-outline"
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
            {value}
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

        <Ionicons
          name={menuOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.textMuted}
        />
      </Pressable>

      {menuOpen && (
        <View
          style={[
            styles.menu,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {repositories.map((item) => {
            const selected = item === value;

            return (
              <Pressable
                key={item}
                onPress={() => {
                  onChange(item);
                  setMenuOpen(false);
                }}
                style={[
                  styles.option,
                  selected && {
                    backgroundColor: colors.softPrimary,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: selected
                        ? colors.primary
                        : colors.text,
                    },
                  ]}
                >
                  {item}
                </Text>

                {selected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={colors.primary}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

import React from "react";

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 22,
    marginBottom: 28,
    zIndex: 2,
  },

  label: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.9,
    marginBottom: 9,
  },

  card: {
    minHeight: 78,
    borderRadius: 18,
    borderWidth: 1,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  info: {
    flex: 1,
    minWidth: 0,
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
  },

  subtitle: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },

  menu: {
    marginTop: 6,
    borderRadius: 15,
    borderWidth: 1,
    overflow: "hidden",
  },

  option: {
    minHeight: 46,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  optionText: {
    fontSize: 13,
    fontWeight: "700",
  },
});