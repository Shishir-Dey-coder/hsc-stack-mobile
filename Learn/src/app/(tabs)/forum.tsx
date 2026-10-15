import React, { useMemo, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  ScrollView,
  Alert,
  Keyboard,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/theme/ThemeProvider";

type Question = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  isAnswered: boolean;
  upvotes: number;
  downvotes: number;
  author: string;
  verified: boolean;
  time: string;
  answersCount: number;
  mine: boolean;
};

const INITIAL_QUESTIONS: Question[] = [
  {
    id: "1",
    title: "কলেজ শুরু কবে থেকে হবে?",
    body: "কলেজে একাদশ শ্রেণির ক্লাস কবে থেকে শুরু হবে? কেউ নিশ্চিত তথ্য জানলে জানাও।",
    tags: ["HSC", "College Admission"],
    isAnswered: true,
    upvotes: 3,
    downvotes: 0,
    author: "Efrat Sanjida Khan",
    verified: true,
    time: "1mo ago",
    answersCount: 4,
    mine: false,
  },
  {
    id: "2",
    title: "Static Electricity chapter কীভাবে পড়ব?",
    body: "কলেজের অর্ধবার্ষিক পরীক্ষার জন্য এই অধ্যায়ের কোন কোন টপিক বেশি গুরুত্বপূর্ণ?",
    tags: ["Physics", "HSC"],
    isAnswered: false,
    upvotes: 5,
    downvotes: 1,
    author: "Md Mahin Chowdhury",
    verified: false,
    time: "1d ago",
    answersCount: 3,
    mine: false,
  },
  {
    id: "3",
    title: "HSC Higher Math-এর জন্য কোনো ভালো রিসোর্স আছে?",
    body: "অনুশীলনের জন্য ভালো বই, লেকচার অথবা ওয়েবসাইট সাজেস্ট করো।",
    tags: ["Higher Math", "Study Help"],
    isAnswered: false,
    upvotes: 2,
    downvotes: 0,
    author: "Shishir Dey",
    verified: false,
    time: "2h ago",
    answersCount: 0,
    mine: true,
  },
  {
    id: "4",
    title: "HSC পরীক্ষার জন্য Biology কীভাবে revise করব?",
    body: "কম সময়ের মধ্যে গুরুত্বপূর্ণ টপিকগুলো revision করার কার্যকর পদ্ধতি জানতে চাই।",
    tags: ["Biology", "HSC"],
    isAnswered: true,
    upvotes: 7,
    downvotes: 0,
    author: "Nusrat Jahan",
    verified: true,
    time: "3d ago",
    answersCount: 6,
    mine: false,
  },
  {
    id: "5",
    title: "কলেজের নোট কীভাবে গুছিয়ে রাখো?",
    body: "সব subject-এর notes manage করার জন্য তোমরা কোন পদ্ধতি ব্যবহার করো?",
    tags: ["Study Help", "Other / General"],
    isAnswered: false,
    upvotes: 1,
    downvotes: 0,
    author: "Debashish Sarkar",
    verified: false,
    time: "5h ago",
    answersCount: 2,
    mine: false,
  },
  {
    id: "6",
    title: "Chemistry-তে ভালো করার উপায় কী?",
    body: "Organic Chemistry বুঝতে এবং reaction মনে রাখতে কীভাবে practice করব?",
    tags: ["Chemistry", "HSC"],
    isAnswered: false,
    upvotes: 4,
    downvotes: 0,
    author: "Arif Hasan",
    verified: false,
    time: "6h ago",
    answersCount: 1,
    mine: false,
  },
];

type Vote = "up" | "down" | null;

type VoteState = {
  [questionId: string]: Vote;
};

