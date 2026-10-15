import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useAppTheme } from "@/theme/ThemeProvider";

/* ---------------------------------- Types --------------------------------- */

type Department = "বিজ্ঞান" | "মানবিক" | "ব্যবসায় শিক্ষা";
type Repository = "HSC" | "Admission" | "SSC";

type Subject = {
  id: string;
  title: string;
  chapters: number;
  icon: keyof typeof Ionicons.glyphMap;
};

type Discussion = {
  id: string;
  category: string;
  status: "Answered" | "Discussion";
  title: string;
  preview: string;
  author: string;
  time: string;
  answers: number;
  score: number;
};

type Blog = {
  id: string;
  category: string;
  title: string;
  author: string;
  time: string;
  likes: number;
  comments: number;
  views: string;
  icon: keyof typeof Ionicons.glyphMap;
};

/* ------------------------------- Static data ------------------------------ */

const departments: Department[] = [
  "বিজ্ঞান",
  "মানবিক",
  "ব্যবসায় শিক্ষা",
];

const repositories: Repository[] = ["HSC", "Admission", "SSC"];

const subjectData: Record<Department, Subject[]> = {
  বিজ্ঞান: [
    {
      id: "sci-hmath-1",
      title: "উচ্চতর গণিত ১ম পত্র",
      chapters: 10,
      icon: "calculator-outline",
    },
    {
      id: "sci-hmath-2",
      title: "উচ্চতর গণিত ২য় পত্র",
      chapters: 10,
      icon: "infinite-outline",
    },
    {
      id: "sci-phy-1",
      title: "পদার্থবিজ্ঞান ১ম পত্র",
      chapters: 10,
      icon: "planet-outline",
    },
    {
      id: "sci-chem-1",
      title: "রসায়ন ১ম পত্র",
      chapters: 5,
      icon: "flask-outline",
    },
    {
      id: "sci-bio-1",
      title: "জীববিজ্ঞান ১ম পত্র",
      chapters: 12,
      icon: "leaf-outline",
    },
    {
      id: "sci-ict",
      title: "তথ্য ও যোগাযোগ প্রযুক্তি",
      chapters: 6,
      icon: "laptop-outline",
    },
  ],

  মানবিক: [
    {
      id: "hum-bangla-1",
      title: "বাংলা ১ম পত্র",
      chapters: 12,
      icon: "book-outline",
    },
    {
      id: "hum-bangla-2",
      title: "বাংলা ২য় পত্র",
      chapters: 10,
      icon: "create-outline",
    },
    {
      id: "hum-history",
      title: "ইতিহাস",
      chapters: 10,
      icon: "time-outline",
    },
    {
      id: "hum-civics",
      title: "পৌরনীতি ও সুশাসন",
      chapters: 10,
      icon: "people-outline",
    },
    {
      id: "hum-geo",
      title: "ভূগোল",
      chapters: 10,
      icon: "earth-outline",
    },
  ],

  "ব্যবসায় শিক্ষা": [
    {
      id: "biz-acc-1",
      title: "হিসাববিজ্ঞান ১ম পত্র",
      chapters: 10,
      icon: "calculator-outline",
    },
    {
      id: "biz-org",
      title: "ব্যবসায় সংগঠন ও ব্যবস্থাপনা",
      chapters: 10,
      icon: "briefcase-outline",
    },
    {
      id: "biz-fin",
      title: "ফিন্যান্স, ব্যাংকিং ও বিমা",
      chapters: 10,
      icon: "wallet-outline",
    },
    {
      id: "biz-ict",
      title: "তথ্য ও যোগাযোগ প্রযুক্তি",
      chapters: 6,
      icon: "laptop-outline",
    },
  ],
};

const admissionSubjects: Subject[] = [
  {
    id: "adm-bangla",
    title: "বাংলা প্রস্তুতি",
    chapters: 12,
    icon: "book-outline",
  },
  {
    id: "adm-english",
    title: "English Preparation",
    chapters: 10,
    icon: "language-outline",
  },
  {
    id: "adm-gk",
    title: "সাধারণ জ্ঞান",
    chapters: 15,
    icon: "globe-outline",
  },
  {
    id: "adm-subject",
    title: "বিষয়ভিত্তিক প্রশ্ন",
    chapters: 20,
    icon: "help-circle-outline",
  },
];

