import React from 'react';
import { View, ScrollView, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

const StoryCarousel = ({ stories }) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {stories.map((story, index) => (
          <TouchableOpacity key={story.id} style={styles.storyItem}>
            <Image source={{ uri: story.user.avatar }} style={styles.storyImage} />
            <Text style={styles.storyRank}>#{index + 1}</Text>
            <Text style={styles.storyLikes}>♥️ {story.likes}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 120, padding: 10 },
  storyItem: { marginRight: 15, alignItems: 'center' },
  storyImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#ff4757'
  },
  storyRank: { fontSize: 12, fontWeight: 'bold', marginTop: 5 },
  storyLikes: { fontSize: 10, color: '#666' }
});

export default StoryCarousel;
