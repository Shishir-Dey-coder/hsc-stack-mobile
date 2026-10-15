import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";

import {
  Alert,
  FlatList,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/theme/ThemeProvider";

type Peer = {
  id: string;
  name: string;
  username: string;
  college: string;
  appreciators: number;
  avatarColor: string;
  avatarTextColor: string;
};

const INITIAL_PEERS: Peer[] = [
  {
    id: "1",
    name: "MD. ABDUL MUHIT",
    username: "abdul_muhit",
    college: "Rangpur Govt. College",
    appreciators: 0,
    avatarColor: "#7257D9",
    avatarTextColor: "#FFFFFF",
  },
  {
    id: "2",
    name: "rgc khan",
    username: "rgc_khan",
    college: "Rangpur Govt. College",
    appreciators: 0,
    avatarColor: "#2765A8",
    avatarTextColor: "#FFFFFF",
  },
  {
    id: "3",
    name: "SOMETHINGs",
    username: "somethings",
    college: "Rangpur Govt. College",
    appreciators: 0,
    avatarColor: "#A35BCE",
    avatarTextColor: "#FFFFFF",
  },
  {
    id: "4",
    name: "Md Mahir Muntassir Shammo",
    username: "mahir_shammo",
    college: "Rangpur Govt. College",
    appreciators: 0,
    avatarColor: "#267C72",
    avatarTextColor: "#FFFFFF",
  },
  {
    id: "5",
    name: "Nusrat Tasnim",
    username: "nusrat_tasnim",
    college: "Rangpur Govt. College",
    appreciators: 0,
    avatarColor: "#B84E83",
    avatarTextColor: "#FFFFFF",
  },
  {
    id: "6",
    name: "Mitoushe Rahman",
    username: "mitoushe",
    college: "Rangpur Govt. College",
    appreciators: 0,
    avatarColor: "#C47A35",
    avatarTextColor: "#FFFFFF",
  },
  {
    id: "7",
    name: "Rangpur City",
    username: "rangpur_city",
    college: "Rangpur Govt. College",
    appreciators: 0,
    avatarColor: "#4778BB",
    avatarTextColor: "#FFFFFF",
  },
  {
    id: "8",
    name: "Dulari Jenia",
    username: "dulari_jenia",
    college: "Rangpur Govt. College",
    appreciators: 0,
    avatarColor: "#B85D65",
    avatarTextColor: "#FFFFFF",
  },
  {
    id: "9",
    name: "Saif Alam",
    username: "saif_alam",
    college: "Rangpur Govt. College",
    appreciators: 0,
    avatarColor: "#54884B",
    avatarTextColor: "#FFFFFF",
  },
  {
    id: "10",
    name: "Navojit Addrito Roy",
    username: "navojit_roy",
    college: "Rangpur Govt. College",
    appreciators: 0,
    avatarColor: "#6D63BA",
    avatarTextColor: "#FFFFFF",
  },
  {
    id: "11",
    name: "Arzina Akther",
    username: "arzina_akther",
    college: "Rangpur Govt. College",
    appreciators: 0,
    avatarColor: "#C05B9C",
    avatarTextColor: "#FFFFFF",
  },
  {
    id: "12",
    name: "Afiya Mobashara",
    username: "afiya_mobashara",
    college: "Rangpur Govt. College",
    appreciators: 0,
    avatarColor: "#3C8F9D",
    avatarTextColor: "#FFFFFF",
  },
  {
    id: "13",
    name: "Badhon Sarker",
    username: "badhon_sarker",
    college: "Rangpur Govt. College",
    appreciators: 0,
    avatarColor: "#8B684A",
    avatarTextColor: "#FFFFFF",
  },
  {
    id: "14",
    name: "Tawfiqur Rahman",
    username: "tawfiqur",
    college: "Rangpur Govt. College",
    appreciators: 0,
    avatarColor: "#526FC1",
    avatarTextColor: "#FFFFFF",
  },
  {
    id: "15",
    name: "Miskatul Jannat",
    username: "miskatul",
    college: "Rangpur Govt. College",
    appreciators: 0,
    avatarColor: "#A15DB8",
    avatarTextColor: "#FFFFFF",
  },
  {
    id: "16",
    name: "Sazid Shahriar",
    username: "sazid_shahriar",
    college: "Rangpur Govt. College",
    appreciators: 0,
    avatarColor: "#39816D",
    avatarTextColor: "#FFFFFF",
  },
  {
    id: "17",
    name: "Bornona Husain",
    username: "bornona",
    college: "Rangpur Govt. College",
    appreciators: 0,
    avatarColor: "#BA7453",
    avatarTextColor: "#FFFFFF",
  },
];

const EXTRA_PEERS: Peer[] = [
  {
    id: "18",
    name: "Student Explorer",
    username: "student_explorer",
    college: "Rangpur Govt. College",
    appreciators: 0,
    avatarColor: "#4F68A8",
    avatarTextColor: "#FFFFFF",
  },
  {
    id: "19",
    name: "Future Achiever",
    username: "future_achiever",
    college: "Rangpur Govt. College",
    appreciators: 0,
    avatarColor: "#A45C83",
    avatarTextColor: "#FFFFFF",
  },
  {
    id: "20",
    name: "Study Champion",
    username: "study_champion",
    college: "Rangpur Govt. College",
    appreciators: 0,
    avatarColor: "#458879",
    avatarTextColor: "#FFFFFF",
  },
];

type PeerCardProps = {
  peer: Peer;
  appreciated: boolean;
  onAppreciate: (id: string) => void;
  colors: any;
};

function PeerCard({
  peer,
  appreciated,
  onAppreciate,
  colors,
}: PeerCardProps) {
  const initial = peer.name.trim().charAt(0).toUpperCase();

  return (
    <View
      style={[
        styles.peerCard,
        {
          backgroundColor: colors.card ?? "#151B26",
          borderColor: colors.border ?? "#273142",
        },
      ]}
    >
      <View
        style={[
          styles.avatar,
          { backgroundColor: peer.avatarColor },
        ]}
      >
        <Text
          style={[
            styles.avatarText,
            { color: peer.avatarTextColor },
          ]}
        >
          {initial}
        </Text>
      </View>

      <View style={styles.peerInfo}>
        <Text
          style={[styles.peerName, { color: colors.text }]}
          numberOfLines={1}
        >
          {peer.name}
        </Text>

        <Text
          style={styles.username}
          numberOfLines={1}
        >
          @{peer.username}
        </Text>

        <View style={styles.collegeRow}>
          <Ionicons
            name="school-outline"
            size={13}
            color={colors.textMuted ?? "#8B95A7"}
          />

          <Text
            style={[
              styles.collegeText,
              { color: colors.textMuted ?? "#8B95A7" },
            ]}
            numberOfLines={1}
          >
            {peer.college}
          </Text>
        </View>

        <View style={styles.appreciatorRow}>
          <Ionicons
            name="heart"
            size={12}
            color={appreciated ? "#FF5C8A" : "#9B8AFB"}
          />

          <Text
            style={[
              styles.appreciatorText,
              { color: colors.textMuted ?? "#8B95A7" },
            ]}
          >
            {peer.appreciators + (appreciated ? 1 : 0)} Appreciators
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => onAppreciate(peer.id)}
        accessibilityRole="button"
        accessibilityLabel={
          appreciated
            ? `Remove appreciation for ${peer.name}`
            : `Appreciate ${peer.name}`
        }
        style={({ pressed }) => [
          styles.heartButton,
          appreciated && styles.heartButtonActive,
          pressed && styles.pressed,
        ]}
      >
        <Ionicons
          name={appreciated ? "heart" : "heart-outline"}
          size={21}
          color={appreciated ? "#FFFFFF" : "#B6A9FF"}
        />
      </Pressable>
    </View>
  );
}

