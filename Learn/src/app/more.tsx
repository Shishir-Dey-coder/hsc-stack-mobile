import { View, Text } from "react-native";
import { useAppTheme } from "@/theme/ThemeProvider";

export default function MoreScreen() {
  const { colors } = useAppTheme();

  return (
    <View
      className="flex-1 items-center justify-center p-6"
      style={{ backgroundColor: colors.background }}
    >
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: "700" }}>
        More
      </Text>
    </View>
  );
}