const sscSubjects: Subject[] = [
  {
    id: "ssc-math",
    title: "গণিত",
    chapters: 17,
    icon: "calculator-outline",
  },
  {
    id: "ssc-sci",
    title: "বিজ্ঞান",
    chapters: 14,
    icon: "flask-outline",
  },
  {
    id: "ssc-bangla",
    title: "বাংলা",
    chapters: 12,
    icon: "book-outline",
  },
  {
    id: "ssc-ict",
    title: "তথ্য ও যোগাযোগ প্রযুক্তি",
    chapters: 6,
    icon: "laptop-outline",
  },
];

const discussions: Discussion[] = [
  {
    id: "d1",
    category: "বাংলা ২য় পত্র",
    status: "Answered",
    title: "সমাস সহজে চেনার কোনো সহজ নিয়ম আছে?",
    preview:
      "পরীক্ষার আগে সমাসের প্রকারভেদ মনে রাখার ভালো উপায় জানতে চাই।",
    author: "Study Partner",
    time: "4d ago",
    answers: 3,
    score: 12,
  },
  {
    id: "d2",
    category: "HSC",
    status: "Discussion",
    title: "পদার্থবিজ্ঞানের ভেক্টর অধ্যায় কীভাবে পড়ব?",
    preview:
      "গাণিতিক সমস্যাগুলো অনুশীলন করার জন্য কোনো study routine সাজেস্ট করবে?",
    author: "HSC Learner",
    time: "1d ago",
    answers: 5,
    score: 8,
  },
];

const blogs: Blog[] = [
  {
    id: "b1",
    category: "STUDY TIPS",
    title: "HSC পরীক্ষার জন্য কার্যকর Study Routine তৈরির উপায়",
    author: "HSCStack Team",
    time: "2d ago",
    likes: 24,
    comments: 6,
    views: "1.2k",
    icon: "calendar-outline",
  },
  {
    id: "b2",
    category: "GUIDE",
    title: "শেষ মুহূর্তের Revision আরও কার্যকর করবে যেভাবে",
    author: "HSCStack Team",
    time: "5d ago",
    likes: 18,
    comments: 4,
    views: "860",
    icon: "book-outline",
  },
];

/* --------------------------------- Screen --------------------------------- */