export default function ForumScreen() {
  const { colors } = useAppTheme();

  const [questions, setQuestions] =
    useState<Question[]>(INITIAL_QUESTIONS);

  const [searchText, setSearchText] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [showFilters, setShowFilters] = useState(false);
  const [mineOnly, setMineOnly] = useState(false);

  const [votes, setVotes] = useState<VoteState>({});
  const [page, setPage] = useState(1);

  const [selectedQuestion, setSelectedQuestion] =
    useState<Question | null>(null);

  const [answerText, setAnswerText] = useState("");

  const [answers, setAnswers] = useState<{
    [questionId: string]: {
      id: string;
      author: string;
      text: string;
      time: string;
      upvotes: number;
    }[];
  }>({
    "1": [
      {
        id: "a1",
        author: "Debashish Sarkar",
        text: "কলেজের নোটিশ বোর্ড এবং অফিসিয়াল ওয়েবসাইটে আপডেট দেখো।",
        time: "1mo ago",
        upvotes: 1,
      },
    ],
    "2": [
      {
        id: "a2",
        author: "Arif Hasan",
        text: "প্রথমে Coulomb's law, electric field এবং potential ভালোভাবে বুঝে নাও।",
        time: "4h ago",
        upvotes: 2,
      },
    ],
  });

  const theme = {
    background: colors.background,
    card: colors.card ?? colors.background,
    text: colors.text,
    muted: colors.textMuted,
    border: colors.border ?? colors.textMuted,
    input: colors.inputBackground ?? colors.card ?? colors.background,
    primary: colors.primary ?? "#A78BFA",
    success: colors.success ?? "#39D353",
  };

  const styles = useMemo(
    () => createStyles(theme),
    [
      theme.background,
      theme.card,
      theme.text,
      theme.muted,
      theme.border,
      theme.input,
      theme.primary,
      theme.success,
    ]
  );

  const categories = [
    "All",
    "HSC",
    "Physics",
    "Chemistry",
    "Biology",
    "Higher Math",
    "Study Help",
    "College Admission",
    "Other / General",
  ];

  const filteredQuestions = useMemo(() => {
    const query = submittedSearch.trim().toLowerCase();

    return questions.filter((question) => {
      const matchesSearch =
        !query ||
        question.title.toLowerCase().includes(query) ||
        question.body.toLowerCase().includes(query) ||
        question.author.toLowerCase().includes(query) ||
        question.tags.some((tag) =>
          tag.toLowerCase().includes(query)
        );

      const matchesCategory =
        selectedCategory === "All" ||
        question.tags.includes(selectedCategory);

      const matchesMine = !mineOnly || question.mine;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMine
      );
    });
  }, [
    questions,
    submittedSearch,
    selectedCategory,
    mineOnly,
  ]);

  const pageSize = 4;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredQuestions.length / pageSize)
  );

  const visibleQuestions = filteredQuestions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleSearch = () => {
    Keyboard.dismiss();
    setSubmittedSearch(searchText);
    setPage(1);
  };

  const handleVote = (
    questionId: string,
    direction: Exclude<Vote, null>
  ) => {
    const previousVote = votes[questionId] ?? null;

    setQuestions((current) =>
      current.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        let upvotes = question.upvotes;
        let downvotes = question.downvotes;

        if (previousVote === "up") upvotes -= 1;
        if (previousVote === "down") downvotes -= 1;

        const nextVote =
          previousVote === direction ? null : direction;

        if (nextVote === "up") upvotes += 1;
        if (nextVote === "down") downvotes += 1;

        return {
          ...question,
          upvotes,
          downvotes,
        };
      })
    );

    setVotes((current) => ({
      ...current,
      [questionId]:
        previousVote === direction ? null : direction,
    }));

    if (
      selectedQuestion &&
      selectedQuestion.id === questionId
    ) {
      setSelectedQuestion((current) => {
        if (!current) return current;

        let upvotes = current.upvotes;
        let downvotes = current.downvotes;

        if (previousVote === "up") upvotes -= 1;
        if (previousVote === "down") downvotes -= 1;

        const nextVote =
          previousVote === direction ? null : direction;

        if (nextVote === "up") upvotes += 1;
        if (nextVote === "down") downvotes += 1;

        return { ...current, upvotes, downvotes };
      });
    }
  };

  const openQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setAnswerText("");
  };

  const goBackToFeed = () => {
    setSelectedQuestion(null);
    setAnswerText("");
  };

  const postAnswer = () => {
    if (!selectedQuestion) return;

    const trimmedAnswer = answerText.trim();

    if (!trimmedAnswer) {
      Alert.alert(
        "Answer required",
        "Please write your answer first."
      );
      return;
    }

    const questionId = selectedQuestion.id;

    const newAnswer = {
      id: `${Date.now()}`,
      author: "You",
      text: trimmedAnswer,
      time: "Just now",
      upvotes: 0,
    };

    setAnswers((current) => ({
      ...current,
      [questionId]: [
        ...(current[questionId] ?? []),
        newAnswer,
      ],
    }));

    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId
          ? {
              ...question,
              answersCount: question.answersCount + 1,
              isAnswered: true,
            }
          : question
      )
    );

    setSelectedQuestion((current) =>
      current
        ? {
            ...current,
            answersCount: current.answersCount + 1,
            isAnswered: true,
          }
        : current
    );

    setAnswerText("");

    Alert.alert("Success", "Your answer was added.");
  };

  const renderVoteColumn = (question: Question) => {
    const currentVote = votes[question.id] ?? null;

    return (
      <View style={styles.voteColumn}>
        <Pressable
          onPress={() => handleVote(question.id, "up")}
          hitSlop={8}
          accessibilityLabel="Upvote question"
          style={styles.voteButton}
        >
          <Ionicons
            name="caret-up"
            size={23}
            color={
              currentVote === "up"
                ? theme.primary
                : theme.muted
            }
          />
        </Pressable>

        <Text style={styles.voteNumber}>
          {question.upvotes - question.downvotes}
        </Text>

        <Pressable
          onPress={() => handleVote(question.id, "down")}
          hitSlop={8}
          accessibilityLabel="Downvote question"
          style={styles.voteButton}
        >
          <Ionicons
            name="caret-down"
            size={23}
            color={
              currentVote === "down"
                ? "#F87171"
                : theme.muted
            }
          />
        </Pressable>
      </View>
    );
  };

  const renderQuestionCard = ({
    item,
  }: {
    item: Question;
  }) => {
    return (
      <Pressable
        onPress={() => openQuestion(item)}
        style={styles.questionCard}
      >
        {renderVoteColumn(item)}

        <View style={styles.questionContent}>
          <View style={styles.tagRow}>
            {item.tags.slice(0, 2).map((tag) => (
              <View key={tag} style={styles.tagPill}>
                <Text style={styles.tagText}>
                  {tag}
                </Text>
              </View>
            ))}

            {item.isAnswered && (
              <View style={styles.answeredBadge}>
                <Ionicons
                  name="checkmark-circle"
                  size={12}
                  color={theme.success}
                />
                <Text style={styles.answeredText}>
                  Answered
                </Text>
              </View>
            )}
          </View>

          <Text
            style={styles.questionTitle}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          <Text
            style={styles.questionBody}
            numberOfLines={3}
          >
            {item.body}
          </Text>

          <View style={styles.questionMeta}>
            <View style={styles.authorLine}>
              <Text
                style={styles.authorName}
                numberOfLines={1}
              >
                {item.author}
              </Text>

              {item.verified && (
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={theme.primary}
                />
              )}
            </View>

            <Text style={styles.metaDot}>·</Text>

            <Text style={styles.metaText}>
              {item.time}
            </Text>
          </View>

          <View style={styles.cardFooter}>
            <Ionicons
              name="chatbubble-outline"
              size={14}
              color={theme.muted}
            />

            <Text style={styles.answerCount}>
              {item.answersCount}{" "}
              {item.answersCount === 1
                ? "answer"
                : "answers"}
            </Text>

            <View style={styles.readMore}>
              <Text style={styles.readMoreText}>
                View question
              </Text>

              <Ionicons
                name="chevron-forward"
                size={13}
                color={theme.primary}
              />
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderSponsoredCard = () => (
    <View style={styles.sponsoredCard}>
      <View style={styles.sponsoredHeader}>
        <Ionicons
          name="megaphone-outline"
          size={15}
          color="#EAB308"
        />

        <Text style={styles.sponsoredLabel}>
          SPONSORED
        </Text>
      </View>

      <Text style={styles.sponsoredTitle}>
        Your Ad Goes Here
      </Text>

      <Text style={styles.sponsoredDescription}>
        Reach students across the HSCStack community.
      </Text>

      <Pressable
        onPress={() =>
          Alert.alert(
            "Sponsored placement",
            "Contact the HSCStack team to advertise here."
          )
        }
        style={styles.sponsoredButton}
      >
        <Text style={styles.sponsoredButtonText}>
          Promote with Us
        </Text>

        <Ionicons
          name="open-outline"
          size={14}
          color={theme.primary}
        />
      </Pressable>
    </View>
  );

  const renderQuestionDetail = () => {
    if (!selectedQuestion) return null;

    const question = selectedQuestion;
    const questionAnswers = answers[question.id] ?? [];

    return (
      <SafeAreaView
        style={styles.container}
        edges={["top", "left", "right"]}
      >
        <View style={styles.detailHeader}>
          <Pressable
            onPress={goBackToFeed}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color={theme.text}
            />
          </Pressable>

          <Text style={styles.detailHeaderTitle}>
            Question Detail
          </Text>

          <Pressable
            onPress={() =>
              Alert.alert(
                "Share question",
                "Question sharing can be connected later."
              )
            }
            style={styles.backButton}
          >
            <Ionicons
              name="share-social-outline"
              size={20}
              color={theme.text}
            />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.detailScroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.detailQuestionCard}>
            <View style={styles.tagRow}>
              {question.tags.map((tag) => (
                <View key={tag} style={styles.tagPill}>
                  <Text style={styles.tagText}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>

            {question.isAnswered && (
              <View style={styles.detailAnsweredBadge}>
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={theme.success}
                />
                <Text style={styles.answeredText}>
                  Answered
                </Text>
              </View>
            )}

            <Text style={styles.detailQuestionTitle}>
              {question.title}
            </Text>

            <View style={styles.questionMeta}>
              <Text style={styles.authorName}>
                {question.author}
              </Text>

              {question.verified && (
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={theme.primary}
                />
              )}

              <Text style={styles.metaDot}>·</Text>

              <Text style={styles.metaText}>
                Asked {question.time}
              </Text>
            </View>

            <Text style={styles.detailQuestionBody}>
              {question.body}
            </Text>

            <View style={styles.detailFooter}>
              <Pressable
                onPress={() =>
                  handleVote(question.id, "up")
                }
                style={styles.detailAction}
              >
                <Ionicons
                  name="caret-up"
                  size={20}
                  color={
                    votes[question.id] === "up"
                      ? theme.primary
                      : theme.muted
                  }
                />
                <Text style={styles.detailActionText}>
                  {question.upvotes}
                </Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  handleVote(question.id, "down")
                }
                style={styles.detailAction}
              >
                <Ionicons
                  name="caret-down"
                  size={20}
                  color={
                    votes[question.id] === "down"
                      ? "#F87171"
                      : theme.muted
                  }
                />
                <Text style={styles.detailActionText}>
                  {question.downvotes}
                </Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  Alert.alert(
                    "Report question",
                    "Reporting will be connected to the backend later."
                  )
                }
                style={styles.reportButton}
              >
                <Ionicons
                  name="flag-outline"
                  size={15}
                  color={theme.muted}
                />
                <Text style={styles.detailActionText}>
                  Report
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.answersHeading}>
            <Text style={styles.sectionTitle}>
              Answers
            </Text>

            <View style={styles.answerCountBadge}>
              <Text style={styles.answerCountBadgeText}>
                {questionAnswers.length}
              </Text>
            </View>
          </View>

          {questionAnswers.length === 0 ? (
            <View style={styles.emptyAnswers}>
              <Ionicons
                name="chatbubbles-outline"
                size={30}
                color={theme.muted}
              />

              <Text style={styles.emptyAnswersTitle}>
                No answers yet
              </Text>

              <Text style={styles.emptyAnswersText}>
                Be the first to help this student.
              </Text>
            </View>
          ) : (
            questionAnswers.map((answer) => (
              <View
                key={answer.id}
                style={styles.answerCard}
              >
                <View style={styles.answerAuthorRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {answer.author.charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.answerAuthorInfo}>
                    <Text style={styles.answerAuthorName}>
                      {answer.author}
                    </Text>

                    <Text style={styles.metaText}>
                      {answer.time}
                    </Text>
                  </View>
                </View>

                <Text style={styles.answerBody}>
                  {answer.text}
                </Text>

                <View style={styles.answerFooter}>
                  <Ionicons
                    name="caret-up"
                    size={18}
                    color={theme.muted}
                  />

                  <Text style={styles.detailActionText}>
                    {answer.upvotes}
                  </Text>

                  <Pressable
                    onPress={() =>
                      Alert.alert(
                        "Reply",
                        "Nested replies can be added with the backend."
                      )
                    }
                    style={styles.replyButton}
                  >
                    <Ionicons
                      name="return-down-forward-outline"
                      size={15}
                      color={theme.primary}
                    />

                    <Text style={styles.replyText}>
                      Reply
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      Alert.alert(
                        "Report answer",
                        "Answer reporting can be connected later."
                      )
                    }
                    style={styles.reportButton}
                  >
                    <Ionicons
                      name="flag-outline"
                      size={14}
                      color={theme.muted}
                    />

                    <Text style={styles.detailActionText}>
                      Report
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}

          <View style={styles.answerForm}>
            <Text style={styles.sectionTitle}>
              Your Answer
            </Text>

            <TextInput
              value={answerText}
              onChangeText={setAnswerText}
              placeholder="Write a clear, detailed answer to help this student..."
              placeholderTextColor={theme.muted}
              multiline
              textAlignVertical="top"
              style={styles.answerInput}
            />

            <Pressable
              onPress={() =>
                Alert.alert(
                  "Coming soon",
                  "Image attachment will be added later."
                )
              }
              style={styles.attachButton}
            >
              <Ionicons
                name="image-outline"
                size={18}
                color={theme.primary}
              />

              <Text style={styles.attachText}>
                Attach Image (Optional)
              </Text>
            </Pressable>

            <Pressable
              onPress={postAnswer}
              style={styles.postAnswerButton}
            >
              <Ionicons
                name="send"
                size={16}
                color="#FFFFFF"
              />

              <Text style={styles.postAnswerText}>
                Post Your Answer
              </Text>
            </Pressable>
          </View>

          {renderSponsoredCard()}

          <View style={{ height: 24 }} />
        </ScrollView>
      </SafeAreaView>
    );
  };

  if (selectedQuestion) {
    return renderQuestionDetail();
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right"]}
    >
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>
            HSC
            <Text style={styles.titleAccent}>Stack</Text>{" "}
            Forum
          </Text>

          <Text style={styles.subtitle}>
            Ask, learn and grow together.
          </Text>
        </View>

        <Pressable
          onPress={() =>
            Alert.alert(
              "Ask Question",
              "Question creation form can be added next."
            )
          }
          style={styles.askButton}
        >
          <Ionicons
            name="add"
            size={19}
            color="#FFFFFF"
          />

          <Text style={styles.askButtonText}>
            Ask
          </Text>
        </Pressable>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search-outline"
            size={19}
            color={theme.muted}
          />

          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            placeholder="Search questions..."
            placeholderTextColor={theme.muted}
            style={styles.searchInput}
          />

          {searchText.length > 0 && (
            <Pressable
              onPress={() => {
                setSearchText("");
                setSubmittedSearch("");
                setPage(1);
              }}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={theme.muted}
              />
            </Pressable>
          )}
        </View>

        <Pressable
          onPress={handleSearch}
          style={styles.searchButton}
        >
          <Text style={styles.searchButtonText}>
            Search
          </Text>
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        <Pressable
          onPress={() => setShowFilters((value) => !value)}
          style={[
            styles.filterButton,
            showFilters && styles.activeFilterButton,
          ]}
        >
          <Ionicons
            name="options-outline"
            size={16}
            color={showFilters ? "#FFFFFF" : theme.text}
          />

          <Text
            style={[
              styles.filterButtonText,
              showFilters && styles.activeFilterText,
            ]}
          >
            Filter
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setMineOnly((value) => !value);
            setPage(1);
          }}
          style={[
            styles.filterButton,
            mineOnly && styles.activeFilterButton,
          ]}
        >
          <Ionicons
            name="person-outline"
            size={15}
            color={mineOnly ? "#FFFFFF" : theme.text}
          />

          <Text
            style={[
              styles.filterButtonText,
              mineOnly && styles.activeFilterText,
            ]}
          >
            Mine
          </Text>
        </Pressable>

        <View style={styles.resultCount}>
          <Text style={styles.resultCountText}>
            {filteredQuestions.length} questions
          </Text>
        </View>
      </View>

      {showFilters && (
        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categories.map((category) => {
              const active =
                selectedCategory === category;

              return (
                <Pressable
                  key={category}
                  onPress={() => {
                    setSelectedCategory(category);
                    setPage(1);
                  }}
                  style={[
                    styles.categoryChip,
                    active && styles.activeCategoryChip,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      active && styles.activeCategoryText,
                    ]}
                  >
                    {category}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      <FlatList
        data={visibleQuestions}
        keyExtractor={(item) => item.id}
        renderItem={renderQuestionCard}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.feedContent}
        ListHeaderComponent={renderSponsoredCard}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="search-outline"
              size={38}
              color={theme.muted}
            />

            <Text style={styles.emptyTitle}>
              No questions found
            </Text>

            <Text style={styles.emptyDescription}>
              Try another keyword or category.
            </Text>

            <Pressable
              onPress={() => {
                setSearchText("");
                setSubmittedSearch("");
                setSelectedCategory("All");
                setMineOnly(false);
                setPage(1);
              }}
              style={styles.clearFiltersButton}
            >
              <Text style={styles.clearFiltersText}>
                Clear filters
              </Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={
          filteredQuestions.length > 0 ? (
            <View style={styles.pagination}>
              <Pressable
                disabled={page <= 1}
                onPress={() =>
                  setPage((current) =>
                    Math.max(1, current - 1)
                  )
                }
                style={[
                  styles.pageButton,
                  page <= 1 && styles.disabledPageButton,
                ]}
              >
                <Ionicons
                  name="chevron-back"
                  size={16}
                  color={
                    page <= 1
                      ? theme.muted
                      : theme.text
                  }
                />

                <Text style={styles.pageButtonText}>
                  Prev
                </Text>
              </Pressable>

              <Text style={styles.pageIndicator}>
                Page {page} of {totalPages}
              </Text>

              <Pressable
                disabled={page >= totalPages}
                onPress={() =>
                  setPage((current) =>
                    Math.min(totalPages, current + 1)
                  )
                }
                style={[
                  styles.pageButton,
                  page >= totalPages &&
                    styles.disabledPageButton,
                ]}
              >
                <Text style={styles.pageButtonText}>
                  Next
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={
                    page >= totalPages
                      ? theme.muted
                      : theme.text
                  }
                />
              </Pressable>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

function createStyles(theme: {
  background: string;
  card: string;
  text: string;
  muted: string;
  border: string;
  input: string;
  primary: string;
  success: string;
}) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    header: {
      paddingHorizontal: 18,
      paddingTop: 12,
      paddingBottom: 18,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },

    headerTextContainer: {
      flex: 1,
    },

    title: {
      fontSize: 25,
      fontWeight: "800",
      color: theme.text,
      letterSpacing: -0.7,
    },

    titleAccent: {
      color: theme.primary,
    },

    subtitle: {
      marginTop: 5,
      fontSize: 13,
      color: theme.muted,
    },

    askButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      backgroundColor: theme.primary,
      borderRadius: 11,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },

    askButtonText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "700",
    },

    searchRow: {
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    searchInputContainer: {
      flex: 1,
      minHeight: 45,
      flexDirection: "row",
      alignItems: "center",
      gap: 9,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 11,
      backgroundColor: theme.input,
    },

    searchInput: {
      flex: 1,
      paddingVertical: 9,
      color: theme.text,
      fontSize: 13,
    },

    searchButton: {
      minHeight: 43,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      paddingHorizontal: 13,
    },

    searchButtonText: {
      color: theme.text,
      fontSize: 12,
      fontWeight: "700",
    },

    filterRow: {
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 9,
    },

    filterButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 9,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: theme.card,
    },

    activeFilterButton: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },

    filterButtonText: {
      color: theme.text,
      fontSize: 12,
      fontWeight: "600",
    },

    activeFilterText: {
      color: "#FFFFFF",
    },

    resultCount: {
      flex: 1,
      alignItems: "flex-end",
    },

    resultCountText: {
      color: theme.muted,
      fontSize: 11,
    },

    categoryContainer: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.border,
      paddingVertical: 10,
    },

    categoryScroll: {
      paddingHorizontal: 16,
      gap: 8,
    },

    categoryChip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },

    activeCategoryChip: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },

    categoryText: {
      color: theme.text,
      fontSize: 12,
      fontWeight: "600",
    },

    activeCategoryText: {
      color: "#FFFFFF",
    },

    feedContent: {
      paddingHorizontal: 16,
      paddingTop: 5,
      paddingBottom: 28,
      flexGrow: 1,
    },

    sponsoredCard: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14,
      padding: 15,
      marginBottom: 13,
      backgroundColor: theme.card,
    },

    sponsoredHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 10,
    },

    sponsoredLabel: {
      color: "#EAB308",
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 1,
    },

    sponsoredTitle: {
      fontSize: 17,
      fontWeight: "800",
      color: theme.text,
    },

    sponsoredDescription: {
      marginTop: 5,
      fontSize: 12,
      lineHeight: 18,
      color: theme.muted,
    },

    sponsoredButton: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 12,
      paddingVertical: 7,
      paddingHorizontal: 10,
      borderRadius: 8,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
    },

    sponsoredButtonText: {
      fontSize: 12,
      color: theme.primary,
      fontWeight: "700",
    },

    questionCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14,
      padding: 13,
      marginBottom: 11,
      gap: 10,
    },

    voteColumn: {
      alignItems: "center",
      justifyContent: "flex-start",
      width: 27,
      paddingTop: 2,
    },

    voteButton: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 2,
    },

    voteNumber: {
      color: theme.text,
      fontSize: 13,
      fontWeight: "800",
      marginVertical: 1,
    },

    questionContent: {
      flex: 1,
      minWidth: 0,
    },

    tagRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      gap: 5,
      marginBottom: 9,
    },

    tagPill: {
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 7,
      paddingVertical: 4,
      borderRadius: 6,
    },

    tagText: {
      color: theme.muted,
      fontSize: 10,
      fontWeight: "600",
    },

    answeredBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      backgroundColor: theme.background,
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 4,
    },

    answeredText: {
      color: theme.success,
      fontSize: 10,
      fontWeight: "700",
    },

    questionTitle: {
      fontSize: 15,
      lineHeight: 21,
      fontWeight: "800",
      color: theme.text,
    },

    questionBody: {
      fontSize: 12,
      lineHeight: 18,
      color: theme.muted,
      marginTop: 7,
    },

    questionMeta: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      gap: 5,
      marginTop: 11,
    },

    authorLine: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      maxWidth: "75%",
    },

    authorName: {
      color: theme.text,
      fontSize: 11,
      fontWeight: "600",
    },

    metaDot: {
      color: theme.muted,
      fontSize: 12,
    },

    metaText: {
      color: theme.muted,
      fontSize: 11,
    },

    cardFooter: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      marginTop: 12,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },

    answerCount: {
      color: theme.muted,
      fontSize: 11,
    },

    readMore: {
      marginLeft: "auto",
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
    },

    readMoreText: {
      color: theme.primary,
      fontSize: 11,
      fontWeight: "700",
    },

    pagination: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      gap: 8,
    },

    pageButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 9,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 9,
      backgroundColor: theme.card,
    },

    disabledPageButton: {
      opacity: 0.45,
    },

    pageButtonText: {
      color: theme.text,
      fontSize: 12,
      fontWeight: "600",
    },

    pageIndicator: {
      color: theme.muted,
      fontSize: 12,
      fontWeight: "600",
    },

    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 55,
    },

    emptyTitle: {
      color: theme.text,
      fontSize: 17,
      fontWeight: "800",
      marginTop: 12,
    },

    emptyDescription: {
      color: theme.muted,
      fontSize: 13,
      marginTop: 6,
      textAlign: "center",
    },

    clearFiltersButton: {
      marginTop: 15,
      backgroundColor: theme.primary,
      paddingHorizontal: 15,
      paddingVertical: 9,
      borderRadius: 9,
    },

    clearFiltersText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 12,
    },

    detailHeader: {
      minHeight: 54,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },

    backButton: {
      width: 37,
      height: 37,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.card,
    },

    detailHeaderTitle: {
      flex: 1,
      textAlign: "center",
      color: theme.text,
      fontSize: 16,
      fontWeight: "800",
    },

    detailScroll: {
      padding: 16,
      paddingBottom: 25,
    },

    detailQuestionCard: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14,
      padding: 15,
    },

    detailAnsweredBadge: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 3,
      marginBottom: 10,
    },

    detailQuestionTitle: {
      color: theme.text,
      fontSize: 21,
      lineHeight: 29,
      fontWeight: "800",
      marginTop: 4,
    },

    detailQuestionBody: {
      color: theme.text,
      fontSize: 14,
      lineHeight: 23,
      marginTop: 17,
    },

    detailFooter: {
      flexDirection: "row",
      alignItems: "center",
      gap: 17,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      marginTop: 18,
      paddingTop: 13,
    },

    detailAction: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },

    detailActionText: {
      color: theme.muted,
      fontSize: 12,
    },

    reportButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginLeft: "auto",
    },

    answersHeading: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 23,
      marginBottom: 12,
    },

    sectionTitle: {
      color: theme.text,
      fontSize: 18,
      fontWeight: "800",
    },

    answerCountBadge: {
      minWidth: 23,
      height: 23,
      borderRadius: 7,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 5,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },

    answerCountBadgeText: {
      color: theme.text,
      fontSize: 11,
      fontWeight: "700",
    },

    emptyAnswers: {
      alignItems: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 13,
      padding: 24,
    },

    emptyAnswersTitle: {
      color: theme.text,
      fontSize: 15,
      fontWeight: "700",
      marginTop: 9,
    },

    emptyAnswersText: {
      color: theme.muted,
      fontSize: 12,
      textAlign: "center",
      marginTop: 5,
    },

    answerCard: {
      padding: 14,
      borderRadius: 13,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      marginBottom: 10,
    },

    answerAuthorRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    avatar: {
      width: 37,
      height: 37,
      borderRadius: 19,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: "center",
      justifyContent: "center",
    },

    avatarText: {
      color: theme.primary,
      fontSize: 15,
      fontWeight: "800",
    },

    answerAuthorInfo: {
      flex: 1,
      gap: 3,
    },

    answerAuthorName: {
      color: theme.text,
      fontSize: 13,
      fontWeight: "700",
    },

    answerBody: {
      color: theme.text,
      fontSize: 13,
      lineHeight: 22,
      marginTop: 13,
    },

    answerFooter: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      marginTop: 14,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },

    replyButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginLeft: 13,
    },

    replyText: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: "600",
    },

    answerForm: {
      marginTop: 24,
      marginBottom: 20,
      padding: 15,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14,
    },

    answerInput: {
      minHeight: 130,
      maxHeight: 230,
      color: theme.text,
      fontSize: 14,
      lineHeight: 22,
      textAlignVertical: "top",
      padding: 12,
      marginTop: 13,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
    },

    attachButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      alignSelf: "flex-start",
      marginTop: 13,
      paddingVertical: 8,
    },

    attachText: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: "600",
    },

    postAnswerButton: {
      minHeight: 45,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginTop: 12,
      borderRadius: 10,
      backgroundColor: theme.primary,
    },

    postAnswerText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "800",
    },
  });
}