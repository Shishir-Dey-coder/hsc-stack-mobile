import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  background: "#0D1117",
  card: "#161B22",
  cardLight: "#1C2330",
  border: "#30363D",
  text: "#F0F6FC",
  muted: "#8B949E",
  purple: "#A78BFA",
  purpleLight: "#C4B5FD",
  green: "#39D353",
  blue: "#58A6FF",
  white: "#FFFFFF",
};

type SocialLinks = {
  github: string;
  facebook: string;
  instagram: string;
};

type Person = {
  id: string;
  name: string;
  username: string;
  detail: string;
  initial: string;
  color: string;
  textColor: string;
};

type ActivityDay = {
  date: Date;
  level: number;
};

const ACTIVITY_COLORS = [
  "#202631",
  "#0E4429",
  "#006D32",
  "#26A641",
  "#39D353",
];

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const PEOPLE: Person[] = [
  {
    id: "1",
    name: "Arif Hasan",
    username: "@arif.study",
    detail: "HSC 2027 · Physics enthusiast",
    initial: "A",
    color: "#252044",
    textColor: "#C4B5FD",
  },
  {
    id: "2",
    name: "Nusrat Jahan",
    username: "@nusrat.learns",
    detail: "HSC 2027 · Chemistry learner",
    initial: "N",
    color: "#193044",
    textColor: "#58A6FF",
  },
  {
    id: "3",
    name: "Rakib Ahmed",
    username: "@rakib.codes",
    detail: "HSC 2027 · Programming enthusiast",
    initial: "R",
    color: "#173528",
    textColor: "#39D353",
  },
];

