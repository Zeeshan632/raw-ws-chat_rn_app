import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useThemeColor } from "@/hooks/use-theme-color";
import useAuthenticationStore, {
  User,
} from "@/zustandStore/useAuthenticationStore";
import { useSocketStore } from "@/zustandStore/useSocketStore";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AppState,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface Message {
  id: number;
  content: string;
  sender: User;
  conversation?: string;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default function ChattingScreen() {
  const flatListRef = useRef<FlatList>(null);
  const { user } = useAuthenticationStore();
  const {
    id: receiverId,
    userName,
    email,
    conversationId,
  } = useLocalSearchParams();
  const { socket } = useSocketStore();
  const [currentConversationId, setCurrentConversationId] = useState<
    number | null
  >(null);
  const conversationIdRef = useRef<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState<boolean>(false);
  const [lastReadMessageId, setLastReadMessageId] = useState<number | null>(
    null,
  );
  const [inputText, setInputText] = useState("");
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const router = useRouter();

  const initial = userName[0].toUpperCase();

  useEffect(() => {
    conversationIdRef.current = currentConversationId;
  }, [currentConversationId]);

  useFocusEffect(
    useCallback(() => {
      if (!socket) return;

      socket?.send(
        JSON.stringify({
          type: "history",
          receiverId: Number(receiverId),
          conversationId,
        }),
      );

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "history":
            setCurrentConversationId(data.conversationId);
            makeMessageRead(data.conversationId, data.messages[0]);
            setMessages(data.messages);
            if (
              data.messages[0].sender.id === user?.id &&
              data.messages[0].isRead
            ) {
              setLastReadMessageId(data.messages[0].id);
            }
            break;

          case "message":
            if (data.conversationId === conversationIdRef.current) {
              setMessages((prev) => [data.message, ...prev]);
              if (AppState.currentState === "active") {
                makeMessageRead(data.conversationId, data.message);
              }
            }
            break;

          case "typing":
            if (data.conversationId === conversationIdRef.current) {
              setTyping(true);
            }
            break;

          case "read":
            if (data.conversationId === conversationIdRef.current) {
              setLastReadMessageId(data.lastReadMessageId);
            }
            break;

          default:
            break;
        }
      };
      return () => {
        socket.onmessage = null;
      };
    }, [socket, conversationId]),
  );

  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [messages]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTyping(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [typing]);

  const makeMessageRead = (conversationId: number, lastMessage: Message) => {
    if (!socket || !lastMessage) return;

    if (lastMessage?.sender?.id !== user?.id) {
      socket?.send(
        JSON.stringify({
          type: "read",
          conversationId,
        }),
      );
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        type: "message",
        receiverId: Number(receiverId),
        messageText: inputText,
      };
      if (socket?.readyState === WebSocket.OPEN) {
        if (!socket) return;
        socket.send(JSON.stringify(newMessage));
        setInputText("");
      }
    }
  };

  const renderMessages = ({ item }: { item: Message }) => {
    return (
      <>
        {item?.sender.id === user?.id && lastReadMessageId === item?.id && (
          <Text
            style={{
              color: "black",
              backgroundColor: "lightgreen",
              alignSelf: "flex-end",
              paddingHorizontal: 8,
              borderRadius: 10,
              fontSize: 12,
            }}
          >
            Seen
          </Text>
        )}
        <View
          key={item?.id}
          style={[
            styles.messageContainer,
            item?.sender.id === user?.id
              ? styles.sentMessage
              : styles.receivedMessage,
          ]}
        >
          <ThemedText
            style={[
              styles.messageText,
              item?.sender.id === user?.id
                ? styles.sentMessageText
                : styles.receivedMessageText,
            ]}
          >
            {item?.content}
          </ThemedText>
        </View>
      </>
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={textColor} />
        </Pressable>
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
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(message) => message?.id.toString()}
        ref={flatListRef}
        inverted
        style={styles.chatContainer}
        renderItem={renderMessages}
      />
      {typing ? <Text style={styles.typingTag}>typing...</Text> : null}

      {/* Input Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={[
              styles.textInput,
              { color: textColor, borderColor: tintColor },
            ]}
            value={inputText}
            onChangeText={(text) => {
              setInputText(text);
              if (conversationIdRef.current) {
                socket?.send(
                  JSON.stringify({
                    type: "typing",
                    conversationId: conversationIdRef.current,
                  }),
                );
              }
            }}
            placeholder="Type a message..."
            placeholderTextColor={textColor + "80"}
            multiline
          />
          <PrimaryButton
            title="Send"
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
            style={styles.sendButton}
          />
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    marginBottom: 2,
  },
  email: {
    fontSize: 12,
    opacity: 0.7,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageContainer: {
    maxWidth: "80%",
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  messageText: {
    fontSize: 16,
  },
  sentMessageText: {
    color: "#FFFFFF",
  },
  receivedMessageText: {
    color: "#000000",
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 16,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    minWidth: 80,
  },
  typingTag: {
    marginHorizontal: 30,
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
    backgroundColor: "black",
    color: "white",
    borderRadius: 10,
    fontWeight: "bold",
  },
});
