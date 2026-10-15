import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/theme/ThemeProvider";

type Category = "student" | "contributor";
type Period = "week" | "lastWeek" | "allTime";

type Leader = {
  id: string;
  name: string;
  college: string;
  studyMinutes: number;
  points: number;
  avatarColor: string;
  initials: string;
  resources?: number;
};

const LEADERS: Leader[] = [
  {
    id: "1",
    name: "Raisa Shova",
    college: "Rajshahi College",
    studyMinutes: 1094,
    points: 940,
    avatarColor: "#F5B7C8",
    initials: "RS",
    resources: 24,
  },
  {
    id: "2",
    name: "Mill",
    college: "Dhaka College",
    studyMinutes: 1050,
    points: 890,
    avatarColor: "#A9B8D4",
    initials: "MI",
    resources: 18,
  },
  {
    id: "3",
    name: "Isha Hossain",
    college: "Notre Dame College",
    studyMinutes: 987,
    points: 850,
    avatarColor: "#D9B49A",
    initials: "IH",
    resources: 16,
  },
  {
    id: "4",
    name: "Araf Rahman",
    college: "Rajuk Uttara Model College",
    studyMinutes: 890,
    points: 790,
    avatarColor: "#9CCDB8",
    initials: "AR",
    resources: 13,
  },
  {
    id: "5",
    name: "Nusrat Jahan",
    college: "Viqarunnisa Noon College",
    studyMinutes: 825,
    points: 760,
    avatarColor: "#D0B6E8",
    initials: "NJ",
    resources: 11,
  },
  {
    id: "6",
    name: "Tanvir Ahmed",
    college: "Carmichael College",
    studyMinutes: 760,
    points: 710,
    avatarColor: "#E5C58D",
    initials: "TA",
    resources: 9,
  },
  {
    id: "7",
    name: "Samia Akter",
    college: "Adamjee Cantonment College",
    studyMinutes: 710,
    points: 680,
    avatarColor: "#B2C8E9",
    initials: "SA",
    resources: 8,
  },
  {
    id: "8",
    name: "Fahim Hasan",
    college: "Govt. Azizul Haque College",
    studyMinutes: 650,
    points: 620,
    avatarColor: "#E5B4A7",
    initials: "FH",
    resources: 7,
  },
];

const CURRENT_USER = {
  name: "Shishir Ronjon Dey",
  initials: "SD",
  rank: 12,
  studyMinutes: 420,
};

