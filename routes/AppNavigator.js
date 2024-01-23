// AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import PostScreen from "../screens/PostScreen";
import EditPostScreen from "../screens/EditPostScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="PostScreen" component={PostScreen} />
        <Stack.Screen name="EditPostScreen" component={EditPostScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
