import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

const ImageCard = ({ post }) => {
  const { currentTheme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: currentTheme.background }]}>
      <Image source={{ uri: post.file }} style={styles.image} />
      <Text style={[styles.caption, { color: currentTheme.text }]}>{post.caption}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  caption: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default ImageCard;
