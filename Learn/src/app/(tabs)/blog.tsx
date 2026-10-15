import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  ScrollView,
  Pressable,
  Keyboard,
  Share,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/theme/ThemeProvider";

type BlogPost = {
  id: string;
  title: string;
  content: string;
  author: string;
  time: string;
  likes: number;
  comments: number;
  views: number;
  mine?: boolean;
  icon: keyof typeof Ionicons.glyphMap;
};

const INITIAL_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "পড়াশোনায় ভালো করার সহজ কিছু কৌশল",
    content:
      "পড়াশোনায় ভালো করার জন্য নিয়মিত অনুশীলন এবং সঠিক পরিকল্পনা খুব গুরুত্বপূর্ণ। প্রতিদিনের পড়া প্রতিদিন শেষ করার চেষ্টা করো। কঠিন বিষয়গুলো ছোট ছোট অংশে ভাগ করে পড়ো।\n\nশুধু মুখস্থ না করে বিষয়টি বোঝার চেষ্টা করো। নিয়মিত রিভিশন এবং বিগত বছরের প্রশ্ন সমাধান করলে পরীক্ষার প্রস্তুতি আরও ভালো হবে।",
    author: "Mahib Abrar",
    time: "6d ago",
    likes: 4,
    comments: 0,
    views: 201,
    icon: "book-outline",
  },
  {
    id: "2",
    title: "কলেজ লাইফে কীভাবে পড়াশোনা সামলাবে?",
    content:
      "কলেজের ক্লাস, বাসার পড়া এবং নিজের সময়ের মধ্যে ভারসাম্য রাখা গুরুত্বপূর্ণ। প্রতিদিনের জন্য ছোট একটি রুটিন তৈরি করো।\n\nক্লাসে যা পড়ানো হয়, সেদিনই রিভিশন দিলে পরীক্ষার আগে চাপ কম থাকবে। পর্যাপ্ত ঘুম এবং বিরতিও পড়াশোনার অংশ।",
    author: "TR Tajim",
    time: "1mo ago",
    likes: 4,
    comments: 1,
    views: 91,
    icon: "school-outline",
  },
  {
    id: "3",
    title: "SSC পরীক্ষার অভিজ্ঞতা থেকে কিছু শিক্ষা",
    content:
      "পরীক্ষায় ভালো করার জন্য শুধু বেশি সময় পড়লেই হয় না, সঠিকভাবে প্রস্তুতি নেওয়াও জরুরি। নিজের দুর্বল অধ্যায়গুলো খুঁজে বের করো এবং সেগুলোতে বেশি অনুশীলন করো।\n\nসময় ধরে মডেল টেস্ট দিলে পরীক্ষার হলে সময় ব্যবস্থাপনা সহজ হবে।",
    author: "Efrat Sanjida Khan Sura",
    time: "1mo ago",
    likes: 2,
    comments: 0,
    views: 54,
    icon: "school-outline",
  },
  {
    id: "4",
    title: "রংপুরে কলেজ নির্বাচনের আগে যা ভাববে",
    content:
      "কলেজ বাছাই করার সময় পড়াশোনার পরিবেশ, শিক্ষক, যাতায়াত এবং নিজের পছন্দের বিষয়গুলো বিবেচনা করো।\n\nশুধু অন্যের কথা শুনে সিদ্ধান্ত না নিয়ে নির্ভরযোগ্য তথ্য সংগ্রহ করো। নিজের লক্ষ্য অনুযায়ী কলেজগুলোর সুবিধা তুলনা করো।",
    author: "Efrat Sanjida Khan Sura",
    time: "1mo ago",
    likes: 5,
    comments: 2,
    views: 385,
    icon: "location-outline",
  },
  {
    id: "5",
    title: "HSC শিক্ষার্থীদের জন্য স্মার্ট স্টাডি রুটিন",
    content:
      "প্রথমে নিজের সিলেবাস ও সময় বুঝে রুটিন তৈরি করো। কঠিন বিষয়ের জন্য বেশি সময় রাখো। প্রতিদিন অল্প অল্প করে পড়লে শেষ মুহূর্তে অতিরিক্ত চাপ নিতে হবে না।\n\nPomodoro পদ্ধতিতে পড়তে পারো: ২৫ মিনিট মনোযোগ দিয়ে পড়ো, তারপর ৫ মিনিট বিরতি নাও। নিজের সুবিধা অনুযায়ী সময় পরিবর্তন করাও ঠিক আছে।",
    author: "TR Tajim",
    time: "2mo ago",
    likes: 8,
    comments: 3,
    views: 412,
    icon: "time-outline",
  },
  {
    id: "6",
    title: "পরীক্ষার আগে রিভিশন করার কার্যকর উপায়",
    content:
      "প্রথমে সিলেবাসের তালিকা তৈরি করো। কোন অধ্যায় ভালো পারো এবং কোন অধ্যায়ে সমস্যা হয়, তা চিহ্নিত করো।\n\nবই বন্ধ করে নিজে উত্তর লেখার চেষ্টা করো। এতে কোন জায়গায় দুর্বলতা আছে তা বোঝা যায়। বিগত বছরের প্রশ্ন সমাধান করাও খুব উপকারী।",
    author: "HSCStack Team",
    time: "2mo ago",
    likes: 12,
    comments: 4,
    views: 620,
    icon: "checkmark-done-outline",
  },
];

