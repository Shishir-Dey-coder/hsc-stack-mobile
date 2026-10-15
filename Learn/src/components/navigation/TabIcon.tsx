import { Ionicons } from "@expo/vector-icons";

type TabIconProps = {
  focused: boolean;
  color: string;
  focusedIcon: React.ComponentProps<typeof Ionicons>["name"];
  unfocusedIcon: React.ComponentProps<typeof Ionicons>["name"];
  size?: number;
};

export default function TabIcon({
  focused,
  color,
  focusedIcon,
  unfocusedIcon,
  size = 23,
}: TabIconProps) {
  return (
    <Ionicons
      name={focused ? focusedIcon : unfocusedIcon}
      size={size}
      color={color}
    />
  );
}