import { useEffect, useRef, useState } from "react";

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

import { useAppTheme } from "@/theme/ThemeProvider";

type Chapter = {
  id: string;
  title: string;
  subject: string;
};

const CHAPTERS: Chapter[] = [
  { id: "p1", title: "Vector", subject: "Physics" },
  { id: "p2", title: "Motion", subject: "Physics" },
  { id: "p3", title: "Newtonian Mechanics", subject: "Physics" },
  { id: "p4", title: "Work, Energy and Power", subject: "Physics" },

  { id: "c1", title: "Atomic Structure", subject: "Chemistry" },
  { id: "c2", title: "Periodic Properties", subject: "Chemistry" },
  { id: "c3", title: "Chemical Bonding", subject: "Chemistry" },

  { id: "m1", title: "Functions and Graphs", subject: "Math" },
  { id: "m2", title: "Straight Line", subject: "Math" },
  { id: "m3", title: "Trigonometry", subject: "Math" },

  { id: "b1", title: "Cell and Its Structure", subject: "Biology" },
  { id: "b2", title: "Cell Division", subject: "Biology" },
];

const SUBJECTS = ["All", "Physics", "Chemistry", "Math", "Biology"];

type Session = {
  id: string;
  seconds: number;
  date: string;
};

function formatTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes
    ? `${hours}h ${remainingMinutes}m`
    : `${hours}h`;
}

