import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useAppTheme } from "@/theme/ThemeProvider";

type IconName = keyof typeof Ionicons.glyphMap;

type TrafficSource = {
  domain: string;
  visits: string;
};

const trafficSources: TrafficSource[] = [
  { domain: "$direct", visits: "26,523" },
  { domain: "www.google.com", visits: "5,178" },
  { domain: "lm.facebook.com", visits: "4,380" },
  { domain: "ssc26-dinajpur.hscstack.site", visits: "2,930" },
  { domain: "accounts.google.com", visits: "858" },
  { domain: "l.facebook.com", visits: "750" },
];

function SectionTitle({
  title,
  icon,
  mutedColor,
  accentColor,
}: {
  title: string;
  icon?: IconName;
  mutedColor: string;
  accentColor: string;
}) {
  return (
    <View style={styles.sectionTitleContainer}>
      <Text
        style={[
          styles.sectionTitleText,
          { color: mutedColor },
        ]}
      >
        {title}
      </Text>

      {icon ? (
        <Ionicons
          name={icon}
          size={18}
          color={accentColor}
        />
      ) : null}
    </View>
  );
}

function ManagementCard({
  title,
  subtitle,
  icon,
  accent,
  cardColor,
  borderColor,
  textColor,
  mutedColor,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: IconName;
  accent: "indigo" | "amber";
  cardColor: string;
  borderColor: string;
  textColor: string;
  mutedColor: string;
  onPress: () => void;
}) {
  const iconColor =
    accent === "indigo" ? "#818CF8" : "#FBBF24";

  const iconBackground =
    accent === "indigo"
      ? "rgba(129,140,248,0.15)"
      : "rgba(251,191,36,0.15)";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.managementCard,
        {
          backgroundColor: cardColor,
          borderColor,
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      <View style={styles.managementCardTop}>
        <View
          style={[
            styles.managementIconBox,
            { backgroundColor: iconBackground },
          ]}
        >
          <Ionicons
            name={icon}
            size={22}
            color={iconColor}
          />
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={mutedColor}
        />
      </View>

      <Text
        style={[
          styles.managementTitle,
          { color: textColor },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.managementSubtitle,
          { color: mutedColor },
        ]}
      >
        {subtitle}
      </Text>
    </Pressable>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  cardColor,
  borderColor,
  textColor,
  mutedColor,
  accentColor,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: IconName;
  cardColor: string;
  borderColor: string;
  textColor: string;
  mutedColor: string;
  accentColor: string;
}) {
  return (
    <View
      style={[
        styles.metricCard,
        {
          backgroundColor: cardColor,
          borderColor,
        },
      ]}
    >
      <View style={styles.metricHeader}>
        <Text
          numberOfLines={2}
          style={[
            styles.metricLabel,
            { color: mutedColor },
          ]}
        >
          {title}
        </Text>

        <Ionicons
          name={icon}
          size={19}
          color={accentColor}
        />
      </View>

      <Text
        style={[
          styles.metricValue,
          { color: textColor },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.metricSubtitle,
          { color: mutedColor },
        ]}
      >
        {subtitle}
      </Text>
    </View>
  );
}

function ActiveNowCard({
  cardColor,
  borderColor,
  textColor,
  mutedColor,
}: {
  cardColor: string;
  borderColor: string;
  textColor: string;
  mutedColor: string;
}) {
  return (
    <View
      style={[
        styles.activeCard,
        {
          backgroundColor: cardColor,
          borderColor,
        },
      ]}
    >
      <View style={styles.activeHeader}>
        <View style={styles.activeLabelContainer}>
          <View style={styles.activeDot} />

          <Text style={styles.activeLabel}>
            ACTIVE NOW
          </Text>
        </View>

        <Ionicons
          name="pulse-outline"
          size={21}
          color="#10B981"
        />
      </View>

      <View style={styles.activeBottom}>
        <Text
          style={[
            styles.activeNumber,
            { color: textColor },
          ]}
        >
          2
        </Text>

        <Text
          style={[
            styles.activePeriod,
            { color: mutedColor },
          ]}
        >
          Past 5 mins
        </Text>
      </View>
    </View>
  );
}