export default function PeopleScreen() {
  const { colors } = useAppTheme();

  const [searchText, setSearchText] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [activeTab, setActiveTab] = useState<
    "suggested" | "appreciated"
  >("suggested");

  const [appreciatedIds, setAppreciatedIds] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [showAll, setShowAll] = useState(false);

  const allPeers = useMemo(
    () => [...INITIAL_PEERS, ...(showAll ? EXTRA_PEERS : [])],
    [showAll]
  );

  const filteredPeers = useMemo(() => {
    const query = submittedSearch.trim().toLowerCase();

    let result = allPeers.filter((peer) => {
      if (!query) return true;

      return (
        peer.name.toLowerCase().includes(query) ||
        peer.username.toLowerCase().includes(query) ||
        peer.college.toLowerCase().includes(query)
      );
    });

    if (activeTab === "appreciated") {
      result = [...result].sort((a, b) => {
        const aCount =
          a.appreciators + (appreciatedIds.includes(a.id) ? 1 : 0);
        const bCount =
          b.appreciators + (appreciatedIds.includes(b.id) ? 1 : 0);

        return bCount - aCount;
      });
    }

    return result;
  }, [allPeers, submittedSearch, activeTab, appreciatedIds]);

  const displayedPeers = filteredPeers.slice(
    0,
    showAll ? filteredPeers.length : visibleCount
  );

  const handleSearch = () => {
    Keyboard.dismiss();
    setSubmittedSearch(searchText);
  };

  const handleAppreciate = (id: string) => {
    setAppreciatedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const handleLoadMore = () => {
    if (!showAll) {
      setShowAll(true);
      setVisibleCount((previous) => previous + 8);
      return;
    }

    if (visibleCount < filteredPeers.length) {
      setVisibleCount((previous) => previous + 8);
      return;
    }

    Alert.alert(
      "You're all caught up!",
      "There are no more demo peers to show right now."
    );
  };

  const openLeaderboard = () => {
    const leaderboard = [...allPeers]
      .map((peer) => ({
        ...peer,
        total: peer.appreciators +
          (appreciatedIds.includes(peer.id) ? 1 : 0),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const message = leaderboard
      .map(
        (peer, index) =>
          `${index + 1}. ${peer.name} — ${peer.total} Appreciators`
      )
      .join("\n");

    Alert.alert("🏆 Leaderboard", message);
  };

  const renderPeer = ({ item }: { item: Peer }) => (
    <PeerCard
      peer={item}
      appreciated={appreciatedIds.includes(item.id)}
      onAppreciate={handleAppreciate}
      colors={colors}
    />
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
      edges={["top", "left", "right"]}
    >
      <FlatList
        data={displayedPeers}
        keyExtractor={(item) => item.id}
        renderItem={renderPeer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headingLeft}>
                <View style={styles.headingIcon}>
                  <Ionicons
                    name="people"
                    size={23}
                    color="#B6A2FF"
                  />
                </View>

                <View style={styles.headingText}>
                  <Text
                    style={[
                      styles.title,
                      { color: colors.text },
                    ]}
                  >
                    Find Peers
                  </Text>

                  <Text
                    style={[
                      styles.subtitle,
                      { color: colors.textMuted ?? "#929BAA" },
                    ]}
                  >
                    Connect with fellow students
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={openLeaderboard}
                style={({ pressed }) => [
                  styles.leaderboardButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name="trophy"
                  size={16}
                  color="#FFD166"
                />

                <Text style={styles.leaderboardText}>
                  Leaderboard
                </Text>
              </Pressable>
            </View>

            {/* Search */}
            <View
              style={[
                styles.searchContainer,
                {
                  backgroundColor: colors.card ?? "#151B26",
                  borderColor: colors.border ?? "#273142",
                },
              ]}
            >
              <Ionicons
                name="search-outline"
                size={20}
                color={colors.textMuted ?? "#8B95A7"}
              />

              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                placeholder="Search by name, @username, or college..."
                placeholderTextColor={
                  colors.textMuted ?? "#8B95A7"
                }
                style={[
                  styles.searchInput,
                  { color: colors.text },
                ]}
                autoCapitalize="none"
                autoCorrect={false}
              />

              {searchText.length > 0 && (
                <Pressable
                  onPress={() => {
                    setSearchText("");
                    setSubmittedSearch("");
                    Keyboard.dismiss();
                  }}
                  hitSlop={8}
                >
                  <Ionicons
                    name="close-circle"
                    size={19}
                    color={colors.textMuted ?? "#8B95A7"}
                  />
                </Pressable>
              )}

              <Pressable
                onPress={handleSearch}
                style={({ pressed }) => [
                  styles.searchButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.searchButtonText}>
                  Search
                </Text>
              </Pressable>
            </View>

            {/* Section title */}
            <View style={styles.sectionHeader}>
              <View>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: colors.text },
                  ]}
                >
                  Discover Students
                </Text>

                <Text
                  style={[
                    styles.sectionSubtitle,
                    { color: colors.textMuted ?? "#8B95A7" },
                  ]}
                >
                  Find your next study buddy
                </Text>
              </View>

              <View style={styles.countBadge}>
                <Text style={styles.countText}>
                  {filteredPeers.length} peers
                </Text>
              </View>
            </View>

            {/* Tabs */}
            <View
              style={[
                styles.tabsContainer,
                {
                  backgroundColor: colors.card ?? "#151B26",
                  borderColor: colors.border ?? "#273142",
                },
              ]}
            >
              <Pressable
                onPress={() => {
                  setActiveTab("suggested");
                  setVisibleCount(8);
                }}
                style={[
                  styles.tab,
                  activeTab === "suggested" && styles.activeTab,
                ]}
              >
                <Ionicons
                  name="people-outline"
                  size={16}
                  color={
                    activeTab === "suggested"
                      ? "#171324"
                      : colors.textMuted ?? "#8B95A7"
                  }
                />

                <Text
                  style={[
                    styles.tabText,
                    { color: colors.textMuted ?? "#8B95A7" },
                    activeTab === "suggested" && styles.activeTabText,
                  ]}
                >
                  You May Know
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setActiveTab("appreciated");
                  setVisibleCount(8);
                }}
                style={[
                  styles.tab,
                  activeTab === "appreciated" && styles.activeTab,
                ]}
              >
                <Ionicons
                  name="heart-outline"
                  size={16}
                  color={
                    activeTab === "appreciated"
                      ? "#171324"
                      : colors.textMuted ?? "#8B95A7"
                  }
                />

                <Text
                  style={[
                    styles.tabText,
                    { color: colors.textMuted ?? "#8B95A7" },
                    activeTab === "appreciated" && styles.activeTabText,
                  ]}
                >
                  Most Appreciated
                </Text>
              </Pressable>
            </View>

            <View style={styles.listHeading}>
              <Text
                style={[
                  styles.listTitle,
                  { color: colors.text },
                ]}
              >
                {activeTab === "suggested"
                  ? "Students you may know"
                  : "Community favourites"}
              </Text>

              <Text
                style={[
                  styles.listHint,
                  { color: colors.textMuted ?? "#8B95A7" },
                ]}
              >
                Tap the heart to appreciate
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="search-outline"
                size={30}
                color="#B6A2FF"
              />
            </View>

            <Text
              style={[
                styles.emptyTitle,
                { color: colors.text },
              ]}
            >
              No students found
            </Text>

            <Text
              style={[
                styles.emptySubtitle,
                { color: colors.textMuted ?? "#8B95A7" },
              ]}
            >
              Try searching with a different name, username, or college.
            </Text>

            <Pressable
              onPress={() => {
                setSearchText("");
                setSubmittedSearch("");
              }}
              style={styles.clearSearchButton}
            >
              <Text style={styles.clearSearchText}>
                Clear Search
              </Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={
          displayedPeers.length > 0 ? (
            <View style={styles.footer}>
              <Pressable
                onPress={handleLoadMore}
                style={({ pressed }) => [
                  styles.loadMoreButton,
                  {
                    borderColor: colors.border ?? "#30394A",
                    backgroundColor: colors.card ?? "#151B26",
                  },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.loadMoreText}>
                  {displayedPeers.length < filteredPeers.length
                    ? "Load More Peers"
                    : showAll
                      ? "Explore More Students"
                      : "Load More Peers"}
                </Text>

                <Ionicons
                  name="arrow-down-circle-outline"
                  size={19}
                  color="#B6A2FF"
                />
              </Pressable>

              <Text
                style={[
                  styles.footerNote,
                  { color: colors.textMuted ?? "#8B95A7" },
                ]}
              >
                Built for students, powered by community 💜
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 24,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 23,
    gap: 10,
  },

  headingLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  headingIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "rgba(139, 111, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  headingText: {
    flex: 1,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: -0.7,
  },

  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },

  leaderboardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 11,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255, 209, 102, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 209, 102, 0.25)",
  },

  leaderboardText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFD166",
  },

  searchContainer: {
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 9,
    marginBottom: 27,
  },

  searchInput: {
    flex: 1,
    minWidth: 0,
    height: 50,
    fontSize: 12,
    paddingVertical: 0,
  },

  searchButton: {
    height: 35,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#9276FF",
    alignItems: "center",
    justifyContent: "center",
  },

  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 17,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  sectionSubtitle: {
    fontSize: 12,
    marginTop: 5,
  },

  countBadge: {
    backgroundColor: "rgba(146, 118, 255, 0.13)",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },

  countText: {
    color: "#B6A2FF",
    fontSize: 11,
    fontWeight: "800",
  },

  tabsContainer: {
    flexDirection: "row",
    padding: 5,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 23,
    gap: 5,
  },

  tab: {
    flex: 1,
    minHeight: 43,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 4,
  },

  activeTab: {
    backgroundColor: "#F4F0FF",
  },

  tabText: {
    fontSize: 11,
    fontWeight: "700",
  },

  activeTabText: {
    color: "#171324",
    fontWeight: "800",
  },

  listHeading: {
    marginBottom: 13,
  },

  listTitle: {
    fontSize: 15,
    fontWeight: "800",
  },

  listHint: {
    fontSize: 11,
    marginTop: 5,
  },

  peerCard: {
    minHeight: 108,
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
    borderRadius: 17,
    borderWidth: 1,
    marginBottom: 11,
    gap: 12,
  },

  avatar: {
    width: 49,
    height: 49,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 21,
    fontWeight: "800",
  },

  peerInfo: {
    flex: 1,
    minWidth: 0,
  },

  peerName: {
    fontSize: 13,
    fontWeight: "800",
  },

  username: {
    color: "#A99AFF",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },

  collegeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 7,
  },

  collegeText: {
    flex: 1,
    fontSize: 10,
  },

  appreciatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 7,
  },

  appreciatorText: {
    fontSize: 10,
    fontWeight: "600",
  },

  heartButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "rgba(155, 138, 251, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(155, 138, 251, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  heartButtonActive: {
    backgroundColor: "#FF5C8A",
    borderColor: "#FF5C8A",
  },

  footer: {
    marginTop: 7,
    alignItems: "center",
  },

  loadMoreButton: {
    width: "100%",
    minHeight: 51,
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  loadMoreText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#B6A2FF",
  },

  footerNote: {
    fontSize: 10,
    marginTop: 18,
    marginBottom: 8,
  },

  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 42,
  },

  emptyIcon: {
    width: 65,
    height: 65,
    borderRadius: 22,
    backgroundColor: "rgba(146, 118, 255, 0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 17,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
  },

  emptySubtitle: {
    textAlign: "center",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 9,
  },

  clearSearchButton: {
    backgroundColor: "#9276FF",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 11,
    marginTop: 18,
  },

  clearSearchText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  pressed: {
    opacity: 0.75,
  },
});