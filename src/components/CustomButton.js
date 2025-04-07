import React, { useRef } from "react";
import { TouchableOpacity, Animated, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { useTheme } from "../context/ThemeContext";

const CustomButton = ({ title, onPress, style, icon }) => {
  const { currentTheme } = useTheme();
  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.timing(progress, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      progress.setValue(0);
      onPress();
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ scale }],
            backgroundColor: currentTheme.primary,
            shadowColor: currentTheme.accent,
          },
          style,
        ]}
      >
        {icon && (
          <LottieView
            source={icon}
            progress={progress}
            style={styles.icon}
            autoPlay={false}
            loop={false}
          />
        )}
        <Animated.Text style={[styles.text, { color: currentTheme.accent }]}>
          {title}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 18,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default CustomButton;
