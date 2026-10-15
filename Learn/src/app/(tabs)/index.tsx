import { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { useAppTheme } from "@/theme/ThemeProvider";

import HomeHeader from "@/components/home/HomeHeader";
import HomeHero from "@/components/home/HomeHero";
import RepositorySelector from "@/components/home/RepositorySelector";
import SubjectDirectory from "@/components/home/SubjectDirectory";
import SponsoredBanner from "@/components/home/SponsoredBanner";
import SectionHeading from "@/components/home/SectionHeading";
import DiscussionCard from "@/components/home/DiscussionCard";
import BlogCard from "@/components/home/BlogCard";

import {
  departments,
  repositories,
  subjectData,
  admissionSubjects,
  sscSubjects,
  discussions,
  blogs,
} from "@/data/homeData";

import type {
  Department,
  Repository,
  Vote,
} from "@/types/home";

export default function HomeScreen() {
  const { colors } = useAppTheme();

  const [repository, setRepository] =
    useState<Repository>("HSC");

  const [department, setDepartment] =
    useState<Department>("বিজ্ঞান");

  const [voted, setVoted] = useState<
    Record<string, Vote | undefined>
  >({});

  // Select subjects according to repository and department.
  const subjects = useMemo(() => {
    if (repository === "HSC") {
      return subjectData[department] ?? [];
    }

    if (repository === "Admission") {
      return admissionSubjects;
    }

    return sscSubjects;
  }, [repository, department]);

  // Open a subject.
  const openSubject = (subjectId: string) => {
    Alert.alert(
      "Subject Selected",
      `Subject ID: ${subjectId}\n\nChapter navigation will be connected here.`
    );
  };

  // Navigate to other app pages.
  const openRoute = (path: "/forum" | "/blog" | "/profile") => {
    router.navigate(path);
  };

  // Handle discussion voting.
  const handleVote = (
    postId: string,
    nextVote: Vote | undefined
  ) => {
    setVoted((previous) => ({
      ...previous,
      [postId]: nextVote,
    }));
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: colors.background },
      ]}
      edges={["top", "left", "right"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <HomeHeader />

        {/* Hero section */}
        <HomeHero />

        {/* Repository selector */}
        <RepositorySelector
          value={repository}
          onChange={setRepository}
        />

        {/* Subject directory */}
        <SubjectDirectory
          repository={repository}
          department={department}
          onDepartmentChange={setDepartment}
          subjects={subjects}
          onSubjectPress={openSubject}
        />

        {/* Sponsored banner */}
        <SponsoredBanner />

        {/* Trending discussions */}
        <SectionHeading
          title="Trending Discussions"
          subtitle="Learn together and help each other"
        />

        {discussions.map((post) => (
          <DiscussionCard
            key={post.id}
            post={post}
            vote={voted[post.id]}
            onVote={(nextVote) =>
              handleVote(post.id, nextVote)
            }
          />
        ))}

        <Pressable
          onPress={() => openRoute("/forum")}
          style={({ pressed }) => [
            styles.outlineLink,
            {
              borderColor: colors.border,
              backgroundColor: colors.surface,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.outlineLinkText,
              { color: colors.primary },
            ]}
          >
            Explore All Discussions →
          </Text>
        </Pressable>

        {/* Featured blogs */}
        <SectionHeading
          title="Featured Blogs"
          subtitle="Ideas, guides and stories from students"
        />

        {blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            onPress={() => openRoute("/blog")}
          />
        ))}

        <Pressable
          onPress={() => openRoute("/blog")}
          style={({ pressed }) => [
            styles.outlineLink,
            {
              borderColor: colors.border,
              backgroundColor: colors.surface,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.outlineLinkText,
              { color: colors.primary },
            ]}
          >
            Read All Blogs →
          </Text>
        </Pressable>

        {/* Footer */}
        <Text
          style={[
            styles.bottomNote,
            { color: colors.textMuted },
          ]}
        >
          Made for students, powered by community ❤️
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 32,
  },

  outlineLink: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    marginBottom: 29,
    paddingHorizontal: 16,
  },

  outlineLinkText: {
    fontSize: 14,
    fontWeight: "700",
  },

  bottomNote: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 2,
    marginBottom: 8,
  },
});