import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import UploadScreen from "../screens/UploadScreen";
import BusinessScreen from "../screens/BusinessScreen";
import CompetitionsScreen from "../screens/CompetitionsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Add this line to hide headers globally
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Business") iconName = "briefcase-outline";
          else if (route.name === "Upload") iconName = "cloud-upload-outline";
          else if (route.name === "Competitions") iconName = "trophy-outline";
          else if (route.name === "Profile") iconName = "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarShowLabel: false,
        tabBarStyle: { 
          height: 60,
          borderTopColor: '#e0e0e0',
          backgroundColor: 'white'
        },
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#888',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Business" component={BusinessScreen} />
      <Tab.Screen name="Upload" component={UploadScreen} />
      <Tab.Screen name="Competitions" component={CompetitionsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default HomeTabs;