function addDays(date: Date, amount: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Demo activity pattern. Connect the real study tracker later.
function getActivityLevel(date: Date, today: Date) {
  if (date > today) return 0;

  const seed =
    (date.getFullYear() * 13 +
      (date.getMonth() + 1) * 17 +
      date.getDate() * 23) %
    100;

  if (seed < 35) return 0;
  if (seed < 57) return 1;
  if (seed < 75) return 2;
  if (seed < 91) return 3;

  return 4;
}

function makeActivityCalendar(): ActivityDay[][] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calendar starts Sunday and ends Saturday.
  const endDate = addDays(today, 6 - today.getDay());
  const startDate = addDays(endDate, -370);

  const weeks: ActivityDay[][] = [];

  for (let weekIndex = 0; weekIndex < 53; weekIndex++) {
    const week: ActivityDay[] = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const date = addDays(
        startDate,
        weekIndex * 7 + dayIndex
      );

      week.push({
        date,
        level: getActivityLevel(date, today),
      });
    }

    weeks.push(week);
  }

  return weeks;
}

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<
    "Forum" | "Articles" | "Activity"
  >("Forum");

  const [activeForumTab, setActiveForumTab] = useState<
    "Questions" | "Answers"
  >("Questions");

  const [editLinksVisible, setEditLinksVisible] = useState(false);

  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    github: "",
    facebook: "",
    instagram: "",
  });

  const [draftLinks, setDraftLinks] = useState<SocialLinks>({
    github: "",
    facebook: "",
    instagram: "",
  });

  const [appreciatedPeople, setAppreciatedPeople] = useState<string[]>(
    []
  );

  const activityWeeks = useMemo(
    () => makeActivityCalendar(),
    []
  );

  const handleEditProfile = () => {
    setDraftLinks({ ...socialLinks });
    setEditLinksVisible((previous) => !previous);
  };

  const saveSocialLinks = () => {
    setSocialLinks({ ...draftLinks });
    setEditLinksVisible(false);

    Alert.alert(
      "Profile Updated",
      "Your social links have been saved for this session."
    );
  };

  const openSocialLink = (platform: keyof SocialLinks) => {
    const url = socialLinks[platform].trim();

    if (!url) {
      Alert.alert(
        platform.charAt(0).toUpperCase() + platform.slice(1),
        "No link added yet. Tap Edit Profile to add your link."
      );
      return;
    }

    Alert.alert("Your Profile Link", url);
  };

  const handleTrackProgress = () => {
    Alert.alert(
      "Study Tracker",
      "Connect your study tracker to display real study sessions and activity."
    );
  };

  const handleShare = () => {
    Alert.alert(
      "Share Profile",
      "Profile sharing can be connected here later."
    );
  };

  const toggleAppreciation = (personId: string) => {
    setAppreciatedPeople((previous) =>
      previous.includes(personId)
        ? previous.filter((id) => id !== personId)
        : [...previous, personId]
    );
  };

  const renderSectionTitle = (
    eyebrow: string,
    title: string,
    icon: React.ComponentProps<typeof Ionicons>["name"]
  ) => (
    <View style={styles.sectionHeading}>
      <View style={styles.sectionIcon}>
        <Ionicons
          name={icon}
          size={18}
          color={COLORS.purpleLight}
        />
      </View>

      <View style={styles.sectionHeadingText}>
        <Text style={styles.sectionEyebrow}>{eyebrow}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
    </View>
  );

  const renderEmptyState = (
    icon: React.ComponentProps<typeof Ionicons>["name"],
    title: string,
    description: string
  ) => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconCircle}>
        <Ionicons
          name={icon}
          size={26}
          color={COLORS.purpleLight}
        />
      </View>

      <Text style={styles.emptyTitle}>{title}</Text>

      <Text style={styles.emptyDescription}>
        {description}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* PROFILE HEADER */}
        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>S</Text>
              </View>

              <View style={styles.onlineDot} />
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
              activeOpacity={0.8}
            >
              <Ionicons
                name="create-outline"
                size={16}
                color={COLORS.text}
              />

              <Text style={styles.editButtonText}>
                {editLinksVisible ? "Close Editor" : "Edit Profile"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.nameRow}>
            <Text style={styles.profileName}>
              Shishir Ronjon Dey
            </Text>

            <Ionicons
              name="checkmark-circle"
              size={20}
              color={COLORS.blue}
            />
          </View>

          <Text style={styles.username}>@sRonjon</Text>

          <View style={styles.collegeRow}>
            <Ionicons
              name="school-outline"
              size={15}
              color={COLORS.muted}
            />

            <Text style={styles.collegeText}>
              Rangpur Zilla School
            </Text>
          </View>

          <Text style={styles.bio}>
            Backend Django Developer 💻{"\n"}
            Learning, building and growing every day. 🚀
          </Text>

          {/* SOCIAL LINKS */}
          <Text style={styles.socialHeading}>
            CONNECT WITH ME
          </Text>

          <View style={styles.socialLinksRow}>
            <TouchableOpacity
              style={styles.socialLink}
              onPress={() => openSocialLink("github")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="logo-github"
                size={19}
                color={COLORS.text}
              />

              <Text style={styles.socialLinkText}>GitHub</Text>

              <Ionicons
                name="open-outline"
                size={12}
                color={COLORS.muted}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialLink}
              onPress={() => openSocialLink("facebook")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="logo-facebook"
                size={19}
                color="#58A6FF"
              />

              <Text style={styles.socialLinkText}>Facebook</Text>

              <Ionicons
                name="open-outline"
                size={12}
                color={COLORS.muted}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialLink}
              onPress={() => openSocialLink("instagram")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="logo-instagram"
                size={19}
                color="#E879F9"
              />

              <Text style={styles.socialLinkText}>Instagram</Text>

              <Ionicons
                name="open-outline"
                size={12}
                color={COLORS.muted}
              />
            </TouchableOpacity>
          </View>

          {/* SOCIAL LINK EDITOR */}
          {editLinksVisible && (
            <View style={styles.linkEditor}>
              <Text style={styles.editorTitle}>
                Social Profile Links
              </Text>

              <Text style={styles.inputLabel}>GitHub URL</Text>

              <TextInput
                style={styles.linkInput}
                placeholder="https://github.com/username"
                placeholderTextColor={COLORS.muted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                value={draftLinks.github}
                onChangeText={(value) =>
                  setDraftLinks((previous) => ({
                    ...previous,
                    github: value,
                  }))
                }
              />

              <Text style={styles.inputLabel}>Facebook URL</Text>

              <TextInput
                style={styles.linkInput}
                placeholder="https://facebook.com/username"
                placeholderTextColor={COLORS.muted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                value={draftLinks.facebook}
                onChangeText={(value) =>
                  setDraftLinks((previous) => ({
                    ...previous,
                    facebook: value,
                  }))
                }
              />

              <Text style={styles.inputLabel}>Instagram URL</Text>

              <TextInput
                style={styles.linkInput}
                placeholder="https://instagram.com/username"
                placeholderTextColor={COLORS.muted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                value={draftLinks.instagram}
                onChangeText={(value) =>
                  setDraftLinks((previous) => ({
                    ...previous,
                    instagram: value,
                  }))
                }
              />

              <TouchableOpacity
                style={styles.saveLinksButton}
                onPress={saveSocialLinks}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color={COLORS.white}
                />

                <Text style={styles.saveLinksButtonText}>
                  Save Social Links
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* APPRECIATORS AND APPRECIATING */}
          <View style={styles.profileStats}>
            <TouchableOpacity
              style={styles.profileStat}
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert(
                  "Appreciators",
                  "People who appreciate your contributions will appear here."
                )
              }
            >
              <Text style={styles.profileStatNumber}>128</Text>
              <Text style={styles.profileStatLabel}>
                Appreciators
              </Text>
            </TouchableOpacity>

            <View style={styles.statDivider} />

            <TouchableOpacity
              style={styles.profileStat}
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert(
                  "Appreciating",
                  "People whose contributions you appreciate will appear here."
                )
              }
            >
              <Text style={styles.profileStatNumber}>86</Text>
              <Text style={styles.profileStatLabel}>
                Appreciating
              </Text>
            </TouchableOpacity>

            <View style={styles.statDivider} />

            <View style={styles.profileStat}>
              <Text style={styles.profileStatNumber}>24</Text>
              <Text style={styles.profileStatLabel}>
                Contributions
              </Text>
            </View>
          </View>

          <View style={styles.joinedRow}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={COLORS.muted}
            />

            <Text style={styles.joinedText}>
              Joined September 2026
            </Text>
          </View>
        </View>

        {/* SYLLABUS PROGRESS */}
        <View style={styles.sectionCard}>
          {renderSectionTitle(
            "YOUR LEARNING JOURNEY",
            "Syllabus Progress",
            "book-outline"
          )}

          <View style={styles.progressSummary}>
            <View>
              <Text style={styles.progressPercent}>35%</Text>
              <Text style={styles.progressCaption}>
                Overall completion
              </Text>
            </View>

            <View style={styles.progressRight}>
              <View style={styles.progressBadge}>
                <Ionicons
                  name="trending-up"
                  size={14}
                  color={COLORS.green}
                />

                <Text style={styles.progressBadgeText}>
                  Keep going
                </Text>
              </View>

              <Text style={styles.progressSmallText}>
                7 of 20 chapters
              </Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: "35%" },
              ]}
            />
          </View>

          <View style={styles.subjectList}>
            <View style={styles.subjectRow}>
              <View
                style={[
                  styles.subjectIcon,
                  { backgroundColor: "#252044" },
                ]}
              >
                <Ionicons
                  name="flask-outline"
                  size={17}
                  color="#BCA8FF"
                />
              </View>

              <View style={styles.subjectInfo}>
                <Text style={styles.subjectName}>Chemistry</Text>
                <Text style={styles.subjectProgress}>
                  4 of 10 chapters
                </Text>
              </View>

              <Text style={styles.subjectPercent}>40%</Text>
            </View>

            <View style={styles.subjectRow}>
              <View
                style={[
                  styles.subjectIcon,
                  { backgroundColor: "#193044" },
                ]}
              >
                <Ionicons
                  name="planet-outline"
                  size={17}
                  color={COLORS.blue}
                />
              </View>

              <View style={styles.subjectInfo}>
                <Text style={styles.subjectName}>Physics</Text>
                <Text style={styles.subjectProgress}>
                  2 of 8 chapters
                </Text>
              </View>

              <Text style={styles.subjectPercent}>25%</Text>
            </View>

            <View style={styles.subjectRow}>
              <View
                style={[
                  styles.subjectIcon,
                  { backgroundColor: "#173528" },
                ]}
              >
                <Ionicons
                  name="calculator-outline"
                  size={17}
                  color={COLORS.green}
                />
              </View>

              <View style={styles.subjectInfo}>
                <Text style={styles.subjectName}>
                  Higher Mathematics
                </Text>
                <Text style={styles.subjectProgress}>
                  1 of 2 chapters
                </Text>
              </View>

              <Text style={styles.subjectPercent}>50%</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.outlineAction}
            onPress={handleTrackProgress}
            activeOpacity={0.8}
          >
            <Text style={styles.outlineActionText}>
              View study progress
            </Text>

            <Ionicons
              name="arrow-forward"
              size={16}
              color={COLORS.purpleLight}
            />
          </TouchableOpacity>
        </View>

        {/* GITHUB-STYLE STUDY ACTIVITY */}
        <View style={styles.sectionCard}>
          <View style={styles.activityHeader}>
            <View style={styles.activityHeadingLeft}>
              {renderSectionTitle(
                "YOUR CONSISTENCY",
                "Study Activity",
                "calendar-outline"
              )}

              <Text style={styles.activitySubtitle}>
                Every study session counts.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.trackButton}
              onPress={handleTrackProgress}
              activeOpacity={0.8}
            >
              <Ionicons
                name="analytics-outline"
                size={16}
                color={COLORS.purpleLight}
              />

              <Text style={styles.trackButtonText}>Track</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.githubStats}>
            <View style={styles.githubStatItem}>
              <Text style={styles.githubStatNumber}>0</Text>
              <Text style={styles.githubStatLabel}>
                Study minutes
              </Text>
            </View>

            <View style={styles.githubStatItem}>
              <Text style={styles.githubStatNumber}>0</Text>
              <Text style={styles.githubStatLabel}>
                Active days
              </Text>
            </View>

            <View style={styles.githubStatItem}>
              <Text style={styles.githubStatNumber}>0</Text>
              <Text style={styles.githubStatLabel}>
                Day streak
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.githubGraphScroll}
          >
            <View>
              {/* MONTH LABELS */}
              <View style={styles.githubMonthRow}>
                <View style={styles.githubWeekdaySpacer} />

                {activityWeeks.map((week, index) => {
                  const currentMonth =
                    week[0].date.getMonth();

                  const previousMonth =
                    index > 0
                      ? activityWeeks[index - 1][0].date.getMonth()
                      : -1;

                  const showMonth =
                    index === 0 ||
                    currentMonth !== previousMonth;

                  return (
                    <View
                      key={`month-${index}`}
                      style={styles.githubMonthColumn}
                    >
                      {showMonth && (
                        <Text style={styles.githubMonthLabel}>
                          {MONTHS[currentMonth]}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>

              {/* WEEKDAY LABELS + CONTRIBUTION CELLS */}
              <View style={styles.githubGraphBody}>
                <View style={styles.githubWeekdayColumn}>
                  <Text style={styles.githubWeekdayLabel}>Sun</Text>
                  <Text style={styles.githubWeekdayLabel}>Mon</Text>
                  <Text style={styles.githubWeekdayLabel}>Tue</Text>
                  <Text style={styles.githubWeekdayLabel}>Wed</Text>
                  <Text style={styles.githubWeekdayLabel}>Thu</Text>
                  <Text style={styles.githubWeekdayLabel}>Fri</Text>
                  <Text style={styles.githubWeekdayLabel}>Sat</Text>
                </View>

                <View style={styles.githubWeeks}>
                  {activityWeeks.map((week, weekIndex) => (
                    <View
                      key={`week-${weekIndex}`}
                      style={styles.githubWeekColumn}
                    >
                      {week.map((day) => (
                        <TouchableOpacity
                          key={getDateKey(day.date)}
                          activeOpacity={0.8}
                          accessibilityLabel={`${formatDate(
                            day.date
                          )}, activity level ${day.level}`}
                          onPress={() =>
                            Alert.alert(
                              formatDate(day.date),
                              "This is sample activity data. Connect the study tracker to display actual study sessions."
                            )
                          }
                          style={[
                            styles.githubCell,
                            {
                              backgroundColor:
                                ACTIVITY_COLORS[day.level],
                            },
                          ]}
                        />
                      ))}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.githubLegend}>
            <Text style={styles.githubLegendText}>Less</Text>

            {ACTIVITY_COLORS.map((color, index) => (
              <View
                key={`legend-${index}`}
                style={[
                  styles.githubLegendCell,
                  { backgroundColor: color },
                ]}
              />
            ))}

            <Text style={styles.githubLegendText}>More</Text>
          </View>

          <View style={styles.activityNote}>
            <Ionicons
              name="information-circle-outline"
              size={14}
              color={COLORS.muted}
            />

            <Text style={styles.activityNoteText}>
              Sample graph for now. Connect your study tracker to
              display real activity.
            </Text>
          </View>
        </View>

        {/* COMMUNITY ACTIVITY */}
        <View style={styles.sectionCard}>
          {renderSectionTitle(
            "YOUR COMMUNITY",
            "Community Activity",
            "people-outline"
          )}

          <View style={styles.mainTabs}>
            {(["Forum", "Articles", "Activity"] as const).map(
              (tab) => {
                const selected = activeTab === tab;

                return (
                  <TouchableOpacity
                    key={tab}
                    style={[
                      styles.mainTab,
                      selected && styles.mainTabActive,
                    ]}
                    onPress={() => setActiveTab(tab)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.mainTabText,
                        selected && styles.mainTabTextActive,
                      ]}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>

          {activeTab === "Forum" && (
            <View style={styles.forumSubTabs}>
              {(["Questions", "Answers"] as const).map(
                (tab) => {
                  const selected = activeForumTab === tab;

                  return (
                    <TouchableOpacity
                      key={tab}
                      onPress={() => setActiveForumTab(tab)}
                      style={[
                        styles.forumSubTab,
                        selected && styles.forumSubTabActive,
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.forumSubTabText,
                          selected &&
                            styles.forumSubTabTextActive,
                        ]}
                      >
                        {tab}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>
          )}

          {activeTab === "Forum" &&
            renderEmptyState(
              "chatbubbles-outline",
              activeForumTab === "Questions"
                ? "No questions yet"
                : "No answers yet",
              activeForumTab === "Questions"
                ? "Your forum questions will appear here."
                : "Your forum answers will appear here."
            )}

          {activeTab === "Articles" &&
            renderEmptyState(
              "document-text-outline",
              "No articles yet",
              "Your published articles will appear here."
            )}

          {activeTab === "Activity" &&
            renderEmptyState(
              "pulse-outline",
              "No recent activity",
              "Your recent community activity will appear here."
            )}
        </View>

        {/* DISCOVER PEOPLE — NO FOLLOW BUTTON */}
        <View style={styles.sectionCard}>
          {renderSectionTitle(
            "GROW TOGETHER",
            "Discover People",
            "people-outline"
          )}

          <Text style={styles.discoverSubtitle}>
            Meet other students in the HSC Stack community.
          </Text>

          {PEOPLE.map((person) => {
            const appreciated = appreciatedPeople.includes(
              person.id
            );

            return (
              <View key={person.id} style={styles.personCard}>
                <View
                  style={[
                    styles.personAvatar,
                    { backgroundColor: person.color },
                  ]}
                >
                  <Text
                    style={[
                      styles.personAvatarText,
                      { color: person.textColor },
                    ]}
                  >
                    {person.initial}
                  </Text>
                </View>

                <View style={styles.personInfo}>
                  <Text style={styles.personName}>
                    {person.name}
                  </Text>

                  <Text style={styles.personUsername}>
                    {person.username}
                  </Text>

                  <Text style={styles.personDetail}>
                    {person.detail}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.appreciateButton,
                    appreciated && styles.appreciatedButton,
                  ]}
                  onPress={() =>
                    toggleAppreciation(person.id)
                  }
                  activeOpacity={0.8}
                  accessibilityLabel={
                    appreciated
                      ? `Remove appreciation for ${person.name}`
                      : `Appreciate ${person.name}`
                  }
                >
                  <Ionicons
                    name={appreciated ? "heart" : "heart-outline"}
                    size={16}
                    color={
                      appreciated ? "#F472B6" : COLORS.purpleLight
                    }
                  />
                </TouchableOpacity>
              </View>
            );
          })}

          <Text style={styles.discoverNote}>
            Appreciate helpful contributions from other students.
          </Text>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <View style={styles.footerLogo}>
            <Ionicons
              name="school"
              size={17}
              color={COLORS.purpleLight}
            />
          </View>

          <Text style={styles.footerText}>
            Keep learning. Keep growing.
          </Text>

          <Text style={styles.footerVersion}>
            HSC Stack · Profile
          </Text>
        </View>
      </ScrollView>

      {/* SHARE BUTTON */}
      <TouchableOpacity
        style={styles.shareFab}
        onPress={handleShare}
        activeOpacity={0.85}
        accessibilityLabel="Share profile"
      >
        <Ionicons
          name="share-social-outline"
          size={22}
          color={COLORS.white}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 125,
  },

  // PROFILE
  profileCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
  },

  profileTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 17,
  },

  avatarContainer: {
    width: 78,
    height: 78,
    position: "relative",
  },

  avatar: {
    width: 78,
    height: 78,
    borderRadius: 25,
    backgroundColor: "#49358D",
    borderWidth: 2,
    borderColor: "#8B73F4",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 36,
    color: COLORS.white,
    fontWeight: "800",
  },

  onlineDot: {
    position: "absolute",
    right: 1,
    bottom: 1,
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: COLORS.green,
    borderWidth: 3,
    borderColor: COLORS.card,
  },

  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: COLORS.cardLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 11,
  },

  editButtonText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 7,
  },

  profileName: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  username: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 5,
  },

  collegeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },

  collegeText: {
    color: "#C3CBD5",
    fontSize: 12,
  },

  bio: {
    color: "#C9D1D9",
    fontSize: 13,
    lineHeight: 21,
    marginTop: 17,
  },

  // SOCIAL LINKS
  socialHeading: {
    color: COLORS.purpleLight,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginTop: 19,
    marginBottom: 10,
  },

  socialLinksRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  socialLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.cardLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 9,
    paddingVertical: 9,
    borderRadius: 9,
  },

  socialLinkText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: "600",
  },

  // SOCIAL LINK EDITOR
  linkEditor: {
    marginTop: 17,
    padding: 13,
    borderRadius: 13,
    backgroundColor: "#111720",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  editorTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 14,
  },

  inputLabel: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 5,
  },

  linkInput: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 10,
    color: COLORS.text,
    fontSize: 12,
    marginBottom: 9,
  },

  saveLinksButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#7453D8",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 6,
  },

  saveLinksButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "800",
  },

  // APPRECIATORS / APPRECIATING
  profileStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginTop: 19,
    paddingVertical: 16,
  },

  profileStat: {
    flex: 1,
    alignItems: "center",
  },

  profileStatNumber: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: "800",
  },

  profileStatLabel: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 5,
    textAlign: "center",
  },

  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.border,
  },

  joinedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 15,
  },

  joinedText: {
    color: COLORS.muted,
    fontSize: 11,
  },

  // SECTION CARDS
  sectionCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
  },

  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  sectionIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "#29213F",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionHeadingText: {
    flex: 1,
  },

  sectionEyebrow: {
    color: COLORS.purpleLight,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 4,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
  },

  // SYLLABUS
  progressSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22,
    marginBottom: 15,
  },

  progressPercent: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1,
  },

  progressCaption: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },

  progressRight: {
    alignItems: "flex-end",
    gap: 8,
  },

  progressBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#183427",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
  },

  progressBadgeText: {
    color: COLORS.green,
    fontSize: 10,
    fontWeight: "700",
  },

  progressSmallText: {
    color: COLORS.muted,
    fontSize: 10,
  },

  progressTrack: {
    height: 8,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#29313D",
  },

  progressFill: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: COLORS.purple,
  },

  subjectList: {
    marginTop: 16,
    gap: 5,
  },

  subjectRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  subjectIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  subjectInfo: {
    flex: 1,
  },

  subjectName: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
  },

  subjectProgress: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 4,
  },

  subjectPercent: {
    color: "#D5C8FF",
    fontSize: 12,
    fontWeight: "800",
  },

  outlineAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    borderWidth: 1,
    borderColor: "#51427E",
    backgroundColor: "#211B35",
    borderRadius: 11,
    paddingVertical: 12,
    marginTop: 15,
  },

  outlineActionText: {
    color: COLORS.purpleLight,
    fontSize: 12,
    fontWeight: "700",
  },

  // STUDY ACTIVITY
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  activityHeadingLeft: {
    flex: 1,
  },

  activitySubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 9,
    marginLeft: 50,
  },

  trackButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: "#51427E",
    backgroundColor: "#211B35",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 9,
    marginLeft: 8,
  },

  trackButtonText: {
    color: COLORS.purpleLight,
    fontSize: 11,
    fontWeight: "700",
  },

  githubStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 17,
    marginTop: 17,
    marginBottom: 17,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },

  githubStatItem: {
    flex: 1,
    alignItems: "flex-start",
  },

  githubStatNumber: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: "800",
  },

  githubStatLabel: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 5,
  },

  githubGraphScroll: {
    paddingBottom: 5,
  },

  githubMonthRow: {
    height: 24,
    flexDirection: "row",
    marginBottom: 7,
  },

  githubWeekdaySpacer: {
    width: 35,
  },

  githubMonthColumn: {
    width: 13,
    overflow: "visible",
  },

  githubMonthLabel: {
    width: 39,
    color: COLORS.muted,
    fontSize: 10,
  },

  githubGraphBody: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  githubWeekdayColumn: {
    width: 35,
    height: 91,
    justifyContent: "space-between",
    paddingRight: 5,
  },

  githubWeekdayLabel: {
    color: COLORS.muted,
    fontSize: 9,
    height: 11,
  },

  githubWeeks: {
    flexDirection: "row",
    gap: 3,
  },

  githubWeekColumn: {
    gap: 3,
  },

  githubCell: {
    width: 10,
    height: 10,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.025)",
  },

  githubLegend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 5,
    marginTop: 17,
  },

  githubLegendText: {
    color: COLORS.muted,
    fontSize: 10,
    marginHorizontal: 3,
  },

  githubLegendCell: {
    width: 11,
    height: 11,
    borderRadius: 2,
  },

  activityNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 15,
  },

  activityNoteText: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 15,
    flex: 1,
  },

  // COMMUNITY TABS
  mainTabs: {
    flexDirection: "row",
    backgroundColor: "#10151C",
    borderRadius: 12,
    padding: 4,
    marginTop: 20,
  },

  mainTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 9,
  },

  mainTabActive: {
    backgroundColor: "#30254C",
  },

  mainTabText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "600",
  },

  mainTabTextActive: {
    color: COLORS.purpleLight,
    fontWeight: "800",
  },

  forumSubTabs: {
    flexDirection: "row",
    gap: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginTop: 17,
  },

  forumSubTab: {
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },

  forumSubTabActive: {
    borderBottomColor: COLORS.purple,
  },

  forumSubTabText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "600",
  },

  forumSubTabTextActive: {
    color: COLORS.text,
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 15,
  },

  emptyIconCircle: {
    width: 57,
    height: 57,
    borderRadius: 20,
    backgroundColor: "#29213F",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  emptyTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },

  emptyDescription: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 7,
    maxWidth: 260,
  },

  // DISCOVER PEOPLE
  discoverSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 9,
    marginBottom: 12,
  },

  personCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#111720",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 11,
    marginTop: 9,
  },

  personAvatar: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  personAvatarText: {
    fontSize: 20,
    fontWeight: "800",
  },

  personInfo: {
    flex: 1,
    minWidth: 0,
  },

  personName: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "800",
  },

  personUsername: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 3,
  },

  personDetail: {
    color: "#A6B0BE",
    fontSize: 9,
    marginTop: 5,
  },

  appreciateButton: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#211B35",
    borderWidth: 1,
    borderColor: "#51427E",
  },

  appreciatedButton: {
    backgroundColor: "#3A1E32",
    borderColor: "#854064",
  },

  discoverNote: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 14,
  },

  // FOOTER
  footer: {
    alignItems: "center",
    paddingVertical: 14,
    gap: 7,
  },

  footerLogo: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: "#29213F",
    alignItems: "center",
    justifyContent: "center",
  },

  footerText: {
    color: "#C3CBD5",
    fontSize: 11,
    fontWeight: "600",
  },

  footerVersion: {
    color: COLORS.muted,
    fontSize: 9,
  },

  // SHARE BUTTON
  shareFab: {
    position: "absolute",
    right: 19,
    bottom: 24,
    width: 53,
    height: 53,
    borderRadius: 19,
    backgroundColor: "#7453D8",
    borderWidth: 1,
    borderColor: "#9A83F5",
    alignItems: "center",
    justifyContent: "center",
    elevation: 7,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 7,
  },
});