export default function BlogScreen() {
  const { colors } = useAppTheme();

  const theme = {
    background: colors.background,
    card: (colors as any).card ?? colors.background,
    text: colors.text,
    muted: colors.textMuted,
    border: (colors as any).border ?? colors.textMuted,
    primary: (colors as any).primary ?? "#A78BFA",
  };

  const styles = useMemo(() => makeStyles(theme), [
    theme.background,
    theme.card,
    theme.text,
    theme.muted,
    theme.border,
    theme.primary,
  ]);

  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [mineOnly, setMineOnly] = useState(false);
  const [selected, setSelected] = useState<BlogPost | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [bodyInput, setBodyInput] = useState("");
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [commentsByPost, setCommentsByPost] = useState<
    Record<string, string[]>
  >({});
  const [commentInput, setCommentInput] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);

  const filteredPosts = useMemo(() => {
    const text = query.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesSearch =
        !text ||
        post.title.toLowerCase().includes(text) ||
        post.author.toLowerCase().includes(text) ||
        post.content.toLowerCase().includes(text);

      return matchesSearch && (!mineOnly || post.mine === true);
    });
  }, [posts, query, mineOnly]);

  const toggleLike = (postId: string) => {
    const alreadyLiked = likedIds.includes(postId);

    setLikedIds((current) =>
      alreadyLiked
        ? current.filter((id) => id !== postId)
        : [...current, postId]
    );

    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: Math.max(0, post.likes + (alreadyLiked ? -1 : 1)),
            }
          : post
      )
    );

    setSelected((current) =>
      current?.id === postId
        ? {
            ...current,
            likes: Math.max(0, current.likes + (alreadyLiked ? -1 : 1)),
          }
        : current
    );
  };

  const openPost = (post: BlogPost) => {
    const updatedPost = { ...post, views: post.views + 1 };

    setPosts((current) =>
      current.map((item) => (item.id === post.id ? updatedPost : item))
    );

    setSelected(updatedPost);
    setCommentInput("");
  };

  const performSearch = () => {
    Keyboard.dismiss();
    setQuery(search);
    setVisibleCount(5);
  };

  const publishBlog = () => {
    const title = titleInput.trim();
    const content = bodyInput.trim();

    if (!title || !content) {
      Alert.alert("Missing information", "Title এবং blog content লিখে দাও।");
      return;
    }

    const newPost: BlogPost = {
      id: `local-${Date.now()}`,
      title,
      content,
      author: "You",
      time: "Just now",
      likes: 0,
      comments: 0,
      views: 0,
      mine: true,
      icon: "document-text-outline",
    };

    setPosts((current) => [newPost, ...current]);
    setTitleInput("");
    setBodyInput("");
    setEditorOpen(false);
    setMineOnly(false);
    setSearch("");
    setQuery("");
    setVisibleCount(5);

    Alert.alert("Published!", "তোমার blog feed-এ যোগ হয়েছে।");
  };

  const submitComment = () => {
    if (!selected || !commentInput.trim()) {
      Alert.alert("Comment লিখো", "আগে একটি comment লিখে নাও।");
      return;
    }

    const postId = selected.id;
    const message = commentInput.trim();

    setCommentsByPost((current) => ({
      ...current,
      [postId]: [...(current[postId] ?? []), message],
    }));

    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? { ...post, comments: post.comments + 1 }
          : post
      )
    );

    setSelected((current) =>
      current && current.id === postId
        ? { ...current, comments: current.comments + 1 }
        : current
    );

    setCommentInput("");
    Keyboard.dismiss();
  };

  const sharePost = async (post: BlogPost) => {
    try {
      await Share.share({
        message: `${post.title}\n\n${post.content}\n\nHSCStack Blogs`,
      });
    } catch {
      Alert.alert("Error", "Blog share করা যায়নি।");
    }
  };

  const renderSponsored = () => (
    <View style={styles.sponsoredCard}>
      <View style={styles.sponsoredTop}>
        <View style={styles.sponsoredIcon}>
          <Ionicons name="megaphone-outline" size={27} color="#F0B90B" />
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.sponsoredBadge}>
            <Text style={styles.sponsoredBadgeText}>SPONSORED</Text>
          </View>
          <Text style={styles.sponsoredLabel}>Partner Guide</Text>
        </View>

        <Ionicons name="ellipsis-horizontal" size={20} color="#A69B7D" />
      </View>

      <Text style={styles.sponsoredTitle}>
        Your Ad Goes Here — Reach Readers & Learners
      </Text>

      <Text style={styles.sponsoredDescription}>
        Promote your product or service to the HSCStack community.
      </Text>

      <Pressable
        style={styles.sponsoredCTA}
        onPress={() =>
          Alert.alert(
            "Sponsored",
            "Ad booking feature এখনো backend-এর সঙ্গে যুক্ত করা হয়নি।"
          )
        }
      >
        <Text style={styles.sponsoredCTAText}>Learn More</Text>
        <Ionicons name="arrow-forward" size={15} color="#F0B90B" />
      </Pressable>
    </View>
  );

  const renderBlogCard = (post: BlogPost) => {
    const isLiked = likedIds.includes(post.id);

    return (
      <Pressable
        key={post.id}
        style={styles.blogCard}
        onPress={() => openPost(post)}
      >
        <View style={styles.thumbnail}>
          <Ionicons name={post.icon} size={30} color={theme.primary} />
        </View>

        <View style={styles.blogInfo}>
          <View style={styles.authorRow}>
            <Text numberOfLines={1} style={styles.authorName}>
              {post.author}
            </Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.timeText}>{post.time}</Text>
          </View>

          <Text style={styles.blogTitle} numberOfLines={2}>
            {post.title}
          </Text>

          <View style={styles.engagementRow}>
            <Pressable
              style={styles.engagementItem}
              hitSlop={5}
              onPress={(event) => {
                event.stopPropagation();
                toggleLike(post.id);
              }}
            >
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={15}
                color={isLiked ? "#F16C8D" : theme.muted}
              />
              <Text
                style={[
                  styles.engagementText,
                  isLiked && { color: "#F16C8D" },
                ]}
              >
                {post.likes}
              </Text>
            </Pressable>

            <View style={styles.engagementItem}>
              <Ionicons
                name="chatbubble-outline"
                size={14}
                color={theme.muted}
              />
              <Text style={styles.engagementText}>{post.comments}</Text>
            </View>

            <View style={styles.engagementItem}>
              <Ionicons name="eye-outline" size={15} color={theme.muted} />
              <Text style={styles.engagementText}>{post.views}</Text>
            </View>

            <View style={{ flex: 1 }} />

            <Ionicons
              name="arrow-forward"
              size={16}
              color={theme.primary}
            />
          </View>
        </View>
      </Pressable>
    );
  };

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>
            HSCStack <Text style={{ color: theme.primary }}>Blogs</Text>
          </Text>
          <Text style={styles.headerSubtitle}>
            Ideas, stories & student insights
          </Text>
        </View>

        <Pressable
          style={styles.writeButton}
          onPress={() => setEditorOpen(true)}
        >
          <Ionicons name="add" size={19} color="#FFFFFF" />
          <Text style={styles.writeButtonText}>Write Blog</Text>
        </Pressable>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={theme.muted} />

          <TextInput
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={performSearch}
            placeholder="Search articles..."
            placeholderTextColor={theme.muted}
            returnKeyType="search"
            style={styles.searchInput}
          />

          {search.length > 0 && (
            <Pressable
              onPress={() => {
                setSearch("");
                setQuery("");
              }}
            >
              <Ionicons
                name="close-circle"
                size={17}
                color={theme.muted}
              />
            </Pressable>
          )}
        </View>

        <Pressable style={styles.searchButton} onPress={performSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>

        <Pressable
          style={[
            styles.mineButton,
            mineOnly && { backgroundColor: theme.primary },
          ]}
          onPress={() => {
            setMineOnly((current) => !current);
            setVisibleCount(5);
          }}
        >
          <Ionicons
            name="person-outline"
            size={14}
            color={mineOnly ? "#FFFFFF" : theme.text}
          />
          <Text
            style={[
              styles.mineButtonText,
              mineOnly && { color: "#FFFFFF" },
            ]}
          >
            Mine
          </Text>
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {mineOnly ? "My Blogs" : "Latest Blogs"}
        </Text>
        <Text style={styles.resultCount}>
          {filteredPosts.length} posts
        </Text>
      </View>
    </View>
  );

  // Write Blog editor
  if (editorOpen) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={["top", "left", "right"]}
      >
        <View style={styles.detailHeader}>
          <Pressable
            style={styles.iconButton}
            onPress={() => setEditorOpen(false)}
          >
            <Ionicons name="arrow-back" size={21} color={theme.text} />
          </Pressable>

          <Text style={styles.detailHeaderTitle}>Write Blog</Text>

          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.editorContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.editorHeading}>Share your knowledge</Text>

          <Text style={styles.editorSubtitle}>
            Write something useful for the HSCStack community.
          </Text>

          <Text style={styles.fieldLabel}>Blog title</Text>

          <TextInput
            value={titleInput}
            onChangeText={setTitleInput}
            placeholder="Enter your blog title..."
            placeholderTextColor={theme.muted}
            style={styles.titleInput}
            maxLength={140}
          />

          <Text style={styles.fieldLabel}>Your article</Text>

          <TextInput
            value={bodyInput}
            onChangeText={setBodyInput}
            placeholder="Start writing your blog..."
            placeholderTextColor={theme.muted}
            style={styles.bodyInput}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.editorHint}>
            Demo mode: blogটি আপাতত এই app session-এ থাকবে। Firebase publish
            এখনো যুক্ত করা হয়নি।
          </Text>

          <Pressable style={styles.publishButton} onPress={publishBlog}>
            <Ionicons name="paper-plane-outline" size={17} color="#FFFFFF" />
            <Text style={styles.publishButtonText}>Publish Blog</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Blog detail screen
  if (selected) {
    const currentPost =
      posts.find((post) => post.id === selected.id) ?? selected;

    const isLiked = likedIds.includes(currentPost.id);
    const comments = commentsByPost[currentPost.id] ?? [];

    return (
      <SafeAreaView
        style={styles.container}
        edges={["top", "left", "right"]}
      >
        <View style={styles.detailHeader}>
          <Pressable
            style={styles.iconButton}
            onPress={() => setSelected(null)}
          >
            <Ionicons name="arrow-back" size={21} color={theme.text} />
          </Pressable>

          <Text style={styles.detailHeaderTitle}>Blog Details</Text>

          <Pressable
            style={styles.iconButton}
            onPress={() => sharePost(currentPost)}
          >
            <Ionicons
              name="share-social-outline"
              size={20}
              color={theme.text}
            />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.detailContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.detailThumbnail}>
            <Ionicons
              name={currentPost.icon}
              size={43}
              color={theme.primary}
            />
          </View>

          <View style={styles.detailAuthorRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {currentPost.author.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.authorName}>{currentPost.author}</Text>
              <Text style={styles.timeText}>{currentPost.time}</Text>
            </View>
          </View>

          <Text style={styles.detailTitle}>{currentPost.title}</Text>

          <Text style={styles.detailBody}>{currentPost.content}</Text>

          <View style={styles.detailEngagement}>
            <Pressable
              style={styles.detailAction}
              onPress={() => toggleLike(currentPost.id)}
            >
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={19}
                color={isLiked ? "#F16C8D" : theme.muted}
              />
              <Text style={styles.detailActionText}>
                {currentPost.likes} Likes
              </Text>
            </Pressable>

            <View style={styles.detailAction}>
              <Ionicons
                name="chatbubble-outline"
                size={18}
                color={theme.muted}
              />
              <Text style={styles.detailActionText}>
                {currentPost.comments} Comments
              </Text>
            </View>

            <View style={styles.detailAction}>
              <Ionicons
                name="eye-outline"
                size={18}
                color={theme.muted}
              />
              <Text style={styles.detailActionText}>
                {currentPost.views} Views
              </Text>
            </View>
          </View>

          <View style={styles.commentsSection}>
            <Text style={styles.sectionTitle}>
              Comments ({currentPost.comments})
            </Text>

            {comments.length === 0 ? (
              <Text style={styles.noComments}>
                No comments yet. Be the first to comment.
              </Text>
            ) : (
              comments.map((comment, index) => (
                <View
                  key={`${currentPost.id}-${index}`}
                  style={styles.commentCard}
                >
                  <View style={styles.commentAvatar}>
                    <Text style={styles.avatarText}>Y</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.commentAuthor}>You · Just now</Text>
                    <Text style={styles.commentText}>{comment}</Text>
                  </View>
                </View>
              ))
            )}

            <TextInput
              value={commentInput}
              onChangeText={setCommentInput}
              placeholder="Write a comment..."
              placeholderTextColor={theme.muted}
              style={styles.commentInput}
              multiline
            />

            <Pressable
              style={styles.commentButton}
              onPress={submitComment}
            >
              <Ionicons name="send-outline" size={16} color="#FFFFFF" />
              <Text style={styles.commentButtonText}>Post Comment</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Main blog feed
  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right"]}
    >
      <FlatList
        data={filteredPosts.slice(0, visibleCount)}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item, index }) => (
          <View>
            {renderBlogCard(item)}
            {index === 1 && renderSponsored()}
          </View>
        )}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="newspaper-outline"
              size={42}
              color={theme.muted}
            />
            <Text style={styles.emptyTitle}>No blogs found</Text>
            <Text style={styles.emptyText}>
              Try another search or turn off the Mine filter.
            </Text>

            <Pressable
              style={styles.clearButton}
              onPress={() => {
                setSearch("");
                setQuery("");
                setMineOnly(false);
                setVisibleCount(5);
              }}
            >
              <Text style={styles.clearButtonText}>Clear filters</Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={
          filteredPosts.length > visibleCount ? (
            <Pressable
              style={styles.loadMoreButton}
              onPress={() => setVisibleCount((count) => count + 5)}
            >
              <Text style={styles.loadMoreText}>Load More Blogs</Text>
              <Ionicons
                name="chevron-down"
                size={17}
                color={theme.primary}
              />
            </Pressable>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

function makeStyles(theme: {
  background: string;
  card: string;
  text: string;
  muted: string;
  border: string;
  primary: string;
}) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    feedContent: {
      paddingHorizontal: 16,
      paddingBottom: 28,
      flexGrow: 1,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      paddingTop: 12,
      paddingBottom: 18,
    },

    headerTitle: {
      color: theme.text,
      fontSize: 24,
      fontWeight: "800",
      letterSpacing: -0.6,
    },

    headerSubtitle: {
      color: theme.muted,
      fontSize: 11,
      marginTop: 5,
    },

    writeButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: theme.primary,
    },

    writeButtonText: {
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "800",
    },

    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
    },

    searchBox: {
      flex: 1,
      minHeight: 43,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      backgroundColor: theme.card,
    },

    searchInput: {
      flex: 1,
      color: theme.text,
      fontSize: 12,
      paddingVertical: 8,
    },

    searchButton: {
      minHeight: 42,
      justifyContent: "center",
      paddingHorizontal: 10,
      borderRadius: 9,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },

    searchButtonText: {
      color: theme.text,
      fontSize: 11,
      fontWeight: "700",
    },

    mineButton: {
      minHeight: 42,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 9,
      borderRadius: 9,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },

    mineButtonText: {
      color: theme.text,
      fontSize: 11,
      fontWeight: "700",
    },

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 22,
      marginBottom: 12,
    },

    sectionTitle: {
      color: theme.text,
      fontSize: 17,
      fontWeight: "800",
    },

    resultCount: {
      color: theme.muted,
      fontSize: 11,
    },

    blogCard: {
      flexDirection: "row",
      gap: 12,
      padding: 11,
      marginBottom: 11,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 13,
      backgroundColor: theme.card,
    },

    thumbnail: {
      width: 82,
      height: 82,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.background,
    },

    blogInfo: {
      flex: 1,
      justifyContent: "center",
      minWidth: 0,
    },

    authorRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      minWidth: 0,
    },

    authorName: {
      color: theme.text,
      fontSize: 10,
      fontWeight: "700",
      flexShrink: 1,
    },

    dot: {
      color: theme.muted,
      fontSize: 11,
    },

    timeText: {
      color: theme.muted,
      fontSize: 10,
    },

    blogTitle: {
      color: theme.text,
      fontSize: 13,
      lineHeight: 19,
      fontWeight: "800",
      marginTop: 7,
    },

    engagementRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginTop: 9,
    },

    engagementItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },

    engagementText: {
      color: theme.muted,
      fontSize: 10,
    },

    sponsoredCard: {
      padding: 13,
      marginBottom: 12,
      borderRadius: 13,
      borderWidth: 1,
      borderColor: "#6B5316",
      backgroundColor: "#1A1408",
    },

    sponsoredTop: {
      flexDirection: "row",
      alignItems: "center",
      gap: 9,
    },

    sponsoredIcon: {
      width: 52,
      height: 52,
      borderRadius: 10,
      backgroundColor: "#30240B",
      alignItems: "center",
      justifyContent: "center",
    },

    sponsoredBadge: {
      alignSelf: "flex-start",
      backgroundColor: "#F0B90B",
      paddingHorizontal: 7,
      paddingVertical: 4,
      borderRadius: 5,
    },

    sponsoredBadgeText: {
      color: "#211A08",
      fontSize: 9,
      fontWeight: "900",
    },

    sponsoredLabel: {
      color: "#E6D6A5",
      fontSize: 11,
      fontWeight: "600",
      marginTop: 4,
    },

    sponsoredTitle: {
      color: "#FFF4D0",
      fontSize: 15,
      lineHeight: 21,
      fontWeight: "800",
      marginTop: 12,
    },

    sponsoredDescription: {
      color: "#C8BA94",
      fontSize: 11,
      lineHeight: 17,
      marginTop: 5,
    },

    sponsoredCTA: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: 6,
      marginTop: 11,
      paddingVertical: 5,
    },

    sponsoredCTAText: {
      color: "#F0B90B",
      fontSize: 11,
      fontWeight: "800",
    },

    loadMoreButton: {
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      marginTop: 3,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },

    loadMoreText: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: "700",
    },

    emptyState: {
      alignItems: "center",
      paddingVertical: 45,
    },

    emptyTitle: {
      color: theme.text,
      fontSize: 17,
      fontWeight: "800",
      marginTop: 12,
    },

    emptyText: {
      color: theme.muted,
      fontSize: 12,
      textAlign: "center",
      marginTop: 6,
    },

    clearButton: {
      marginTop: 14,
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 9,
      backgroundColor: theme.primary,
    },

    clearButtonText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "700",
    },

    detailHeader: {
      minHeight: 54,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },

    iconButton: {
      width: 38,
      height: 38,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      backgroundColor: theme.card,
    },

    detailHeaderTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "800",
    },

    detailContent: {
      padding: 17,
      paddingBottom: 35,
    },

    detailThumbnail: {
      height: 150,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 17,
    },

    detailAuthorRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    avatar: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },

    avatarText: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: "800",
    },

    detailTitle: {
      color: theme.text,
      fontSize: 24,
      lineHeight: 33,
      fontWeight: "800",
      marginTop: 18,
    },

    detailBody: {
      color: theme.text,
      fontSize: 14,
      lineHeight: 26,
      marginTop: 18,
    },

    detailEngagement: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 15,
      paddingVertical: 15,
      marginTop: 20,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.border,
    },

    detailAction: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },

    detailActionText: {
      color: theme.muted,
      fontSize: 11,
      fontWeight: "600",
    },

    commentsSection: {
      marginTop: 22,
    },

    noComments: {
      color: theme.muted,
      fontSize: 12,
      marginTop: 12,
    },

    commentCard: {
      flexDirection: "row",
      gap: 9,
      padding: 11,
      marginTop: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },

    commentAvatar: {
      width: 29,
      height: 29,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.background,
    },

    commentAuthor: {
      color: theme.text,
      fontSize: 10,
      fontWeight: "800",
    },

    commentText: {
      color: theme.text,
      fontSize: 12,
      lineHeight: 18,
      marginTop: 5,
    },

    commentInput: {
      minHeight: 75,
      padding: 12,
      marginTop: 16,
      color: theme.text,
      fontSize: 13,
      textAlignVertical: "top",
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      backgroundColor: theme.card,
    },

    commentButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      minHeight: 42,
      marginTop: 9,
      borderRadius: 10,
      backgroundColor: theme.primary,
    },

    commentButtonText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "800",
    },

    editorContent: {
      padding: 18,
      paddingBottom: 35,
    },

    editorHeading: {
      color: theme.text,
      fontSize: 23,
      fontWeight: "800",
      marginTop: 8,
    },

    editorSubtitle: {
      color: theme.muted,
      fontSize: 12,
      lineHeight: 19,
      marginTop: 7,
      marginBottom: 23,
    },

    fieldLabel: {
      color: theme.text,
      fontSize: 12,
      fontWeight: "800",
      marginBottom: 8,
      marginTop: 12,
    },

    titleInput: {
      minHeight: 46,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      color: theme.text,
      backgroundColor: theme.card,
      fontSize: 13,
    },

    bodyInput: {
      minHeight: 220,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      color: theme.text,
      backgroundColor: theme.card,
      fontSize: 13,
      lineHeight: 21,
    },

    editorHint: {
      color: theme.muted,
      fontSize: 11,
      lineHeight: 17,
      marginTop: 10,
    },

    publishButton: {
      minHeight: 46,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginTop: 20,
      borderRadius: 10,
      backgroundColor: theme.primary,
    },

    publishButtonText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "800",
    },
  });
}