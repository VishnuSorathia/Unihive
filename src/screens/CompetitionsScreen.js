import React, { useState, useEffect } from "react";
import { 
  View, 
  FlatList, 
  Image, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal,
  StatusBar,
  Dimensions,
  SafeAreaView,
  Platform
} from "react-native";
import { usePosts } from "../context/PostContext";
import { Picker } from "@react-native-picker/picker";
import { Entypo, AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

const CompetitionsScreen = () => {
  const { state } = usePosts();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [competitionCategories, setCompetitionCategories] = useState(["All"]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [rankingModalVisible, setRankingModalVisible] = useState(false);
  const [selectedRankingCategory, setSelectedRankingCategory] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const { currentTheme } = useTheme();

  useEffect(() => {
    const uniqueCategories = [
      ...new Set(state.posts.filter((post) => post.type === "competition" && post.category).map((post) => post.category)),
    ];
    setCompetitionCategories(["All", ...uniqueCategories]);
  }, [state.posts]);

  const filteredPosts = state.posts.filter((post) =>
    post.type === "competition" && (selectedCategory === "all" || post.category?.toLowerCase() === selectedCategory.toLowerCase())
  );

  const getTopRankedPosts = (category) => {
    return state.posts
      .filter((post) => post.type === "competition" && post.category === category)
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 10);
  };

  // Function to handle closing the ranking modal
  const handleCloseRankingModal = () => {
    setRankingModalVisible(false);
    // Reset the selected ranking category when modal is closed
    setSelectedRankingCategory(null);
  };

  const renderPostItem = ({ item, index }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <View style={styles.postHeaderLeft}>
          <View style={styles.postAvatar}>
            <Text style={styles.postAvatarText}>{item.category?.charAt(0) || 'C'}</Text>
          </View>
          <View>
            <Text style={[styles.postUsername, { color: currentTheme.text }]}>{item.category}</Text>
            <Text style={styles.postTimestamp}>Competition Entry</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Feather name="more-horizontal" size={24} color={currentTheme.text} />
        </TouchableOpacity>
      </View>
      
      {item.file && (
        <TouchableOpacity activeOpacity={0.95} onPress={() => setSelectedPost(item)}>
          <Image source={{ uri: item.file }} style={styles.image} />
        </TouchableOpacity>
      )}
      
      <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>
          <TouchableOpacity style={styles.actionButton}>
            <AntDesign name="hearto" size={24} color={currentTheme.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="message-circle" size={24} color={currentTheme.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="send" size={24} color={currentTheme.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Feather name="bookmark" size={24} color={currentTheme.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.postFooter}>
        <Text style={[styles.likesText, { color: currentTheme.text }]}>{item.likes} likes</Text>
        {item.caption && <Text style={[styles.captionText, { color: currentTheme.text }]}>
          <Text style={[styles.postUsername, { color: currentTheme.text }]}>{item.category}</Text> {item.caption}
        </Text>}
        <Text style={styles.commentsText}>View all comments</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]}>
      <StatusBar barStyle={currentTheme.isDark ? "light-content" : "dark-content"} />
      
      <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerText, { color: currentTheme.text }]}>Competitions</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => setRankingModalVisible(true)} style={styles.rankingButton}>
              <MaterialIcons name="leaderboard" size={18} color="white" />
              <Text style={styles.rankingButtonText}>Rankings</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, { backgroundColor: currentTheme.cardBackground }]} 
              onPress={() => setDropdownVisible(!dropdownVisible)}
            >
              <Feather name="filter" size={18} color={currentTheme.text} />
            </TouchableOpacity>
          </View>
        </View>

        {dropdownVisible && (
          <View style={[styles.filterContainer, { borderBottomColor: currentTheme.border }]}>
            <Text style={[styles.filterTitle, { color: currentTheme.text }]}>Filter by category:</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={competitionCategories}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.filterItem, 
                    { backgroundColor: selectedCategory === item.toLowerCase() ? currentTheme.primary : currentTheme.cardBackground }
                  ]}
                  onPress={() => {
                    setSelectedCategory(item.toLowerCase());
                    setDropdownVisible(false);
                  }}
                >
                  <Text 
                    style={[
                      styles.filterItemText, 
                      { color: selectedCategory === item.toLowerCase() ? 'white' : currentTheme.text }
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.filterList}
            />
          </View>
        )}

        {filteredPosts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="bubble-chart" size={80} color={currentTheme.placeholder} />
            <Text style={[styles.noCompetitionsText, { color: currentTheme.text }]}>No Competitions</Text>
            <Text style={[styles.emptySubtitle, { color: currentTheme.placeholder }]}>Be the first to enter a competition in this category!</Text>
          </View>
        ) : (
          <FlatList
            data={filteredPosts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPostItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.postsList}
          />
        )}

        <Modal
          visible={rankingModalVisible}
          animationType="slide"
          statusBarTranslucent
          onRequestClose={handleCloseRankingModal}
        >
          <SafeAreaView style={[styles.modalSafeArea, { backgroundColor: currentTheme.background }]}>
            <View style={[styles.modalContainer, { backgroundColor: currentTheme.background }]}>
              <View style={[styles.rankingHeader, { borderBottomColor: currentTheme.border }]}>
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={handleCloseRankingModal}
                >
                  <AntDesign name="arrowleft" size={24} color={currentTheme.text} />
                </TouchableOpacity>
                <Text style={[styles.rankingHeaderText, { color: currentTheme.text }]}>
                  🏆 {selectedRankingCategory ? selectedRankingCategory : "Competition Rankings"}
                </Text>
                {selectedRankingCategory && (
                  <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={() => setSelectedRankingCategory(null)}
                  >
                    <AntDesign name="close" size={24} color={currentTheme.text} />
                  </TouchableOpacity>
                )}
              </View>

              {!selectedRankingCategory ? (
                <FlatList
                  data={competitionCategories.slice(1)}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.categoryButton, { backgroundColor: currentTheme.cardBackground }]}
                      onPress={() => setSelectedRankingCategory(item)}
                    >
                      <View style={styles.categoryIconContainer}>
                        <Text style={styles.categoryIcon}>{item.charAt(0)}</Text>
                      </View>
                      <Text style={[styles.categoryButtonText, { color: currentTheme.text }]}>{item}</Text>
                      <AntDesign name="right" size={16} color={currentTheme.placeholder} />
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.competitionList}
                />
              ) : (
                <FlatList
                  data={getTopRankedPosts(selectedRankingCategory)}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity 
                      style={[styles.rankPost, { backgroundColor: currentTheme.cardBackground }]}
                      onPress={() => setSelectedPost(item)}
                    >
                      <View style={[styles.rankBadge, index < 3 ? styles[`topRank${index + 1}`] : styles.normalRank]}>
                        <Text style={styles.rankText}>{index + 1}</Text>
                      </View>
                      <Image source={{ uri: item.file }} style={styles.rankImage} />
                      <View style={styles.rankInfo}>
                        <Text style={[styles.rankCaption, { color: currentTheme.text }]} numberOfLines={1}>
                          {item.caption || "Competition Entry"}
                        </Text>
                        <Text style={[styles.likesText, { color: currentTheme.textSecondary }]}>❤️ {item.likes} Likes</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.rankingList}
                  ListEmptyComponent={
                    <View style={styles.emptyRankingContainer}>
                      <MaterialIcons name="emoji-events" size={80} color={currentTheme.placeholder} />
                      <Text style={[styles.emptyRankingText, { color: currentTheme.text }]}>No entries yet</Text>
                      <Text style={[styles.emptyRankingSubtext, { color: currentTheme.placeholder }]}>
                        Be the first to participate in this competition!
                      </Text>
                    </View>
                  }
                />
              )}
            </View>
          </SafeAreaView>
        </Modal>

        {selectedPost && (
          <Modal visible={true} transparent={true} statusBarTranslucent onRequestClose={() => setSelectedPost(null)}>
            <BlurView intensity={90} style={styles.fullScreenContainer}>
              <TouchableOpacity 
                style={styles.closeFullScreen}
                onPress={() => setSelectedPost(null)}
              >
                <AntDesign name="close" size={24} color="white" />
              </TouchableOpacity>
              <Image source={{ uri: selectedPost.file }} style={styles.fullScreenImage} />
              <View style={styles.fullScreenInfo}>
                <Text style={styles.fullScreenLikes}>❤️ {selectedPost.likes} Likes</Text>
                {selectedPost.caption && (
                  <Text style={styles.fullScreenCaption}>{selectedPost.caption}</Text>
                )}
                <Text style={styles.fullScreenCategory}>Category: {selectedPost.category}</Text>
              </View>
            </BlurView>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  modalSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: { 
    flex: 1,
  },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#DDDDDD",
  },
  headerText: { 
    fontSize: 22, 
    fontWeight: "700", 
  },
  headerButtons: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  rankingButton: { 
    backgroundColor: "#6200EA", 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 16, 
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  rankingButtonText: { 
    color: "white", 
    fontWeight: "600",
    marginLeft: 4,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  filterList: {
    paddingBottom: 4,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  filterItemText: {
    fontWeight: "500",
  },
  postsList: {
    paddingBottom: 20,
  },
  postContainer: { 
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  postHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  postAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#6200EA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  postAvatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  postUsername: {
    fontWeight: "600",
    fontSize: 14,
  },
  postTimestamp: {
    fontSize: 12,
    color: "#999",
  },
  image: { 
    width: "100%", 
    height: width,
    resizeMode: "cover",
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  postActionsLeft: {
    flexDirection: "row",
  },
  actionButton: {
    marginRight: 16,
  },
  postFooter: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  likesText: { 
    fontWeight: "600",
    marginBottom: 4,
  },
  captionText: {
    marginBottom: 4,
  },
  commentsText: {
    color: "#999",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  noCompetitionsText: { 
    fontSize: 20, 
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: "center",
    fontSize: 16,
  },
  modalContainer: { 
    flex: 1, 
  },
  rankingHeader: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  rankingHeaderText: { 
    fontSize: 18, 
    fontWeight: "600",
  },
  competitionList: { 
    padding: 16,
    paddingBottom: 40,
  },
  categoryButton: { 
    flexDirection: "row",
    alignItems: "center",
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6200EA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryIcon: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  categoryButtonText: { 
    flex: 1,
    fontSize: 16, 
    fontWeight: "500",
  },
  rankingList: {
    padding: 16,
    paddingBottom: 40,
  },
  rankPost: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 16, 
    padding: 12, 
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#DDD",
  },
  topRank1: {
    backgroundColor: "#FFD700",
  },
  topRank2: {
    backgroundColor: "#C0C0C0",
  },
  topRank3: {
    backgroundColor: "#CD7F32",
  },
  normalRank: {
    backgroundColor: "#EEEEEE",
  },
  rankText: { 
    fontSize: 14, 
    fontWeight: "bold",
    color: "#333",
  },
  rankImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 8,
  },
  rankInfo: {
    flex: 1,
    marginLeft: 12,
  },
  rankCaption: {
    fontWeight: "500",
    marginBottom: 4,
  },
  fullScreenContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
  },
  closeFullScreen: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: { 
    width: "90%", 
    height: "60%", 
    resizeMode: "contain", 
    borderRadius: 12,
  },
  fullScreenInfo: {
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    width: "90%",
  },
  fullScreenLikes: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  fullScreenCaption: {
    color: "white",
    fontSize: 16,
    marginBottom: 8,
  },
  fullScreenCategory: {
    color: "#CCC",
    fontSize: 14,
  },
  emptyRankingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyRankingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyRankingSubtext: {
    textAlign: 'center',
    fontSize: 14,
  }
});

export default CompetitionsScreen;