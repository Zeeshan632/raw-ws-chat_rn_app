import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

interface ChatCardProps {
  userName: string;
  lastMessage: string;
  lastMessageTime: Date;
  lastMessageFromYou?: boolean;
  unreadCount?: number;
  onPress?: () => void;
}

const pluralize = (count: number, singular: string, plural?: string) => {
  if (count === 1) return `${count} ${singular}`;
  return `${count} ${plural ?? `${singular}s`}`;
};

const getTimeAgo = (date: Date) => {
  const now = Date.now();
  const delta = Math.max(0, now - date.getTime());

  const seconds = Math.floor(delta / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return `${pluralize(seconds, "second")} ago`;
  if (minutes < 60) return `${pluralize(minutes, "minute")} ago`;
  if (hours < 24) return `${pluralize(hours, "hour")} ago`;
  if (days < 7) return `${pluralize(days, "day")} ago`;
  if (weeks < 5) return `${pluralize(weeks, "week")} ago`;
  if (months < 12) return `${pluralize(months, "month")} ago`;
  return `${pluralize(years, "year")} ago`;
};

export function ChatCard({
  userName,
  lastMessage,
  lastMessageTime,
  lastMessageFromYou,
  unreadCount,
  onPress,
}: ChatCardProps) {
  const tint = useThemeColor({}, "tint");
  const background = useThemeColor({}, "background");

  const initial = userName.charAt(0).toUpperCase();

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "rgba(0,0,0,0.1)" }}
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressablePressed,
      ]}
    >
      <ThemedView style={styles.card}>
        <View style={[styles.avatar, { backgroundColor: tint }]}>
          <ThemedText style={[styles.avatarText, { color: background }]}>
            {initial}
          </ThemedText>
        </View>

        <View style={styles.textArea}>
          <View style={styles.topRow}>
            <ThemedText type="defaultSemiBold" style={styles.userName}>
              {userName}
            </ThemedText>
            <ThemedText type="subtitle" style={styles.timeText}>
              {getTimeAgo(lastMessageTime)}
            </ThemedText>
          </View>

          <ThemedText
            type="subtitle"
            style={styles.lastMessage}
            numberOfLines={1}
          >
            {lastMessageFromYou ? `You: ${lastMessage}` : lastMessage}
          </ThemedText>
        </View>

        {unreadCount ? (
          <View style={styles.unreadBadge}>
            <ThemedText style={styles.unreadCount}>{unreadCount}</ThemedText>
          </View>
        ) : null}
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 14,
    overflow: "hidden",
  },
  pressablePressed: {
    transform: [{ scale: 0.98 }],
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textArea: {
    flex: 1,
  },
  unreadBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    marginLeft: 12,
  },
  unreadCount: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    opacity: 0.7,
    marginLeft: 8,
  },
  lastMessage: {
    fontSize: 14,
    opacity: 0.75,
  },
});
