import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { PostProvider } from "./src/context/PostContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import { Provider as PaperProvider } from "react-native-paper";
import AppNavigator from "./src/navigation/AppNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { Lato_400Regular, Lato_700Bold } from "@expo-google-fonts/lato";

const Stack = createStackNavigator();

const CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#ffffff",
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    "Lato-Regular": Lato_400Regular,
    "Lato-Bold": Lato_700Bold,
  });

  if (!fontsLoaded) return null;

  const isLoggedIn = true; // Temporarily disable login check

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PostProvider>
        <ThemeProvider>
          <PaperProvider theme={CustomTheme}>
            <NavigationContainer theme={CustomTheme}>
              {isLoggedIn ? (
                <AppNavigator />
              ) : (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  {/* LoginScreen is temporarily disabled */}
                </Stack.Navigator>
              )}
            </NavigationContainer>
          </PaperProvider>
        </ThemeProvider>
      </PostProvider>
    </GestureHandlerRootView>
  );
}
