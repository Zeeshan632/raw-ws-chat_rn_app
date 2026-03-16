import { Tabs } from "expo-router";
import React from "react";

export default function componentName() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="chats" options={{ title: "Chats" }} />
    </Tabs>
  );
}
