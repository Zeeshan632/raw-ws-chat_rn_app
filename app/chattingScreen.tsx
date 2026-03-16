import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

interface Message {
  id: string;
  text: string;
  isSent: boolean;
  timestamp: Date;
}

const sampleMessages: Message[] = [
  {
    id: "1",
    text: "Hey there! How are you doing?",
    isSent: false,
    timestamp: new Date(),
  },
  {
    id: "2",
    text: "Hi! I'm doing great, thanks for asking. How about you?",
    isSent: true,
    timestamp: new Date(),
  },
  {
    id: "3",
    text: "I'm good too! Just working on some projects.",
    isSent: false,
    timestamp: new Date(),
  },
  {
    id: "4",
    text: "That sounds interesting! What kind of projects?",
    isSent: true,
    timestamp: new Date(),
  },
  {
    id: "5",
    text: "Mostly mobile app development with React Native.",
    isSent: false,
    timestamp: new Date(),
  },
];

export default function ChattingScreen() {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [inputText, setInputText] = useState("");

  const scrollViewRef = useRef<ScrollView | null>(null);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const router = useRouter();

  const userName = "Alice Johnson";
  const email = "alice.johnson@example.com";
  const initial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        isSent: true,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputText("");
    }
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
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={[styles.chatContent, styles.chatContentBottom]}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.isSent ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            <ThemedText
              style={[
                styles.messageText,
                message.isSent
                  ? styles.sentMessageText
                  : styles.receivedMessageText,
              ]}
            >
              {message.text}
            </ThemedText>
          </View>
        ))}
      </ScrollView>

      {/* Input Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={[
              styles.textInput,
              { color: textColor, borderColor: tintColor },
            ]}
            value={inputText}
            onChangeText={setInputText}
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
  chatContent: {
    paddingVertical: 16,
  },
  chatContentBottom: {
    flexGrow: 1,
    justifyContent: "flex-end",
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
});
