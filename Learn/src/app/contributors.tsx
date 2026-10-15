import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useAppTheme } from "@/theme/ThemeProvider";

type Contributor = {
  id: string;
  name: string;
  role: string;
  affiliation: string;
  initials: string;
  accent: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const CONTRIBUTORS: Contributor[] = [
  {
    id: "1",
    name: "TR Tajim",
    role: "Lead Developer",
    affiliation: "HSCStack Development Team",
    initials: "TT",
    accent: "#8B5CF6",
    icon: "code-slash-outline",
  },
  {
    id: "2",
    name: "NoSpam Bot",
    role: "Community Bot",
    affiliation: "HSCStack Community",
    initials: "NB",
    accent: "#3B82F6",
    icon: "shield-checkmark-outline",
  },
];

export default function ContributorsScreen() {
  const { colors } = useAppTheme();

  const handleViewProfile = (name: string) => {
    Alert.alert(
      name,
      "Contributor profile details will be available soon."
    );
  };

  const handleApply = () => {
    router.push("/join-contributor");
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: colors.background },
      ]}
      edges={["top"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <View style={styles.eyebrow}>
              <View style={styles.eyebrowDot} />
              <Text
                style={[
                  styles.eyebrowText,
                  { color: colors.primary },
                ]}
              >
                THE PEOPLE BEHIND HSCSTACK
              </Text>
            </View>

            <Text
              style={[
                styles.title,
                { color: colors.text },
              ]}
            >
              Meet the{"\n"}
              <Text style={{ color: colors.primary }}>
                Contributors.
              </Text>
            </Text>

            <Text
              style={[
                styles.subtitle,
                { color: colors.textMuted },
              ]}
            >
              The people building a better study experience
              for every student.
            </Text>
          </View>

          <View
            style={[
              styles.headerIcon,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="people-outline"
              size={28}
              color={colors.primary}
            />
          </View>
        </View>

        {/* Stats */}
        <View
          style={[
            styles.statsCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.statItem}>
            <Text
              style={[
                styles.statNumber,
                { color: colors.text },
              ]}
            >
              {CONTRIBUTORS.length}
            </Text>

            <Text
              style={[
                styles.statLabel,
                { color: colors.textMuted },
              ]}
            >
              Contributors
            </Text>
          </View>

          <View
            style={[
              styles.statDivider,
              { backgroundColor: colors.border },
            ]}
          />

          <View style={styles.statItem}>
            <Text
              style={[
                styles.statNumber,
                { color: colors.text },
              ]}
            >
              01
            </Text>

            <Text
              style={[
                styles.statLabel,
                { color: colors.textMuted },
              ]}
            >
              Community
            </Text>
          </View>

          <View
            style={[
              styles.statDivider,
              { backgroundColor: colors.border },
            ]}
          />

          <View style={styles.statItem}>
            <Ionicons
              name="heart"
              size={22}
              color="#F472B6"
            />

            <Text
              style={[
                styles.statLabel,
                { color: colors.textMuted },
              ]}
            >
              Made with care
            </Text>
          </View>
        </View>

        {/* Section heading */}
        <View style={styles.sectionHeader}>
          <View>
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text },
              ]}
            >
              Core Team
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                { color: colors.textMuted },
              ]}
            >
              Meet the people behind the project.
            </Text>
          </View>

          <View
            style={[
              styles.teamBadge,
              { backgroundColor: colors.surface },
            ]}
          >
            <Text
              style={[
                styles.teamBadgeText,
                { color: colors.primary },
              ]}
            >
              OUR TEAM
            </Text>
          </View>
        </View>

        {/* Contributor cards */}
        {CONTRIBUTORS.map((person) => (
          <View
            key={person.id}
            style={[
              styles.personCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            {/* Avatar row */}
            <View style={styles.personTopRow}>
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: `${person.accent}20`,
                    borderColor: `${person.accent}50`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.avatarText,
                    { color: person.accent },
                  ]}
                >
                  {person.initials}
                </Text>

                <View
                  style={[
                    styles.avatarIcon,
                    { backgroundColor: person.accent },
                  ]}
                >
                  <Ionicons
                    name={person.icon}
                    size={12}
                    color="#FFFFFF"
                  />
                </View>
              </View>

              <View style={styles.personInfo}>
                <Text
                  style={[
                    styles.personName,
                    { color: colors.text },
                  ]}
                >
                  {person.name}
                </Text>

                <View
                  style={[
                    styles.roleBadge,
                    { backgroundColor: `${person.accent}18` },
                  ]}
                >
                  <View
                    style={[
                      styles.roleDot,
                      { backgroundColor: person.accent },
                    ]}
                  />

                  <Text
                    style={[
                      styles.roleText,
                      { color: person.accent },
                    ]}
                  >
                    {person.role}
                  </Text>
                </View>
              </View>

              <Ionicons
                name="sparkles-outline"
                size={19}
                color={person.accent}
              />
            </View>

            {/* Divider */}
            <View
              style={[
                styles.cardDivider,
                { backgroundColor: colors.border },
              ]}
            />

            {/* Affiliation */}
            <View style={styles.affiliationRow}>
              <Ionicons
                name="business-outline"
                size={17}
                color={colors.textMuted}
              />

              <Text
                style={[
                  styles.affiliationText,
                  { color: colors.textMuted },
                ]}
              >
                {person.affiliation}
              </Text>
            </View>

            {/* Profile button */}
            <Pressable
              onPress={() => handleViewProfile(person.name)}
              style={({ pressed }) => [
                styles.profileButton,
                {
                  borderColor: colors.border,
                  backgroundColor: pressed
                    ? colors.background
                    : "transparent",
                },
              ]}
            >
              <Text
                style={[
                  styles.profileButtonText,
                  { color: colors.text },
                ]}
              >
                View Profile
              </Text>

              <Ionicons
                name="arrow-forward-outline"
                size={17}
                color={colors.text}
              />
            </Pressable>
          </View>
        ))}

        {/* Join team CTA */}
        <View
          style={[
            styles.joinCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.joinIcon,
              {
                backgroundColor: `${colors.primary}18`,
              },
            ]}
          >
            <Ionicons
              name="people-circle-outline"
              size={30}
              color={colors.primary}
            />
          </View>

          <Text
            style={[
              styles.joinTitle,
              { color: colors.text },
            ]}
          >
            Want your card here?
          </Text>

          <Text
            style={[
              styles.joinDescription,
              { color: colors.textMuted },
            ]}
          >
            Join our team, contribute your skills, and help
            students learn better with HSCStack.
          </Text>

          <Pressable
            onPress={handleApply}
            style={({ pressed }) => [
              styles.applyButton,
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Ionicons
              name="rocket-outline"
              size={18}
              color="#FFFFFF"
            />

            <Text style={styles.applyButtonText}>
              Apply for a Role
            </Text>

            <Ionicons
              name="arrow-forward"
              size={17}
              color="#FFFFFF"
            />
          </Pressable>

          <View style={styles.joinFooter}>
            <Ionicons
              name="checkmark-circle-outline"
              size={15}
              color={colors.textMuted}
            />

            <Text
              style={[
                styles.joinFooterText,
                { color: colors.textMuted },
              ]}
            >
              Learn · Build · Contribute
            </Text>
          </View>
        </View>

        {/* Footer */}
        <Text
          style={[
            styles.footerText,
            { color: colors.textMuted },
          ]}
        >
          HSCStack · Built for students
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 35,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  headerTextContainer: {
    flex: 1,
    paddingRight: 12,
  },

  eyebrow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  eyebrowDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#8B5CF6",
    marginRight: 8,
  },

  eyebrowText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
  },

  title: {
    fontSize: 33,
    lineHeight: 39,
    fontWeight: "900",
    letterSpacing: -1.1,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
    maxWidth: 290,
  },

  headerIcon: {
    width: 53,
    height: 53,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 17,
    paddingHorizontal: 7,
    marginBottom: 31,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 43,
  },

  statNumber: {
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },

  statDivider: {
    width: 1,
    height: 33,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  sectionSubtitle: {
    fontSize: 12,
    marginTop: 5,
  },

  teamBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  teamBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  personCard: {
    borderWidth: 1,
    borderRadius: 21,
    padding: 17,
    marginBottom: 14,
  },

  personTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 59,
    height: 59,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  avatarText: {
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  avatarIcon: {
    position: "absolute",
    right: -4,
    bottom: -4,
    width: 23,
    height: 23,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  personInfo: {
    flex: 1,
    marginLeft: 13,
    marginRight: 6,
  },

  personName: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },

  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
  },

  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },

  roleText: {
    fontSize: 10,
    fontWeight: "800",
  },

  cardDivider: {
    height: 1,
    marginVertical: 17,
  },

  affiliationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  affiliationText: {
    fontSize: 11,
    marginLeft: 9,
    flex: 1,
    lineHeight: 17,
  },

  profileButton: {
    minHeight: 43,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  profileButtonText: {
    fontSize: 12,
    fontWeight: "700",
  },

  joinCard: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 23,
    paddingBottom: 20,
    alignItems: "center",
    marginTop: 10,
  },

  joinIcon: {
    width: 58,
    height: 58,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  joinTitle: {
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -0.4,
  },

  joinDescription: {
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 19,
    maxWidth: 285,
  },

  applyButton: {
    minHeight: 49,
    width: "100%",
    borderRadius: 14,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    flex: 1,
    textAlign: "center",
  },

  joinFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 6,
  },

  joinFooterText: {
    fontSize: 10,
    fontWeight: "600",
  },

  footerText: {
    textAlign: "center",
    fontSize: 10,
    marginTop: 25,
  },
});