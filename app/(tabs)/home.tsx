import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { UserCard } from "@/components/UserCard";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const sampleUsers = [
  { userName: "Alice Johnson", email: "alice.johnson@example.com" },
  { userName: "Bob Smith", email: "bob.smith@example.com" },
  { userName: "Charlie Brown", email: "charlie.brown@example.com" },
  { userName: "Diana Prince", email: "diana.prince@example.com" },
  { userName: "Edward Norton", email: "edward.norton@example.com" },
  { userName: "Fiona Green", email: "fiona.green@example.com" },
  { userName: "George Lucas", email: "george.lucas@example.com" },
  { userName: "Helen Troy", email: "helen.troy@example.com" },
];

export default function Home() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText type="title" style={styles.title}>
          Home
        </ThemedText>
        <PrimaryButton
          title="Logout"
          style={styles.logoutBtn}
          onPress={() => router.push("/login")}
        />
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {sampleUsers.map((user, index) => (
          <UserCard key={index} userName={user.userName} email={user.email} />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  logoutBtn: {
    backgroundColor: "#EF4444",
    paddingVertical: 5,
    borderRadius: 100,
    marginRight: -10,
  },
  scrollView: {
    flex: 1,
  },
});
