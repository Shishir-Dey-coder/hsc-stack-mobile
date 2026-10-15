import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StudyScreen() {
  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right"]}
    >
      <Text style={styles.title}>Study</Text>
      <Text style={styles.subtitle}>
        Continue your HSC preparation.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FC",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#171725",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#777B8A",
  },
});