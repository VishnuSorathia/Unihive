import React from "react";
import { View, TouchableOpacity, StyleSheet, Text, Animated } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Video } from "expo-av";
import { useTheme } from "../context/ThemeContext"; // Import the useTheme hook

const VideoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { uri } = route.params;
  const { currentTheme, interpolatedColors } = useTheme(); // Use the theme hook

  return (
    <Animated.View style={[styles.container, { backgroundColor: interpolatedColors.background }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <Video
        source={{ uri }}
        useNativeControls
        resizeMode="contain"
        style={styles.videoPlayer}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: { position: "absolute", top: 20, left: 10, zIndex: 1 },
  backText: { color: "#fff", fontSize: 18 },
  videoPlayer: { flex: 1 },
});

export default VideoScreen;