export default function TrackerScreen() {
  const { colors, isDark } = useAppTheme();

  const [selectedSubject, setSelectedSubject] = useState("All");

  const [completedChapters, setCompletedChapters] = useState<string[]>(
    []
  );

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [isRunning, setIsRunning] = useState(false);

  const [sessions, setSessions] = useState<Session[]>([]);

  const [savedSeconds, setSavedSeconds] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const elapsedRef = useRef(0);

  const colorsRef = colors;

  const background = colorsRef.background;
  const surface = colorsRef.surface;
  const textColor = colorsRef.text;
  const mutedColor = colorsRef.textMuted;
  const borderColor = colorsRef.border;
  const accent = colorsRef.primary;
  const softAccent = colorsRef.softPrimary;

  const successColor = isDark ? "#6EE7B7" : "#059669";

  const filteredChapters =
    selectedSubject === "All"
      ? CHAPTERS
      : CHAPTERS.filter(
          (chapter) => chapter.subject === selectedSubject
        );

  const completedCount = completedChapters.length;

  const totalChapters = CHAPTERS.length;

  const progress =
    totalChapters > 0
      ? completedCount / totalChapters
      : 0;

  const totalStudySeconds =
    savedSeconds +
    sessions.reduce((total, session) => total + session.seconds, 0);

  const todayStudySeconds = sessions
    .filter(
      (session) =>
        session.date === new Date().toDateString()
    )
    .reduce((total, session) => total + session.seconds, 0);

  // Timer interval: only runs while the timer is active.
  useEffect(() => {
    if (!isRunning) {
      return;
    }

    intervalRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setElapsedSeconds(elapsedRef.current);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  // Keep the ref synchronised with timer state.
  useEffect(() => {
    elapsedRef.current = elapsedSeconds;
  }, [elapsedSeconds]);

  function startTimer() {
    setIsRunning(true);
  }

  function pauseTimer() {
    setIsRunning(false);
  }

  function resetTimer() {
    setIsRunning(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    elapsedRef.current = 0;
    setElapsedSeconds(0);
  }

  function saveSession() {
    if (elapsedSeconds < 60) {
      Alert.alert(
        "Not enough study time",
        "Save a session after studying for at least one minute."
      );
      return;
    }

    const newSession: Session = {
      id: `${Date.now()}`,
      seconds: elapsedSeconds,
      date: new Date().toDateString(),
    };

    setSessions((previous) => [newSession, ...previous]);

    setSavedSeconds((previous) => previous);

    resetTimer();

    Alert.alert(
      "Session saved!",
      `You studied for ${formatDuration(newSession.seconds)}.`
    );
  }

  function toggleChapter(chapterId: string) {
    setCompletedChapters((previous) => {
      if (previous.includes(chapterId)) {
        return previous.filter((id) => id !== chapterId);
      }

      return [...previous, chapterId];
    });
  }

  function confirmReset() {
    Alert.alert(
      "Reset timer?",
      "Your current unsaved session will be cleared.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: resetTimer,
        },
      ]
    );
  }

  const styles = createStyles({
    background,
    surface,
    textColor,
    mutedColor,
    borderColor,
    accent,
    softAccent,
    successColor,
  });

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right"]}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: no notification bar or bell icon */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>
              YOUR LEARNING JOURNEY
            </Text>

            <Text style={styles.title}>
              Study Tracker
            </Text>

            <Text style={styles.subtitle}>
              Small steps. Big progress.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="hourglass-outline"
              size={25}
              color={accent}
            />
          </View>
        </View>

        {/* Daily progress */}
        <View style={styles.progressCard}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.cardLabel}>
                CHAPTER PROGRESS
              </Text>

              <Text style={styles.progressTitle}>
                Your progress
              </Text>
            </View>

            <Text style={styles.progressPercentage}>
              {Math.round(progress * 100)}%
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.round(progress * 100)}%`,
                },
              ]}
            />
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.mutedText}>
              {completedCount} of {totalChapters} chapters completed
            </Text>

            <Ionicons
              name="checkmark-circle-outline"
              size={19}
              color={accent}
            />
          </View>
        </View>

        {/* Study timer */}
        <View style={styles.timerCard}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.cardLabel}>
                FOCUS SESSION
              </Text>

              <Text style={styles.timerTitle}>
                Study timer
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                isRunning && styles.statusBadgeActive,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  isRunning && styles.statusDotActive,
                ]}
              />

              <Text
                style={[
                  styles.statusText,
                  isRunning && styles.statusTextActive,
                ]}
              >
                {isRunning ? "Focusing" : "Ready"}
              </Text>
            </View>
          </View>

          <View style={styles.timerDisplay}>
            <Text style={styles.timerValue}>
              {formatTime(elapsedSeconds)}
            </Text>

            <Text style={styles.timerCaption}>
              {isRunning
                ? "Stay focused. You're doing great."
                : "Ready for your next session?"}
            </Text>
          </View>

          <View style={styles.timerButtons}>
            {!isRunning ? (
              <Pressable
                onPress={startTimer}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name={
                    elapsedSeconds > 0
                      ? "play"
                      : "play-outline"
                  }
                  size={19}
                  color="#FFFFFF"
                />

                <Text style={styles.primaryButtonText}>
                  {elapsedSeconds > 0 ? "Resume" : "Start studying"}
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={pauseTimer}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name="pause"
                  size={19}
                  color="#FFFFFF"
                />

                <Text style={styles.primaryButtonText}>
                  Pause
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={confirmReset}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="refresh-outline"
                size={19}
                color={textColor}
              />
            </Pressable>
          </View>

          <Pressable
            onPress={saveSession}
            disabled={elapsedSeconds < 60}
            style={({ pressed }) => [
              styles.saveButton,
              elapsedSeconds < 60 && styles.disabledButton,
              pressed && elapsedSeconds >= 60 && styles.pressed,
            ]}
          >
            <Ionicons
              name="bookmark-outline"
              size={18}
              color={accent}
            />

            <Text style={styles.saveButtonText}>
              Save study session
            </Text>
          </Pressable>
        </View>

        {/* Study statistics */}
        <Text style={styles.sectionTitle}>
          Study overview
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: softAccent },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={21}
                color={accent}
              />
            </View>

            <Text style={styles.statValue}>
              {formatDuration(todayStudySeconds)}
            </Text>

            <Text style={styles.statLabel}>
              Saved today
            </Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: softAccent },
              ]}
            >
              <Ionicons
                name="book-outline"
                size={21}
                color={accent}
              />
            </View>

            <Text style={styles.statValue}>
              {completedCount}
            </Text>

            <Text style={styles.statLabel}>
              Chapters done
            </Text>
          </View>
        </View>

        {/* Chapter checklist */}
        <View style={styles.chapterHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Chapter tracker
            </Text>

            <Text style={styles.mutedText}>
              Mark a chapter when you finish it.
            </Text>
          </View>

          <Text style={styles.chapterCount}>
            {completedCount}/{totalChapters}
          </Text>
        </View>

        {/* Subject filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {SUBJECTS.map((subject) => {
            const selected = selectedSubject === subject;

            return (
              <Pressable
                key={subject}
                onPress={() => setSelectedSubject(subject)}
                style={[
                  styles.filterButton,
                  selected && styles.filterButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    selected && styles.filterTextSelected,
                  ]}
                >
                  {subject}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Chapters */}
        <View style={styles.chapterList}>
          {filteredChapters.map((chapter) => {
            const completed = completedChapters.includes(
              chapter.id
            );

            return (
              <Pressable
                key={chapter.id}
                onPress={() => toggleChapter(chapter.id)}
                style={({ pressed }) => [
                  styles.chapterItem,
                  pressed && styles.pressed,
                ]}
              >
                <View
                  style={[
                    styles.checkbox,
                    completed && styles.checkboxCompleted,
                  ]}
                >
                  {completed && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color="#FFFFFF"
                    />
                  )}
                </View>

                <View style={styles.chapterInfo}>
                  <Text
                    style={[
                      styles.chapterTitle,
                      completed && styles.completedChapterTitle,
                    ]}
                  >
                    {chapter.title}
                  </Text>

                  <Text style={styles.chapterSubject}>
                    {chapter.subject}
                  </Text>
                </View>

                <Ionicons
                  name={
                    completed
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={21}
                  color={completed ? successColor : mutedColor}
                />
              </Pressable>
            );
          })}
        </View>

        {/* Recent sessions */}
        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>
            Recent sessions
          </Text>

          <Text style={styles.mutedText}>
            {sessions.length} saved
          </Text>
        </View>

        {sessions.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="timer-outline"
                size={27}
                color={accent}
              />
            </View>

            <Text style={styles.emptyTitle}>
              No sessions yet
            </Text>

            <Text style={styles.emptyDescription}>
              Start your timer and save your first study session.
            </Text>
          </View>
        ) : (
          sessions.slice(0, 5).map((session) => (
            <View
              key={session.id}
              style={styles.sessionItem}
            >
              <View style={styles.sessionIcon}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={23}
                  color={accent}
                />
              </View>

              <View style={styles.sessionInfo}>
                <Text style={styles.sessionTitle}>
                  Study session
                </Text>

                <Text style={styles.sessionDate}>
                  {session.date}
                </Text>
              </View>

              <Text style={styles.sessionDuration}>
                {formatDuration(session.seconds)}
              </Text>
            </View>
          ))
        )}

        <View style={styles.footer}>
          <Ionicons
            name="sparkles-outline"
            size={16}
            color={mutedColor}
          />

          <Text style={styles.footerText}>
            Consistency beats perfection.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles({
  background,
  surface,
  textColor,
  mutedColor,
  borderColor,
  accent,
  softAccent,
  successColor,
}: {
  background: string;
  surface: string;
  textColor: string;
  mutedColor: string;
  borderColor: string;
  accent: string;
  softAccent: string;
  successColor: string;
}) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: background,
    },

    container: {
      flex: 1,
      backgroundColor: background,
    },

    content: {
      paddingHorizontal: 18,
      paddingTop: 12,
      paddingBottom: 36,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 22,
    },

    eyebrow: {
      color: accent,
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 1.5,
      marginBottom: 7,
    },

    title: {
      fontSize: 29,
      fontWeight: "800",
      color: textColor,
      letterSpacing: -0.7,
    },

    subtitle: {
      fontSize: 13,
      color: mutedColor,
      marginTop: 5,
    },

    headerIcon: {
      width: 49,
      height: 49,
      borderRadius: 17,
      backgroundColor: softAccent,
      alignItems: "center",
      justifyContent: "center",
    },

    progressCard: {
      backgroundColor: surface,
      borderWidth: 1,
      borderColor,
      borderRadius: 22,
      padding: 18,
      marginBottom: 18,
    },

    rowBetween: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    cardLabel: {
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 1.1,
      color: mutedColor,
    },

    progressTitle: {
      color: textColor,
      fontSize: 18,
      fontWeight: "800",
      marginTop: 7,
    },

    progressPercentage: {
      fontSize: 26,
      fontWeight: "800",
      color: accent,
    },

    progressTrack: {
      height: 8,
      borderRadius: 10,
      backgroundColor: borderColor,
      overflow: "hidden",
      marginTop: 19,
      marginBottom: 12,
    },

    progressFill: {
      height: "100%",
      backgroundColor: accent,
      borderRadius: 10,
    },

    mutedText: {
      color: mutedColor,
      fontSize: 12,
    },

    timerCard: {
      backgroundColor: surface,
      borderWidth: 1,
      borderColor,
      borderRadius: 24,
      padding: 20,
      marginBottom: 25,
    },

    timerTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: textColor,
      marginTop: 6,
    },

    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 7,
      backgroundColor: background,
    },

    statusBadgeActive: {
      backgroundColor: softAccent,
    },

    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: mutedColor,
    },

    statusDotActive: {
      backgroundColor: accent,
    },

    statusText: {
      fontSize: 11,
      fontWeight: "700",
      color: mutedColor,
    },

    statusTextActive: {
      color: accent,
    },

    timerDisplay: {
      alignItems: "center",
      paddingVertical: 30,
    },

    timerValue: {
      fontSize: 42,
      fontWeight: "800",
      letterSpacing: 1,
      fontVariant: ["tabular-nums"],
      color: textColor,
    },

    timerCaption: {
      color: mutedColor,
      fontSize: 12,
      marginTop: 10,
      textAlign: "center",
    },

    timerButtons: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    primaryButton: {
      flex: 1,
      minHeight: 49,
      borderRadius: 15,
      backgroundColor: accent,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 9,
    },

    primaryButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "800",
    },

    secondaryButton: {
      width: 49,
      height: 49,
      borderRadius: 15,
      borderWidth: 1,
      borderColor,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: background,
    },

    saveButton: {
      marginTop: 12,
      height: 45,
      borderRadius: 14,
      borderWidth: 1,
      borderColor,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },

    saveButtonText: {
      color: accent,
      fontSize: 13,
      fontWeight: "700",
    },

    disabledButton: {
      opacity: 0.45,
    },

    pressed: {
      opacity: 0.75,
    },

    sectionTitle: {
      fontSize: 19,
      fontWeight: "800",
      color: textColor,
      letterSpacing: -0.3,
    },

    statsRow: {
      flexDirection: "row",
      gap: 12,
      marginTop: 15,
      marginBottom: 28,
    },

    statCard: {
      flex: 1,
      backgroundColor: surface,
      borderWidth: 1,
      borderColor,
      borderRadius: 19,
      padding: 15,
    },

    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 15,
    },

    statValue: {
      color: textColor,
      fontSize: 22,
      fontWeight: "800",
    },

    statLabel: {
      color: mutedColor,
      fontSize: 11,
      marginTop: 5,
    },

    chapterHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },

    chapterCount: {
      color: accent,
      fontSize: 14,
      fontWeight: "800",
    },

    filterContainer: {
      gap: 8,
      paddingBottom: 15,
    },

    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 13,
      borderWidth: 1,
      borderColor,
      backgroundColor: surface,
    },

    filterButtonSelected: {
      backgroundColor: accent,
      borderColor: accent,
    },

    filterText: {
      color: mutedColor,
      fontSize: 12,
      fontWeight: "700",
    },

    filterTextSelected: {
      color: "#FFFFFF",
    },

    chapterList: {
      gap: 9,
      marginBottom: 28,
    },

    chapterItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 14,
      borderWidth: 1,
      borderColor,
      borderRadius: 17,
      backgroundColor: surface,
      minHeight: 70,
    },

    checkbox: {
      width: 23,
      height: 23,
      borderRadius: 8,
      borderWidth: 1.5,
      borderColor,
      alignItems: "center",
      justifyContent: "center",
    },

    checkboxCompleted: {
      backgroundColor: successColor,
      borderColor: successColor,
    },

    chapterInfo: {
      flex: 1,
    },

    chapterTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: textColor,
    },

    completedChapterTitle: {
      textDecorationLine: "line-through",
      color: mutedColor,
    },

    chapterSubject: {
      color: mutedColor,
      fontSize: 11,
      marginTop: 5,
    },

    recentHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14,
    },

    emptyCard: {
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 27,
      backgroundColor: surface,
      borderWidth: 1,
      borderColor,
      borderRadius: 20,
    },

    emptyIcon: {
      width: 53,
      height: 53,
      borderRadius: 18,
      backgroundColor: softAccent,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 13,
    },

    emptyTitle: {
      fontSize: 15,
      fontWeight: "800",
      color: textColor,
    },

    emptyDescription: {
      color: mutedColor,
      fontSize: 12,
      textAlign: "center",
      lineHeight: 19,
      marginTop: 7,
    },

    sessionItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 14,
      backgroundColor: surface,
      borderWidth: 1,
      borderColor,
      borderRadius: 16,
      marginBottom: 9,
      gap: 11,
    },

    sessionIcon: {
      width: 41,
      height: 41,
      borderRadius: 13,
      backgroundColor: softAccent,
      alignItems: "center",
      justifyContent: "center",
    },

    sessionInfo: {
      flex: 1,
    },

    sessionTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: textColor,
    },

    sessionDate: {
      fontSize: 11,
      color: mutedColor,
      marginTop: 5,
    },

    sessionDuration: {
      color: accent,
      fontSize: 13,
      fontWeight: "800",
    },

    footer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 7,
      paddingTop: 28,
    },

    footerText: {
      color: mutedColor,
      fontSize: 11,
    },
  });
}