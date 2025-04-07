import React, { createContext, useContext, useState } from 'react';
import { Animated } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');

  // ✅ Prevent undefined errors by setting a default background
  const interpolatedColors = {
    background: currentTheme === 'dark' ? '#000' : '#fff',
    text: currentTheme === 'dark' ? '#fff' : '#000',
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, interpolatedColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
