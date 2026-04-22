import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { UserCard } from "@/components/UserCard";
import useAuthenticationStore from "@/zustandStore/useAuthenticationStore";
import { useSocketStore } from "@/zustandStore/useSocketStore";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

type User = {
  id: string;
  name: string;
  email: string;
};

export default function Home() {
  const { user, deleteUserInfo } = useAuthenticationStore();
  const { isConnected, connect, disconnect } = useSocketStore();
  const [allUsers, setAllUsers] = useState([]);

  const fetchAllUsers = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:3000/all-users",
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response.status !== 200) {
          console.log(
            "The status is not 200 -->  ",
            response.status,
            response.data,
          );
        }
        setAllUsers(response.data.users);
      })
      .catch((error) => {
        if (error.status === 401) {
          Alert.alert(
            "Unauthorized",
            "Your session has expired. Please login again.",
            [
              {
                text: "OK",
                style: "default",
                onPress: () => {
                  deleteUserInfo();
                  disconnect();
                },
              },
            ],
          );
        }
      });
  };

  useEffect(() => {
    fetchAllUsers();
    connect(Number(user?.id));
  }, []);

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

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText type="title" style={styles.title}>
          {user?.username}'s Home
        </ThemedText>
        <PrimaryButton
          title="Logout"
          style={styles.logoutBtn}
          onPress={handleLogout}
        />
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {allUsers.map((renderedUser: User) =>
          +renderedUser.id !== user?.id ? (
            <UserCard
              key={renderedUser.id}
              id={renderedUser.id}
              userName={renderedUser.name}
              email={renderedUser.email}
            />
          ) : null,
        )}
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
    fontSize: 25,
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
