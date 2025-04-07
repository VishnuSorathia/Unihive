import React from "react";
import { View, ScrollView, Image, Text, TouchableOpacity, StyleSheet } from "react-native";

const StoryCarousel = ({ stories = [] }) => {
  if (!Array.isArray(stories) || stories.length === 0) {
    return <Text style={styles.noStories}>No Stories Available</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {stories.map((story, index) => (
          <TouchableOpacity key={story.id || index} style={styles.storyItem}>
            {story?.user?.avatar ? (
              <Image source={{ uri: story.user.avatar }} style={styles.storyImage} />
            ) : (
              <View style={styles.placeholder} />
            )}
            <Text style={styles.storyRank}>#{index + 1}</Text>
            <Text style={styles.storyLikes}>♥️ {story.likes || 0}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 120, padding: 10 },
  noStories: { textAlign: "center", fontSize: 16, color: "#999", marginVertical: 20 },
  storyItem: { marginRight: 15, alignItems: "center" },
  storyImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#ff4757",
  },
  placeholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ddd",
    borderWidth: 2,
    borderColor: "#ff4757",
  },
  storyRank: { fontSize: 12, fontWeight: "bold", marginTop: 5 },
  storyLikes: { fontSize: 10, color: "#666" },
});

export default StoryCarousel;
