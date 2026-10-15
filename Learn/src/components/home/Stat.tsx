import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import type { IconName } from "@/types/home";

type Props = {
  icon: IconName;
  value: string;
  color: string;
};

export default function Stat({ icon, value, color }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={14} color={color} />

      <Text style={[styles.text, { color }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  text: {
    fontSize: 9,
    lineHeight: 14,
  },
});