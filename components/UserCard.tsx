import { useThemeColor } from "@/hooks/use-theme-color";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

interface UserCardProps {
  userName: string;
  email: string;
}

export function UserCard({ userName, email }: UserCardProps) {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const router = useRouter();

  const initial = userName.charAt(0).toUpperCase();

  const handlePress = () => {
    router.push("/chattingScreen");
  };

  return (
    <Pressable onPress={handlePress}>
      <ThemedView style={styles.card}>
        <View style={[styles.avatar, { backgroundColor: tintColor }]}>
          <ThemedText style={[styles.avatarText, { color: backgroundColor }]}>
            {initial}
          </ThemedText>
        </View>
        <View style={styles.userInfo}>
          <ThemedText type="defaultSemiBold" style={styles.userName}>
            {userName}
          </ThemedText>
          <ThemedText type="subtitle" style={styles.email}>
            {email}
          </ThemedText>
        </View>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    opacity: 0.7,
  },
});
