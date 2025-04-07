import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Animated } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { usePosts } from "../context/PostContext";
import { useTheme } from "../context/ThemeContext";

const StoriesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { type } = route.params;
  const { posts } = usePosts();
  const { currentTheme, interpolatedColors } = useTheme();

  const filteredStories = posts.filter((post) => post.type === type && post.isStory);

  const renderItem = ({ item }) => (
    <View style={styles.storyContainer}>
      <Image source={{ uri: item.file }} style={styles.storyImage} />
      <Text style={[styles.storyCaption, { color: currentTheme.text }]}>{item.caption}</Text>
    </View>
  );

  return (
    <Animated.View style={[styles.container, { backgroundColor: interpolatedColors.background }]}> 
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={[styles.backText, { color: currentTheme.text }]}>Back</Text>
      </TouchableOpacity>
      <FlatList
        data={filteredStories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.storiesList}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: { padding: 10, backgroundColor: "#ddd" },
  backText: { fontSize: 16 },
  storiesList: { padding: 10 },
  storyContainer: { marginBottom: 20 },
  storyImage: { width: "100%", height: 300, borderRadius: 10 },
  storyCaption: { marginTop: 5, fontSize: 16 },
});

export default StoriesScreen;