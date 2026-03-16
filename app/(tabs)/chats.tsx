import { ChatCard } from "@/components/ChatCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useLayoutEffect, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

type ChatItem = {
  id: string;
  userName: string;
  email: string;
  lastMessage: string;
  lastMessageFromYou: boolean;
  unreadCount: number;
  lastMessageTime: Date;
};

const DEFAULT_CHATS: ChatItem[] = [
  {
    id: "1",
    userName: "Alice Johnson",
    email: "alice.johnson@example.com",
    lastMessage: "Hey! Did you get a chance to review the wireframes?",
    lastMessageFromYou: false,
    unreadCount: 2,
    lastMessageTime: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: "2",
    userName: "Bob Smith",
    email: "bob.smith@example.com",
    lastMessage: "Sure — let’s sync tomorrow morning.",
    lastMessageFromYou: true,
    unreadCount: 0,
    lastMessageTime: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: "3",
    userName: "Charlie Brown",
    email: "charlie.brown@example.com",
    lastMessage: "That’s awesome! Looking forward to it.",
    lastMessageFromYou: false,
    unreadCount: 3,
    lastMessageTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: "4",
    userName: "Diana Prince",
    email: "diana.prince@example.com",
    lastMessage: "Happy birthday again! Hope you had a great day",
    lastMessageFromYou: false,
    unreadCount: 0,
    lastMessageTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    userName: "Edward Norton",
    email: "edward.norton@example.com",
    lastMessage: "Did you see the update? I pushed the fix yesterday.",
    lastMessageFromYou: true,
    unreadCount: 1,
    lastMessageTime: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
  {
    id: "6",
    userName: "Fiona Green",
    email: "fiona.green@example.com",
    lastMessage: "Let’s catch up next month when I’m back in town.",
    lastMessageFromYou: false,
    unreadCount: 0,
    lastMessageTime: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
  },
  {
    id: "7",
    userName: "George Lucas",
    email: "george.lucas@example.com",
    lastMessage: "Remember when we started this project? Crazy times.",
    lastMessageFromYou: false,
    unreadCount: 0,
    lastMessageTime: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000),
  },
];

const STORAGE_KEY = "chats_data";

export default function Chats() {
  const router = useRouter();
  const navigation = useNavigation();

  const sortedChats = useMemo(
    () =>
      [...DEFAULT_CHATS].sort(
        (a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime(),
      ),
    [],
  );

  const totalUnread = useMemo(
    () => sortedChats.reduce((acc, chat) => acc + (chat.unreadCount ?? 0), 0),
    [sortedChats],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarBadge:
        totalUnread > 0 ? (totalUnread > 99 ? "99+" : totalUnread) : undefined,
    });
  }, [navigation, totalUnread]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText type="title" style={styles.title}>
          Chats
        </ThemedText>
        <PrimaryButton
          title="Logout"
          style={styles.logoutBtn}
          onPress={() => router.push("/login")}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {sortedChats.map((chat) => (
          <ChatCard
            key={chat.id}
            userName={chat.userName}
            lastMessage={chat.lastMessage}
            lastMessageFromYou={chat.lastMessageFromYou}
            unreadCount={chat.unreadCount}
            lastMessageTime={chat.lastMessageTime}
            onPress={() =>
              router.push({
                pathname: "/chattingScreen",
                params: { userName: chat.userName, email: chat.email },
              })
            }
          />
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
});
