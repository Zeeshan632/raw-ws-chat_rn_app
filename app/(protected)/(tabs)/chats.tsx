import { ChatCard } from "@/components/ChatCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import useAuthenticationStore from "@/zustandStore/useAuthenticationStore";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

interface participant {
  id: number;
  name: string;
  email: string;
}

interface message {
  id: number;
  content: string;
  sender: participant;
  isRead: boolean;
  readAt: boolean | null;
  deliveredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Conversation {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  participants: participant[];
  messages: message[];
  receiver: participant;
}

export default function Chats() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { deleteUserInfo } = useAuthenticationStore();
  const { user } = useAuthenticationStore();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: deleteUserInfo,
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      fetchConversations();
    }, []),
  );

  const fetchConversations = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:3000/conversation/get-conversations",
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setConversations(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const aTime = new Date(a?.messages?.[0]?.deliveredAt ?? 0).getTime();
      const bTime = new Date(b?.messages?.[0]?.deliveredAt ?? 0).getTime();

      return bTime - aTime;
    });
  }, [conversations]);

  // console.log(conversations[0]?.messages, sortedConversations);
  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText type="title" style={styles.title}>
          Chats
        </ThemedText>
        <PrimaryButton
          title="Logout"
          style={styles.logoutBtn}
          onPress={handleLogout}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {sortedConversations.map((conversation) => (
          <ChatCard
            key={conversation.id}
            userName={conversation.receiver.name}
            lastMessage={conversation?.messages[0]?.content}
            lastMessageFromYou={
              conversation?.messages[0]?.sender.id === user?.id ? true : false
            }
            lastMessageTime={new Date(
              conversation?.messages[0]?.deliveredAt,
            ).getTime()}
            onPress={() =>
              router.push({
                pathname: "/chattingScreen",
                params: {
                  id: conversation.receiver.id,
                  userName: conversation.receiver.name,
                  email: conversation.receiver.email,
                  conversationId: conversation.id,
                },
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
    marginBottom: "8%",
    marginTop: "3%",
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