const PERIODS: { label: string; value: Period }[] = [
  { label: "এই সপ্তাহ", value: "week" },
  { label: "গত সপ্তাহ", value: "lastWeek" },
  { label: "সবকালের", value: "allTime" },
];

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${String(remainingMinutes).padStart(2, "0")}m`;
}

function Avatar({
  initials,
  backgroundColor,
  size = 46,
}: {
  initials: string;
  backgroundColor: string;
  size?: number;
}) {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
      ]}
    >
      <Text
        style={[
          styles.avatarInitials,
          { fontSize: size * 0.29 },
        ]}
      >
        {initials}
      </Text>
    </View>
  );
}

export default function RankingScreen() {
  const { colors, isDark } = useAppTheme();

  const [period, setPeriod] = useState<Period>("week");
  const [category, setCategory] = useState<Category>("student");
  const [infoVisible, setInfoVisible] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  const palette = useMemo(
    () => ({
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      muted: colors.textMuted,
      border: colors.border,
      primary: colors.primary,
      tabInactive: colors.tabInactive,
      secondaryCard: isDark ? "#20232D" : "#F5F5FA",
      podiumCard: isDark ? "#1D2029" : "#FFFFFF",
      modalBackground: isDark ? "#171923" : "#FFFFFF",
      overlay: "rgba(0,0,0,0.65)",
    }),
    [colors, isDark]
  );

  const displayedLeaders = useMemo(() => {
    let data = LEADERS.map((leader) => ({ ...leader }));

    // Demo data: adjust study duration for selected period.
    if (period === "lastWeek") {
      data = data.map((leader) => ({
        ...leader,
        studyMinutes: Math.round(leader.studyMinutes * 0.72),
        points: Math.round(leader.points * 0.75),
      }));
    } else if (period === "allTime") {
      data = data.map((leader) => ({
        ...leader,
        studyMinutes: Math.round(leader.studyMinutes * 8.5),
        points: leader.points * 8,
      }));
    }

    if (category === "contributor") {
      data.sort(
        (a, b) => (b.resources ?? 0) - (a.resources ?? 0)
      );
    } else {
      data.sort((a, b) => b.studyMinutes - a.studyMinutes);
    }

    return data;
  }, [period, category]);

  const topThree = displayedLeaders.slice(0, 3);
  const remainingLeaders = displayedLeaders.slice(3);

  const renderPodiumPerson = (
    leader: Leader,
    position: 1 | 2 | 3
  ) => {
    const isFirst = position === 1;

    const podiumColor =
      position === 1
        ? "#F5BE35"
        : position === 2
        ? "#AAB4C4"
        : "#C58B62";

    const iconName =
      position === 1
        ? "trophy"
        : position === 2
        ? "medal"
        : "ribbon";

    const podiumHeight =
      position === 1 ? 115 : position === 2 ? 88 : 72;

    const displayValue =
      category === "student"
        ? formatDuration(leader.studyMinutes)
        : `${leader.resources ?? 0} টি`;

    return (
      <View
        key={leader.id}
        style={[
          styles.podiumColumn,
          isFirst && styles.podiumFirstColumn,
        ]}
      >
        <View style={styles.podiumAvatarContainer}>
          {isFirst && (
            <Ionicons
              name="trophy"
              size={21}
              color="#F5BE35"
              style={styles.crownIcon}
            />
          )}

          <View
            style={[
              styles.podiumAvatarBorder,
              {
                borderColor: podiumColor,
                borderWidth: isFirst ? 3 : 2,
              },
            ]}
          >
            <Avatar
              initials={leader.initials}
              backgroundColor={leader.avatarColor}
              size={isFirst ? 65 : 53}
            />
          </View>

          <View
            style={[
              styles.rankBadge,
              {
                backgroundColor: podiumColor,
              },
            ]}
          >
            <Text style={styles.rankBadgeText}>
              {position}
            </Text>
          </View>
        </View>

        <Text
          numberOfLines={1}
          style={[
            styles.podiumName,
            { color: palette.text },
            isFirst && styles.podiumFirstName,
          ]}
        >
          {leader.name}
        </Text>

        <Text
          style={[
            styles.podiumDuration,
            { color: palette.muted },
          ]}
        >
          {displayValue}
        </Text>

        <View
          style={[
            styles.podiumStand,
            {
              height: podiumHeight,
              backgroundColor: isDark
                ? `${podiumColor}22`
                : `${podiumColor}30`,
              borderColor: `${podiumColor}80`,
            },
          ]}
        >
          <Ionicons
            name={iconName as any}
            size={isFirst ? 35 : 28}
            color={podiumColor}
          />

          <Text
            style={[
              styles.podiumStandNumber,
              { color: podiumColor },
            ]}
          >
            #{position}
          </Text>
        </View>
      </View>
    );
  };

  const renderLeaderRow = (
    leader: Leader,
    index: number
  ) => {
    const rank = index + 4;

    const displayValue =
      category === "student"
        ? formatDuration(leader.studyMinutes)
        : `${leader.resources ?? 0} টি`;

    return (
      <View
        key={leader.id}
        style={[
          styles.leaderRow,
          {
            backgroundColor: palette.card,
            borderColor: palette.border,
          },
        ]}
      >
        <View style={styles.listRank}>
          <Text
            style={[
              styles.listRankText,
              { color: palette.muted },
            ]}
          >
            {rank}
          </Text>
        </View>

        <Avatar
          initials={leader.initials}
          backgroundColor={leader.avatarColor}
          size={43}
        />

        <View style={styles.leaderDetails}>
          <Text
            numberOfLines={1}
            style={[
              styles.leaderName,
              { color: palette.text },
            ]}
          >
            {leader.name}
          </Text>

          <Text
            numberOfLines={1}
            style={[
              styles.leaderCollege,
              { color: palette.muted },
            ]}
          >
            {leader.college}
          </Text>
        </View>

        <View style={styles.leaderScore}>
          <Ionicons
            name={
              category === "student"
                ? "time-outline"
                : "cloud-upload-outline"
            }
            size={15}
            color={palette.primary}
          />

          <Text
            style={[
              styles.leaderScoreText,
              { color: palette.text },
            ]}
          >
            {displayValue}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: palette.background },
      ]}
      edges={["top"]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={palette.background}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons
              name="trophy"
              size={29}
              color="#F5A623"
            />
          </View>

          <View style={styles.headerTextContainer}>
            <Text
              style={[
                styles.screenTitle,
                { color: palette.text },
              ]}
            >
              Community Leaderboard
            </Text>

            <Text
              style={[
                styles.screenSubtitle,
                { color: palette.muted },
              ]}
            >
              সেরা শিক্ষার্থী ও রিসোর্স কন্ট্রিবিউটরদের তালিকা
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="লিডারবোর্ডের নিয়মাবলী"
            onPress={() => setInfoVisible(true)}
            style={[
              styles.infoButton,
              { backgroundColor: palette.secondaryCard },
            ]}
          >
            <Ionicons
              name="information-circle-outline"
              size={25}
              color={palette.primary}
            />
          </Pressable>
        </View>

        {/* Period Filter */}
        <View
          style={[
            styles.periodContainer,
            { backgroundColor: palette.secondaryCard },
          ]}
        >
          {PERIODS.map((item) => {
            const active = period === item.value;

            return (
              <Pressable
                key={item.value}
                onPress={() => setPeriod(item.value)}
                style={[
                  styles.periodButton,
                  active && {
                    backgroundColor: palette.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.periodText,
                    {
                      color: active
                        ? "#FFFFFF"
                        : palette.muted,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Category Filter */}
        <View style={styles.categoryContainer}>
          <Pressable
            onPress={() => setCategory("student")}
            style={[
              styles.categoryButton,
              {
                backgroundColor:
                  category === "student"
                    ? palette.primary
                    : palette.card,
                borderColor:
                  category === "student"
                    ? palette.primary
                    : palette.border,
              },
            ]}
          >
            <Ionicons
              name="school-outline"
              size={18}
              color={
                category === "student"
                  ? "#FFFFFF"
                  : palette.muted
              }
            />

            <Text
              style={[
                styles.categoryText,
                {
                  color:
                    category === "student"
                      ? "#FFFFFF"
                      : palette.text,
                },
              ]}
            >
              শীর্ষ শিক্ষার্থী
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setCategory("contributor")}
            style={[
              styles.categoryButton,
              {
                backgroundColor:
                  category === "contributor"
                    ? palette.primary
                    : palette.card,
                borderColor:
                  category === "contributor"
                    ? palette.primary
                    : palette.border,
              },
            ]}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={18}
              color={
                category === "contributor"
                  ? "#FFFFFF"
                  : palette.muted
              }
            />

            <Text
              style={[
                styles.categoryText,
                {
                  color:
                    category === "contributor"
                      ? "#FFFFFF"
                      : palette.text,
                },
              ]}
            >
              শীর্ষ কন্ট্রিবিউটর
            </Text>
          </Pressable>
        </View>

        {/* Helper Text */}
        <View
          style={[
            styles.helperCard,
            {
              backgroundColor: palette.secondaryCard,
              borderColor: palette.border,
            },
          ]}
        >
          <Ionicons
            name="bulb-outline"
            size={20}
            color={palette.primary}
          />

          <Text
            style={[
              styles.helperText,
              { color: palette.muted },
            ]}
          >
            {category === "student"
              ? "Study Tracker-এ রেকর্ড করা পড়ার সময় অনুযায়ী শিক্ষার্থীদের র‍্যাঙ্ক দেখানো হচ্ছে।"
              : "জমা দেওয়া শিক্ষামূলক রিসোর্সের সংখ্যার ভিত্তিতে কন্ট্রিবিউটরদের র‍্যাঙ্ক দেখানো হচ্ছে।"}
          </Text>
        </View>

        {/* Current User Card */}
        <View
          style={[
            styles.userCard,
            {
              backgroundColor: palette.card,
              borderColor: palette.border,
            },
          ]}
        >
          <View style={styles.userCardLeft}>
            <View
              style={[
                styles.userRankCircle,
                {
                  backgroundColor: `${palette.primary}20`,
                },
              ]}
            >
              <Text
                style={[
                  styles.userRankNumber,
                  { color: palette.primary },
                ]}
              >
                #{CURRENT_USER.rank}
              </Text>
            </View>

            <Avatar
              initials={CURRENT_USER.initials}
              backgroundColor="#A5B4FC"
              size={46}
            />

            <View style={styles.userDetails}>
              <Text
                style={[
                  styles.userName,
                  { color: palette.text },
                ]}
              >
                {CURRENT_USER.name}
              </Text>

              <Text
                style={[
                  styles.userSubtext,
                  { color: palette.muted },
                ]}
              >
                {checkedIn
                  ? "আজকের চেক-ইন সম্পন্ন!"
                  : "আজকের পড়াশোনা শুরু করো"}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => setCheckedIn((previous) => !previous)}
            style={[
              styles.checkInButton,
              {
                backgroundColor: checkedIn
                  ? "#159B72"
                  : palette.primary,
              },
            ]}
          >
            <Ionicons
              name={checkedIn ? "checkmark-circle" : "flash"}
              size={16}
              color="#FFFFFF"
            />

            <Text style={styles.checkInText}>
              {checkedIn ? "সম্পন্ন" : "চেক-ইন"}
            </Text>
          </Pressable>
        </View>

        {/* Podium Title */}
        <View style={styles.sectionHeader}>
          <View>
            <Text
              style={[
                styles.sectionTitle,
                { color: palette.text },
              ]}
            >
              🏆 শীর্ষ ৩ জন
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                { color: palette.muted },
              ]}
            >
              {period === "week"
                ? "এই সপ্তাহের সেরা পারফর্মার"
                : period === "lastWeek"
                ? "গত সপ্তাহের সেরা পারফর্মার"
                : "সর্বকালের সেরা পারফর্মার"}
            </Text>
          </View>
        </View>

        {/* Podium */}
        <View
          style={[
            styles.podiumContainer,
            {
              backgroundColor: palette.secondaryCard,
              borderColor: palette.border,
            },
          ]}
        >
          {topThree.length >= 3 ? (
            <>
              {renderPodiumPerson(topThree[1], 2)}
              {renderPodiumPerson(topThree[0], 1)}
              {renderPodiumPerson(topThree[2], 3)}
            </>
          ) : (
            <Text
              style={[
                styles.emptyText,
                { color: palette.muted },
              ]}
            >
              এখনো পর্যাপ্ত র‍্যাঙ্কিং ডেটা নেই।
            </Text>
          )}
        </View>

        {/* Ranking List */}
        <View style={styles.listHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: palette.text },
            ]}
          >
            সম্পূর্ণ র‍্যাঙ্কিং
          </Text>

          <View
            style={[
              styles.totalBadge,
              { backgroundColor: palette.secondaryCard },
            ]}
          >
            <Text
              style={[
                styles.totalBadgeText,
                { color: palette.muted },
              ]}
            >
              {displayedLeaders.length} জন
            </Text>
          </View>
        </View>

        {remainingLeaders.map((leader, index) =>
          renderLeaderRow(leader, index)
        )}

        {/* Bottom Note */}
        <View style={styles.bottomNote}>
          <Ionicons
            name="shield-checkmark-outline"
            size={17}
            color={palette.muted}
          />

          <Text
            style={[
              styles.bottomNoteText,
              { color: palette.muted },
            ]}
          >
            সৎভাবে পড়াশোনা করো, নিজের সেরাটা দাও!
          </Text>
        </View>
      </ScrollView>

      {/* Rules Information Modal */}
      <Modal
        visible={infoVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoVisible(false)}
        statusBarTranslucent
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: palette.overlay },
          ]}
        >
          <View
            style={[
              styles.modalCard,
              { backgroundColor: palette.modalBackground },
            ]}
          >
            <View style={styles.modalHeader}>
              <View
                style={[
                  styles.modalTitleIcon,
                  { backgroundColor: "#F5A62320" },
                ]}
              >
                <Ionicons
                  name="trophy"
                  size={26}
                  color="#F5A623"
                />
              </View>

              <View style={styles.modalTitleContainer}>
                <Text
                  style={[
                    styles.modalTitle,
                    { color: palette.text },
                  ]}
                >
                  লিডারবোর্ডের নিয়মাবলী
                </Text>

                <Text
                  style={[
                    styles.modalSubtitle,
                    { color: palette.muted },
                  ]}
                >
                  HSCStack Community
                </Text>
              </View>

              <Pressable
                onPress={() => setInfoVisible(false)}
                hitSlop={10}
                style={styles.closeButton}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={palette.muted}
                />
              </Pressable>
            </View>

            <ScrollView
              style={styles.rulesScroll}
              showsVerticalScrollIndicator={false}
            >
              {/* Rule 1 */}
              <View
                style={[
                  styles.ruleCard,
                  { backgroundColor: palette.secondaryCard },
                ]}
              >
                <View
                  style={[
                    styles.ruleIcon,
                    { backgroundColor: "#4285F420" },
                  ]}
                >
                  <Ionicons
                    name="help-circle"
                    size={24}
                    color="#4285F4"
                  />
                </View>

                <View style={styles.ruleContent}>
                  <Text
                    style={[
                      styles.ruleTitle,
                      { color: palette.text },
                    ]}
                  >
                    শীর্ষ শিক্ষার্থী কীভাবে নির্ধারিত হয়?
                  </Text>

                  <Text
                    style={[
                      styles.ruleDescription,
                      { color: palette.muted },
                    ]}
                  >
                    Study Tracker-এ রেকর্ড করা পড়ার সময়ের
                    ভিত্তিতে শিক্ষার্থীদের র‍্যাঙ্ক নির্ধারিত
                    হবে। নিয়মিত পড়াশোনা করো এবং নিজের
                    অগ্রগতি ট্র্যাক করো।
                  </Text>
                </View>
              </View>

              {/* Rule 2 */}
              <View
                style={[
                  styles.ruleCard,
                  { backgroundColor: palette.secondaryCard },
                ]}
              >
                <View
                  style={[
                    styles.ruleIcon,
                    { backgroundColor: "#19A97420" },
                  ]}
                >
                  <Ionicons
                    name="cloud-upload"
                    size={24}
                    color="#19A974"
                  />
                </View>

                <View style={styles.ruleContent}>
                  <Text
                    style={[
                      styles.ruleTitle,
                      { color: palette.text },
                    ]}
                  >
                    শীর্ষ কন্ট্রিবিউটর কীভাবে নির্ধারিত হয়?
                  </Text>

                  <Text
                    style={[
                      styles.ruleDescription,
                      { color: palette.muted },
                    ]}
                  >
                    অনুমোদিত শিক্ষামূলক নোট, প্রশ্ন,
                    সমাধান ও অন্যান্য উপকারী রিসোর্স
                    শেয়ার করার মাধ্যমে কমিউনিটিতে
                    অবদান রাখতে পারবে।
                  </Text>
                </View>
              </View>

              {/* Rule 3 */}
              <View
                style={[
                  styles.ruleCard,
                  { backgroundColor: palette.secondaryCard },
                ]}
              >
                <View
                  style={[
                    styles.ruleIcon,
                    { backgroundColor: "#F5A62320" },
                  ]}
                >
                  <Ionicons
                    name="time"
                    size={24}
                    color="#F5A623"
                  />
                </View>

                <View style={styles.ruleContent}>
                  <Text
                    style={[
                      styles.ruleTitle,
                      { color: palette.text },
                    ]}
                  >
                    র‍্যাঙ্কিং কখন রিসেট হয়?
                  </Text>

                  <Text
                    style={[
                      styles.ruleDescription,
                      { color: palette.muted },
                    ]}
                  >
                    সাপ্তাহিক র‍্যাঙ্কিং নির্ধারিত সময়সীমা
                    অনুযায়ী আপডেট হবে। দৈনিক চেক-ইন
                    বা স্টাডি কাউন্ট রিসেটের নিয়ম
                    অ্যাপের সার্ভার থেকে নিয়ন্ত্রিত হবে।
                  </Text>
                </View>
              </View>

              {/* Rule 4 */}
              <View
                style={[
                  styles.ruleCard,
                  { backgroundColor: palette.secondaryCard },
                ]}
              >
                <View
                  style={[
                    styles.ruleIcon,
                    { backgroundColor: "#EA433520" },
                  ]}
                >
                  <Ionicons
                    name="warning"
                    size={24}
                    color="#EA4335"
                  />
                </View>

                <View style={styles.ruleContent}>
                  <Text
                    style={[
                      styles.ruleTitle,
                      { color: palette.text },
                    ]}
                  >
                    প্রতারণা ও ভুয়া অ্যাকাউন্ট
                  </Text>

                  <Text
                    style={[
                      styles.ruleDescription,
                      { color: palette.muted },
                    ]}
                  >
                    ভুয়া স্টাডি টাইম, স্প্যাম রিসোর্স
                    বা র‍্যাঙ্কিংয়ে কারচুপি গ্রহণযোগ্য নয়।
                    যাচাই করে নিয়মভঙ্গের ব্যবস্থা নিতে
                    পারে HSCStack কর্তৃপক্ষ।
                  </Text>
                </View>
              </View>

              <View style={styles.rulesFooter}>
                <Ionicons
                  name="heart"
                  size={16}
                  color="#F05B78"
                />

                <Text
                  style={[
                    styles.rulesFooterText,
                    { color: palette.muted },
                  ]}
                >
                  শেখো, শেয়ার করো, একসঙ্গে এগিয়ে যাও।
                </Text>
              </View>
            </ScrollView>

            <Pressable
              onPress={() => setInfoVisible(false)}
              style={[
                styles.modalDoneButton,
                { backgroundColor: palette.primary },
              ]}
            >
              <Text style={styles.modalDoneText}>
                বুঝেছি
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  headerIcon: {
    width: 49,
    height: 49,
    borderRadius: 16,
    backgroundColor: "#F5A62318",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  headerTextContainer: {
    flex: 1,
  },

  screenTitle: {
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  screenSubtitle: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  infoButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },

  periodContainer: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 14,
    marginBottom: 14,
  },

  periodButton: {
    flex: 1,
    minHeight: 41,
    paddingHorizontal: 3,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  periodText: {
    fontSize: 12,
    fontWeight: "700",
  },

  categoryContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  categoryButton: {
    flex: 1,
    minHeight: 45,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  categoryText: {
    fontSize: 12,
    fontWeight: "700",
  },

  helperCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 13,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 17,
    gap: 10,
  },

  helperText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 19,
  },

  userCard: {
    padding: 12,
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
    gap: 8,
  },

  userCardLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  userRankCircle: {
    minWidth: 37,
    height: 37,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  userRankNumber: {
    fontSize: 11,
    fontWeight: "800",
  },

  userDetails: {
    flex: 1,
  },

  userName: {
    fontSize: 12,
    fontWeight: "800",
  },

  userSubtext: {
    fontSize: 10,
    marginTop: 5,
  },

  checkInButton: {
    minHeight: 36,
    borderRadius: 11,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  checkInText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },

  sectionHeader: {
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  sectionSubtitle: {
    fontSize: 11,
    marginTop: 5,
  },

  podiumContainer: {
    borderRadius: 19,
    borderWidth: 1,
    paddingTop: 25,
    paddingHorizontal: 5,
    paddingBottom: 13,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginBottom: 27,
    overflow: "hidden",
  },

  podiumColumn: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
  },

  podiumFirstColumn: {
    marginHorizontal: 2,
  },

  podiumAvatarContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    minHeight: 83,
    marginBottom: 9,
  },

  crownIcon: {
    marginBottom: 4,
  },

  podiumAvatarBorder: {
    borderRadius: 50,
    padding: 3,
  },

  avatar: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  avatarInitials: {
    color: "#20202A",
    fontWeight: "900",
  },

  rankBadge: {
    minWidth: 23,
    height: 23,
    paddingHorizontal: 5,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    marginTop: -12,
  },

  rankBadgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#20202A",
  },

  podiumName: {
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center",
    maxWidth: "100%",
    paddingHorizontal: 2,
  },

  podiumFirstName: {
    fontSize: 12,
  },

  podiumDuration: {
    fontSize: 10,
    marginTop: 5,
    marginBottom: 11,
  },

  podiumStand: {
    width: "94%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderBottomWidth: 0,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 13,
  },

  podiumStandNumber: {
    fontSize: 12,
    fontWeight: "900",
    marginTop: 5,
  },

  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  totalBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
  },

  totalBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },

  leaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 9,
    gap: 9,
  },

  listRank: {
    width: 20,
    alignItems: "center",
  },

  listRankText: {
    fontSize: 13,
    fontWeight: "800",
  },

  leaderDetails: {
    flex: 1,
    minWidth: 0,
  },

  leaderName: {
    fontSize: 12,
    fontWeight: "800",
  },

  leaderCollege: {
    fontSize: 10,
    marginTop: 5,
  },

  leaderScore: {
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 4,
    maxWidth: 76,
  },

  leaderScoreText: {
    fontSize: 10,
    fontWeight: "800",
  },

  bottomNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 15,
    paddingVertical: 10,
  },

  bottomNoteText: {
    fontSize: 11,
  },

  emptyText: {
    fontSize: 13,
    paddingVertical: 30,
    textAlign: "center",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 28,
  },

  modalCard: {
    width: "100%",
    maxWidth: 480,
    maxHeight: "90%",
    borderRadius: 23,
    padding: 17,
    overflow: "hidden",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 17,
    gap: 11,
  },

  modalTitleIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  modalTitleContainer: {
    flex: 1,
  },

  modalTitle: {
    fontSize: 15,
    fontWeight: "900",
  },

  modalSubtitle: {
    fontSize: 11,
    marginTop: 5,
  },

  closeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  rulesScroll: {
    flexGrow: 0,
  },

  ruleCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 13,
    borderRadius: 15,
    marginBottom: 10,
    gap: 11,
  },

  ruleIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  ruleContent: {
    flex: 1,
  },

  ruleTitle: {
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 19,
    marginBottom: 6,
  },

  ruleDescription: {
    fontSize: 11,
    lineHeight: 19,
  },

  rulesFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 12,
  },

  rulesFooterText: {
    fontSize: 11,
  },

  modalDoneButton: {
    minHeight: 46,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  modalDoneText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
});