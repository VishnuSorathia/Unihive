import React from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { usePosts } from "../context/PostContext";
import { useTheme } from "../context/ThemeContext";

const LikedPostsScreen = () => {
  const navigation = useNavigation();
  const { state } = usePosts(); // ✅ Get liked posts from global state
  const { currentTheme, interpolatedColors } = useTheme();

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <Image source={{ uri: item.file }} style={styles.image} />
      <Text style={[styles.caption, { color: currentTheme.text }]}>{item.caption}</Text>
    </View>
  );

  return (
    <Animated.View style={[styles.container, { backgroundColor: interpolatedColors.background }]}> 
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={[styles.backText, { color: currentTheme.text }]}>Back</Text>
      </TouchableOpacity>
      <FlatList
        data={state.likedPosts} // ✅ Ensure it pulls liked posts from all screens
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.postsList}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backButton: { padding: 10, backgroundColor: "#ddd" },
  backText: { fontSize: 16 },
  postsList: { padding: 10 },
  postContainer: { marginBottom: 20 },
  image: { width: "100%", height: 300, borderRadius: 10 },
  caption: { marginTop: 5, fontSize: 16 },
});

export default LikedPostsScreen;