function TrafficSourceRow({
  domain,
  visits,
  textColor,
  mutedColor,
  borderColor,
  badgeColor,
}: TrafficSource & {
  textColor: string;
  mutedColor: string;
  borderColor: string;
  badgeColor: string;
}) {
  return (
    <View
      style={[
        styles.trafficRow,
        { borderBottomColor: borderColor },
      ]}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.trafficDomain,
          { color: textColor },
        ]}
      >
        {domain}
      </Text>

      <View
        style={[
          styles.trafficBadge,
          { backgroundColor: badgeColor },
        ]}
      >
        <Text
          style={[
            styles.trafficVisits,
            { color: mutedColor },
          ]}
        >
          {visits}
        </Text>
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const { colors, isDark } = useAppTheme();

  const [refreshing, setRefreshing] = useState(false);

  const backgroundColor = colors.background;

  const cardColor = isDark
    ? "#161B26"
    : colors.surface;

  const secondaryCardColor = isDark
    ? "#111620"
    : colors.surface;

  const borderColor = colors.border;
  const textColor = colors.text;
  const mutedColor = colors.textMuted;
  const accentColor = colors.primary;

  const reloadAnalytics = async () => {
    if (refreshing) {
      return;
    }

    setRefreshing(true);

    try {
      // TODO: Backend/API theke real analytics fetch korbi.
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 600);
      });
    } finally {
      setRefreshing(false);
    }
  };

  const navigateTo = (route: string) => {
    router.push(route as never);
  };

  const showUnavailableMessage = (feature: string) => {
    Alert.alert(
      feature,
      "এই ফিচারটি এখনো যুক্ত করা হয়নি।"
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor },
      ]}
      edges={["left", "right"]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={reloadAnalytics}
            tintColor={accentColor}
            colors={[accentColor]}
            progressBackgroundColor={cardColor}
          />
        }
      >
        {/* Dashboard Heading */}
        <View style={styles.dashboardHeading}>
          <Text
            style={[
              styles.dashboardTitle,
              { color: textColor },
            ]}
          >
            Dashboard
          </Text>

          <Text
            style={[
              styles.dashboardSubtitle,
              { color: mutedColor },
            ]}
          >
            Staff workspace • 1,036 Total Accounts
          </Text>

          <Pressable
            onPress={reloadAnalytics}
            disabled={refreshing}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.reloadButton,
              {
                borderColor,
                backgroundColor: pressed
                  ? secondaryCardColor
                  : "transparent",
                opacity: refreshing ? 0.6 : 1,
              },
            ]}
          >
            <Ionicons
              name="refresh-outline"
              size={17}
              color={textColor}
            />

            <Text
              style={[
                styles.reloadButtonText,
                { color: textColor },
              ]}
            >
              {refreshing
                ? "Refreshing..."
                : "Reload Analytics"}
            </Text>
          </Pressable>
        </View>

        {/* Management Tools */}
        <SectionTitle
          title="MANAGEMENT TOOLS"
          mutedColor={mutedColor}
          accentColor={accentColor}
        />

        <View style={styles.managementRow}>
          <ManagementCard
            title="Manage Contents"
            subtitle="Manage learning resources"
            icon="document-text-outline"
            accent="indigo"
            cardColor={cardColor}
            borderColor={borderColor}
            textColor={textColor}
            mutedColor={mutedColor}
            onPress={() => navigateTo("/contributors")}
          />

          <ManagementCard
            title="Support Tickets"
            subtitle="Review user requests"
            icon="headset-outline"
            accent="amber"
            cardColor={cardColor}
            borderColor={borderColor}
            textColor={textColor}
            mutedColor={mutedColor}
            onPress={() =>
              showUnavailableMessage("Support Tickets")
            }
          />
        </View>

        {/* Live Traffic */}
        <SectionTitle
          title="LIVE TRAFFIC"
          mutedColor={mutedColor}
          accentColor={accentColor}
        />

        <ActiveNowCard
          cardColor={cardColor}
          borderColor={borderColor}
          textColor={textColor}
          mutedColor={mutedColor}
        />

        {/* Analytics Metrics */}
        <View style={styles.metricsRow}>
          <MetricCard
            title="TOTAL VISITS"
            value="43,697"
            subtitle="Pageviews recorded"
            icon="eye-outline"
            cardColor={cardColor}
            borderColor={borderColor}
            textColor={textColor}
            mutedColor={mutedColor}
            accentColor={accentColor}
          />

          <MetricCard
            title="UNIQUE VISITORS"
            value="2,021"
            subtitle="Distinct visitors"
            icon="people-outline"
            cardColor={cardColor}
            borderColor={borderColor}
            textColor={textColor}
            mutedColor={mutedColor}
            accentColor={accentColor}
          />
        </View>

        {/* Traffic Sources */}
        <SectionTitle
          title="TOP TRAFFIC SOURCES"
          icon="share-social-outline"
          mutedColor={mutedColor}
          accentColor={accentColor}
        />

        <View
          style={[
            styles.trafficContainer,
            {
              backgroundColor: cardColor,
              borderColor,
            },
          ]}
        >
          {trafficSources.map((source, index) => (
            <TrafficSourceRow
              key={source.domain}
              domain={source.domain}
              visits={source.visits}
              textColor={textColor}
              mutedColor={mutedColor}
              borderColor={
                index === trafficSources.length - 1
                  ? "transparent"
                  : borderColor
              }
              badgeColor={secondaryCardColor}
            />
          ))}
        </View>

        {/* Footer */}
        <Text
          style={[
            styles.footerText,
            { color: mutedColor },
          ]}
        >
          HSCStack • Staff Workspace
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 21,
    paddingBottom: 32,
  },

  dashboardHeading: {
    marginBottom: 26,
  },

  dashboardTitle: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.7,
  },

  dashboardSubtitle: {
    fontSize: 12,
    lineHeight: 19,
    marginTop: 5,
  },

  reloadButton: {
    minHeight: 41,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderWidth: 1,
    borderRadius: 10,
  },

  reloadButtonText: {
    fontSize: 12,
    fontWeight: "700",
  },

  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitleText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  managementRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 25,
  },

  managementCard: {
    flex: 1,
    minHeight: 145,
    padding: 13,
    borderWidth: 1,
    borderRadius: 17,
  },

  managementCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  managementIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  managementTitle: {
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
  },

  managementSubtitle: {
    fontSize: 10,
    lineHeight: 16,
    marginTop: 5,
  },

  activeCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.25)",
    borderRadius: 17,
    marginBottom: 12,
  },

  activeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  activeLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  activeDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#34D399",
  },

  activeLabel: {
    color: "#34D399",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.3,
  },

  activeBottom: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 13,
  },

  activeNumber: {
    fontSize: 35,
    fontWeight: "900",
    letterSpacing: -1,
  },

  activePeriod: {
    fontSize: 11,
    paddingBottom: 5,
  },

  metricsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 25,
  },

  metricCard: {
    flex: 1,
    minHeight: 135,
    padding: 13,
    borderWidth: 1,
    borderRadius: 17,
  },

  metricHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 7,
    marginBottom: 14,
  },

  metricLabel: {
    flex: 1,
    fontSize: 9,
    lineHeight: 14,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  metricValue: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.8,
  },

  metricSubtitle: {
    fontSize: 10,
    lineHeight: 16,
    marginTop: 7,
  },

  trafficContainer: {
    paddingHorizontal: 13,
    borderWidth: 1,
    borderRadius: 17,
    marginBottom: 17,
  },

  trafficRow: {
    minHeight: 53,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  trafficDomain: {
    flex: 1,
    fontSize: 11,
    lineHeight: 17,
  },

  trafficBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  trafficVisits: {
    fontSize: 10,
    fontWeight: "800",
  },

  footerText: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 2,
    marginBottom: 8,
  },
});