export default function HomeScreen() {
  const { colors, isDark } = useAppTheme();

  const [repository, setRepository] = useState<Repository>("HSC");
  const [repositoryMenuOpen, setRepositoryMenuOpen] = useState(false);

  const [department, setDepartment] =
    useState<Department>("বিজ্ঞান");

  const [voted, setVoted] = useState<
    Record<string, "up" | "down" | undefined>
  >({});

  const subjects = useMemo<Subject[]>(() => {
    if (repository === "Admission") {
      return admissionSubjects;
    }

    if (repository === "SSC") {
      return sscSubjects;
    }

    return subjectData[department];
  }, [repository, department]);

  const openSubject = (subject: Subject) => {
    Alert.alert(
      subject.title,
      `Subject ID: ${subject.id}\n\nChapter screen navigation can be connected when ready.`
    );
  };

  const openRoute = (path: "/forum" | "/blog" | "/profile") => {
    router.navigate(path);
  };

  const surface = colors.surface;
  const border = colors.border;
  const muted = colors.textMuted;
  const primary = colors.primary;

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: colors.background },
      ]}
      edges={["top", "left", "right"]}
    >
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top navigation: brand only */}

        <View style={styles.header}>
          <View style={styles.brand}>
            <View
              style={[
                styles.brandIcon,
                { backgroundColor: primary },
              ]}
            >
              <Ionicons
                name="school-outline"
                size={21}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.brandTextWrap}>
              <Text
                style={[
                  styles.brandTitle,
                  { color: colors.text },
                ]}
              >
                HSCStack
              </Text>

              <Text
                style={[
                  styles.brandSubtitle,
                  { color: muted },
                ]}
              >
                Learn together
              </Text>
            </View>
          </View>
        </View>

        {/* Hero */}

        <View style={styles.hero}>
          <View
            style={[
              styles.eyebrow,
              { backgroundColor: colors.softPrimary },
            ]}
          >
            <Ionicons
              name="sparkles-outline"
              size={14}
              color={primary}
            />

            <Text
              style={[
                styles.eyebrowText,
                { color: primary },
              ]}
            >
              YOUR LEARNING COMMUNITY
            </Text>
          </View>

          <Text
            style={[
              styles.heroTitle,
              { color: colors.text },
            ]}
          >
            Everything You Need,{"\n"}
            <Text style={{ color: primary }}>
              Together with Peers
            </Text>
          </Text>

          <Text
            style={[
              styles.heroDescription,
              { color: muted },
            ]}
          >
            পড়াশোনা, resources আর discussion—সবকিছু এক
            জায়গায়, তোমার HSC journey-র জন্য।
          </Text>

          {/* Repository selector */}

          <View style={styles.repoWrapper}>
            <Text
              style={[
                styles.fieldLabel,
                { color: muted },
              ]}
            >
              ACTIVE REPOSITORY
            </Text>

            <Pressable
              onPress={() =>
                setRepositoryMenuOpen((open) => !open)
              }
              style={[
                styles.repositoryCard,
                {
                  backgroundColor: surface,
                  borderColor: border,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Select repository"
            >
              <View
                style={[
                  styles.repositoryIcon,
                  { backgroundColor: colors.softPrimary },
                ]}
              >
                <Ionicons
                  name="library-outline"
                  size={22}
                  color={primary}
                />
              </View>

              <View style={styles.repositoryInfo}>
                <Text
                  style={[
                    styles.repositoryTitle,
                    { color: colors.text },
                  ]}
                >
                  {repository}
                </Text>

                <Text
                  style={[
                    styles.repositorySubtitle,
                    { color: muted },
                  ]}
                >
                  {repository === "HSC"
                    ? "আপনি HSC এর কন্টেন্টগুলো দেখছেন"
                    : repository === "SSC"
                    ? "আপনি SSC এর কন্টেন্টগুলো দেখছেন"
                    : "আপনি Admission প্রস্তুতির কন্টেন্ট দেখছেন"}
                </Text>
              </View>

              <Ionicons
                name={
                  repositoryMenuOpen
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={20}
                color={muted}
              />
            </Pressable>

            {repositoryMenuOpen && (
              <View
                style={[
                  styles.repositoryMenu,
                  {
                    backgroundColor: surface,
                    borderColor: border,
                  },
                ]}
              >
                {repositories.map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => {
                      setRepository(item);
                      setRepositoryMenuOpen(false);
                    }}
                    style={[
                      styles.repositoryOption,
                      item === repository && {
                        backgroundColor: colors.softPrimary,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.repositoryOptionText,
                        {
                          color:
                            item === repository
                              ? primary
                              : colors.text,
                        },
                      ]}
                    >
                      {item}
                    </Text>

                    {item === repository && (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={primary}
                      />
                    )}
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Subject directory */}

        <SectionHeading
          title="Subject Directory"
          subtitle="তোমার প্রয়োজনীয় subject বেছে নাও"
          colors={colors}
        />

        {repository === "HSC" && (
          <View style={styles.departmentArea}>
            <Text
              style={[
                styles.fieldLabel,
                { color: muted },
              ]}
            >
              বিভাগ:
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsRow}
            >
              {departments.map((item) => {
                const active = item === department;

                return (
                  <Pressable
                    key={item}
                    onPress={() => setDepartment(item)}
                    style={[
                      styles.departmentChip,
                      {
                        backgroundColor: active
                          ? primary
                          : surface,
                        borderColor: active
                          ? primary
                          : border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.departmentChipText,
                        {
                          color: active
                            ? "#FFFFFF"
                            : colors.text,
                        },
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View style={styles.subjectList}>
          {subjects.map((subject) => (
            <Pressable
              key={subject.id}
              onPress={() => openSubject(subject)}
              style={({ pressed }) => [
                styles.subjectCard,
                {
                  backgroundColor: surface,
                  borderColor: border,
                  opacity: pressed ? 0.82 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.subjectIcon,
                  { backgroundColor: colors.softPrimary },
                ]}
              >
                <Ionicons
                  name={subject.icon}
                  size={22}
                  color={primary}
                />
              </View>

              <View style={styles.subjectInfo}>
                <Text
                  style={[
                    styles.subjectTitle,
                    { color: colors.text },
                  ]}
                >
                  {subject.title}
                </Text>

                <Text
                  style={[
                    styles.subjectSubtitle,
                    { color: muted },
                  ]}
                >
                  {subject.chapters} Chapters
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={19}
                color={muted}
              />
            </Pressable>
          ))}
        </View>

        {/* Sponsored banner */}

        <View
          style={[
            styles.adBanner,
            {
              backgroundColor: isDark
                ? "#29213F"
                : "#F0ECFF",
              borderColor: isDark
                ? "#45366B"
                : "#E2DAFF",
            },
          ]}
        >
          <View style={styles.adTopRow}>
            <View
              style={[
                styles.sponsoredBadge,
                {
                  backgroundColor: isDark
                    ? "#45366B"
                    : "#DED5FF",
                },
              ]}
            >
              <Ionicons
                name="megaphone-outline"
                size={12}
                color={primary}
              />

              <Text
                style={[
                  styles.sponsoredText,
                  { color: primary },
                ]}
              >
                SPONSORED
              </Text>
            </View>

            <Ionicons
              name="open-outline"
              size={17}
              color={primary}
            />
          </View>

          <Text
            style={[
              styles.adTitle,
              { color: colors.text },
            ]}
          >
            Your Ad Goes Here
          </Text>

          <Text
            style={[
              styles.adDescription,
              { color: muted },
            ]}
          >
            Reach students and promote your education-focused
            service on HSCStack.
          </Text>

          <Pressable
            onPress={() =>
              Alert.alert(
                "Book Ad Space",
                "Advertising enquiries can be connected to your contact page or website."
              )
            }
            style={[
              styles.adButton,
              { backgroundColor: primary },
            ]}
          >
            <Text style={styles.adButtonText}>
              Book Ad Space
            </Text>

            <Ionicons
              name="arrow-up-right"
              size={16}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        {/* Trending discussions */}

        <SectionHeading
          title="Trending Discussions"
          subtitle="শিক্ষার্থীরা এখন যেসব বিষয়ে আলোচনা করছে"
          colors={colors}
          action="Visit Forum"
          onAction={() => openRoute("/forum")}
        />

        {discussions.map((post) => {
          const currentVote = voted[post.id];

          const score =
            post.score +
            (currentVote === "up"
              ? 1
              : currentVote === "down"
              ? -1
              : 0);

          return (
            <View
              key={post.id}
              style={[
                styles.discussionCard,
                {
                  backgroundColor: surface,
                  borderColor: border,
                },
              ]}
            >
              <View style={styles.voteColumn}>
                <Pressable
                  onPress={() =>
                    setVoted((previous) => ({
                      ...previous,
                      [post.id]:
                        currentVote === "up"
                          ? undefined
                          : "up",
                    }))
                  }
                  accessibilityRole="button"
                  accessibilityLabel="Upvote discussion"
                  hitSlop={8}
                >
                  <Ionicons
                    name={
                      currentVote === "up"
                        ? "arrow-up-circle"
                        : "arrow-up-circle-outline"
                    }
                    size={25}
                    color={
                      currentVote === "up"
                        ? primary
                        : muted
                    }
                  />
                </Pressable>

                <Text
                  style={[
                    styles.voteScore,
                    { color: colors.text },
                  ]}
                >
                  {score}
                </Text>

                <Pressable
                  onPress={() =>
                    setVoted((previous) => ({
                      ...previous,
                      [post.id]:
                        currentVote === "down"
                          ? undefined
                          : "down",
                    }))
                  }
                  accessibilityRole="button"
                  accessibilityLabel="Downvote discussion"
                  hitSlop={8}
                >
                  <Ionicons
                    name={
                      currentVote === "down"
                        ? "arrow-down-circle"
                        : "arrow-down-circle-outline"
                    }
                    size={25}
                    color={
                      currentVote === "down"
                        ? primary
                        : muted
                    }
                  />
                </Pressable>
              </View>

              <View style={styles.discussionBody}>
                <View style={styles.tagRow}>
                  <Text
                    style={[
                      styles.tag,
                      {
                        color: primary,
                        backgroundColor: colors.softPrimary,
                      },
                    ]}
                  >
                    {post.category}
                  </Text>

                  <Text
                    style={[
                      styles.tag,
                      {
                        color:
                          post.status === "Answered"
                            ? "#16845B"
                            : muted,
                        backgroundColor:
                          post.status === "Answered"
                            ? isDark
                              ? "#173A30"
                              : "#E5F7EF"
                            : colors.background,
                      },
                    ]}
                  >
                    {post.status}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.discussionTitle,
                    { color: colors.text },
                  ]}
                >
                  {post.title}
                </Text>

                <Text
                  style={[
                    styles.discussionPreview,
                    { color: muted },
                  ]}
                  numberOfLines={2}
                >
                  {post.preview}
                </Text>

                <View style={styles.discussionFooter}>
                  <View style={styles.authorInfo}>
                    <View
                      style={[
                        styles.miniAvatar,
                        {
                          backgroundColor: colors.softPrimary,
                        },
                      ]}
                    >
                      <Ionicons
                        name="person"
                        size={12}
                        color={primary}
                      />
                    </View>

                    <Text
                      style={[
                        styles.metaText,
                        { color: muted },
                      ]}
                      numberOfLines={1}
                    >
                      {post.author} · {post.time}
                    </Text>
                  </View>

                  <View style={styles.answerCount}>
                    <Ionicons
                      name="chatbubble-ellipses-outline"
                      size={14}
                      color={muted}
                    />

                    <Text
                      style={[
                        styles.metaText,
                        { color: muted },
                      ]}
                    >
                      {post.answers} answers
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        <Pressable
          onPress={() => openRoute("/forum")}
          style={[
            styles.outlineLink,
            {
              borderColor: border,
              backgroundColor: surface,
            },
          ]}
        >
          <Text
            style={[
              styles.outlineLinkText,
              { color: primary },
            ]}
          >
            Visit Forum
          </Text>

          <Ionicons
            name="arrow-forward"
            size={17}
            color={primary}
          />
        </Pressable>

        {/* Featured blogs */}

        <SectionHeading
          title="Featured Blogs"
          subtitle="পড়াশোনায় কাজে লাগবে এমন লেখা"
          colors={colors}
          action="See all articles"
          onAction={() => openRoute("/blog")}
        />

        {blogs.map((blog) => (
          <Pressable
            key={blog.id}
            onPress={() => openRoute("/blog")}
            style={({ pressed }) => [
              styles.blogCard,
              {
                backgroundColor: surface,
                borderColor: border,
                opacity: pressed ? 0.84 : 1,
              },
            ]}
          >
            <View
              style={[
                styles.blogThumbnail,
                { backgroundColor: colors.softPrimary },
              ]}
            >
              <Ionicons
                name={blog.icon}
                size={30}
                color={primary}
              />
            </View>

            <View style={styles.blogBody}>
              <Text
                style={[
                  styles.blogCategory,
                  { color: primary },
                ]}
              >
                {blog.category}
              </Text>

              <Text
                style={[
                  styles.blogTitle,
                  { color: colors.text },
                ]}
                numberOfLines={2}
              >
                {blog.title}
              </Text>

              <Text
                style={[
                  styles.metaText,
                  { color: muted },
                ]}
              >
                {blog.author} · {blog.time}
              </Text>

              <View style={styles.blogStats}>
                <Stat
                  icon="heart-outline"
                  value={String(blog.likes)}
                  color={muted}
                />

                <Stat
                  icon="chatbubble-outline"
                  value={String(blog.comments)}
                  color={muted}
                />

                <Stat
                  icon="eye-outline"
                  value={blog.views}
                  color={muted}
                />
              </View>
            </View>
          </Pressable>
        ))}

        <Pressable
          onPress={() => openRoute("/blog")}
          style={[
            styles.outlineLink,
            {
              borderColor: border,
              backgroundColor: surface,
            },
          ]}
        >
          <Text
            style={[
              styles.outlineLinkText,
              { color: primary },
            ]}
          >
            See all articles
          </Text>

          <Ionicons
            name="arrow-forward"
            size={17}
            color={primary}
          />
        </Pressable>

        <Text
          style={[
            styles.bottomNote,
            { color: muted },
          ]}
        >
          Made for learners, built for learning.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ------------------------------ Sub-components ---------------------------- */

function SectionHeading({
  title,
  subtitle,
  colors,
  action,
  onAction,
}: {
  title: string;
  subtitle: string;
  colors: ReturnType<typeof useAppTheme>["colors"];
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeading}>
      <View style={styles.sectionHeadingText}>
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.sectionSubtitle,
            { color: colors.textMuted },
          ]}
        >
          {subtitle}
        </Text>
      </View>

      {action && onAction ? (
        <Pressable
          onPress={onAction}
          style={styles.sectionAction}
          accessibilityRole="button"
          accessibilityLabel={action}
        >
          <Text
            style={[
              styles.sectionActionText,
              { color: colors.primary },
            ]}
          >
            {action}
          </Text>

          <Ionicons
            name="arrow-forward"
            size={14}
            color={colors.primary}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

function Stat({
  icon,
  value,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  color: string;
}) {
  return (
    <View style={styles.statItem}>
      <Ionicons name={icon} size={14} color={color} />

      <Text style={[styles.metaText, { color }]}>
        {value}
      </Text>
    </View>
  );
}

/* --------------------------------- Styles --------------------------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 36,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    gap: 10,
  },

  brand: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  brandIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  brandTextWrap: {
    flexShrink: 1,
  },

  brandTitle: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  brandSubtitle: {
    fontSize: 10,
    marginTop: 2,
  },

  hero: {
    marginBottom: 28,
  },

  eyebrow: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 14,
  },

  eyebrowText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  heroTitle: {
    fontSize: 29,
    lineHeight: 36,
    fontWeight: "900",
    letterSpacing: -0.8,
  },

  heroDescription: {
    fontSize: 13,
    lineHeight: 21,
    marginTop: 10,
  },

  repoWrapper: {
    marginTop: 22,
    zIndex: 2,
  },

  fieldLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.9,
    marginBottom: 9,
  },

  repositoryCard: {
    minHeight: 78,
    borderRadius: 18,
    borderWidth: 1,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  repositoryIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  repositoryInfo: {
    flex: 1,
    minWidth: 0,
  },

  repositoryTitle: {
    fontSize: 16,
    fontWeight: "800",
  },

  repositorySubtitle: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },

  repositoryMenu: {
    marginTop: 6,
    borderRadius: 15,
    borderWidth: 1,
    overflow: "hidden",
  },

  repositoryOption: {
    minHeight: 46,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  repositoryOptionText: {
    fontSize: 13,
    fontWeight: "700",
  },

  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 15,
    marginTop: 4,
  },

  sectionHeadingText: {
    flex: 1,
    minWidth: 0,
  },

  sectionTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  sectionSubtitle: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
  },

  sectionAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  sectionActionText: {
    fontSize: 11,
    fontWeight: "700",
  },

  departmentArea: {
    marginBottom: 13,
  },

  chipsRow: {
    gap: 8,
    paddingBottom: 2,
  },

  departmentChip: {
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  departmentChipText: {
    fontSize: 12,
    fontWeight: "700",
  },

  subjectList: {
    gap: 10,
    marginBottom: 27,
  },

  subjectCard: {
    minHeight: 76,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  subjectIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  subjectInfo: {
    flex: 1,
    minWidth: 0,
  },

  subjectTitle: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
  },

  subjectSubtitle: {
    fontSize: 11,
    marginTop: 4,
  },

  adBanner: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 17,
    marginBottom: 30,
  },

  adTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sponsoredBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  sponsoredText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  adTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 15,
  },

  adDescription: {
    fontSize: 12,
    lineHeight: 19,
    marginTop: 6,
  },

  adButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 11,
    marginTop: 15,
  },

  adButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  discussionCard: {
    borderWidth: 1,
    borderRadius: 17,
    padding: 13,
    flexDirection: "row",
    gap: 11,
    marginBottom: 11,
  },

  voteColumn: {
    alignItems: "center",
    gap: 3,
    paddingTop: 2,
  },

  voteScore: {
    fontSize: 12,
    fontWeight: "800",
  },

  discussionBody: {
    flex: 1,
    minWidth: 0,
  },

  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 9,
  },

  tag: {
    overflow: "hidden",
    fontSize: 9,
    fontWeight: "800",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },

  discussionTitle: {
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 19,
  },

  discussionPreview: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },

  discussionFooter: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 12,
  },

  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexShrink: 1,
  },

  miniAvatar: {
    width: 22,
    height: 22,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  metaText: {
    fontSize: 9,
    lineHeight: 14,
  },

  answerCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  outlineLink: {
    minHeight: 44,
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 2,
    marginBottom: 29,
  },

  outlineLinkText: {
    fontSize: 12,
    fontWeight: "800",
  },

  blogCard: {
    borderWidth: 1,
    borderRadius: 17,
    padding: 12,
    flexDirection: "row",
    gap: 12,
    marginBottom: 11,
  },

  blogThumbnail: {
    width: 84,
    minHeight: 104,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  blogBody: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },

  blogCategory: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginBottom: 5,
  },

  blogTitle: {
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
  },

  blogStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginTop: 10,
  },

  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  bottomNote: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 14,
  },
});