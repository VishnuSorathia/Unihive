import React from "react";
import { View, FlatList, Image, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { usePosts } from "../context/PostContext";
import { useTheme } from "../context/ThemeContext";
import { Feather, FontAwesome } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const BusinessScreen = () => {
  const { state } = usePosts();
  const { currentTheme } = useTheme();
  const businessPosts = state.posts.filter((post) => post.type === "business");

  const renderPost = ({ item }) => {
    return (
      <View style={[styles.postContainer, { backgroundColor: currentTheme.cardBackground }]}>
        <View style={styles.postHeader}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.userInitial}>B</Text>
            </View>
            <Text style={[styles.username, { color: currentTheme.text }]}>Business</Text>
          </View>
          <TouchableOpacity>
            <Feather name="more-horizontal" size={24} color={currentTheme.text} />
          </TouchableOpacity>
        </View>
        
        {item.file && (
          <Image 
            source={{ uri: item.file }} 
            style={styles.image} 
            resizeMode="cover"
          />
        )}
        
        <View style={styles.postActions}>
          <View style={styles.leftActions}>
            <TouchableOpacity style={styles.actionButton}>
              <FontAwesome name="heart-o" size={24} color={currentTheme.text} />
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
        
        <View style={styles.postDetails}>
          <Text style={[styles.likes, { color: currentTheme.text }]}>{item.likes} likes</Text>
          <Text style={[styles.caption, { color: currentTheme.text }]}>
            <Text style={styles.username}>Business </Text>
            {item.caption}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      {businessPosts.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Feather name="briefcase" size={64} color={currentTheme.placeholderText} />
          <Text style={[styles.noPostsText, { color: currentTheme.placeholderText }]}>
            No Business Posts Yet
          </Text>
          <Text style={[styles.emptyStateSubtitle, { color: currentTheme.placeholderText }]}>
            Business posts will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={businessPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noPostsText: { 
    textAlign: "center", 
    fontSize: 20, 
    fontWeight: "bold",
    marginTop: 16,
  },
  emptyStateSubtitle: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 8,
  },
  postContainer: { 
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#6200EA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  userInitial: {
    color: "#fff",
    fontWeight: "bold",
  },
  username: {
    fontWeight: "600",
  },
  image: { 
    width: width, 
    height: width, 
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  leftActions: {
    flexDirection: "row",
  },
  actionButton: {
    marginRight: 16,
  },
  postDetails: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  likes: {
    fontWeight: "600",
    marginBottom: 4,
  },
  caption: {
    lineHeight: 18,
  },
});

export default BusinessScreen;