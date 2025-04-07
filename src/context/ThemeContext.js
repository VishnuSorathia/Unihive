import React, { createContext, useState, useMemo, useContext } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';

export const themes = {
  light: {
    primary: '#6200EE',
    secondary: '#03DAC6',
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#000000',
    accent: '#BB86FC',
    gradient: ['#6200EE', '#BB86FC'],
  },
  dark: {
    primary: '#BB86FC',
    secondary: '#03DAC6',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    accent: '#6200EE',
    gradient: ['#BB86FC', '#03DAC6'],
  },
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('light');
  const [currentTheme, setCurrentTheme] = useState(themes[themeName]);
  const animatedValue = useMemo(() => new Animated.Value(0), []);

  const switchTheme = (theme) => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start(() => {
      setThemeName(theme);
      setCurrentTheme(themes[theme]);
      animatedValue.setValue(0);
    });
  };

  const interpolatedColors = {
    background: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [currentTheme.background, themes[themeName].background],
    }),
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, switchTheme, themeName, interpolatedColors }}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: interpolatedColors.background }]}>
        {children}
      </Animated.View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
