import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeTabs from "./HomeTabs";
import LoginScreen from "../screens/LoginScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Login" 
      screenOptions={{ 
        headerShown: false,
        animationEnabled: false 
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={HomeTabs} />
    </Stack.Navigator>
  );
};

export default AppNavigator;