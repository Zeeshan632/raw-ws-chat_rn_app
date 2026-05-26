import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { verticalScale } from "react-native-size-matters";

import axios from "axios";
import { InputField } from "../../components/ui/InputField";
import { PrimaryButton } from "../../components/ui/PrimaryButton";

const validateEmail = (value: string) => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(value);
};

export default function SignUp() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });
  const validateUsername = (value: string) =>
    value.trim() ? "" : "Username is required.";

  const validatePassword = (value: string) => {
    if (!value) return "Password is required.";
    if (value.length < 8) return "Password must be at least 8 characters.";
    return "";
  };

  const handleUsernameChange = useCallback(
    (text: string) => {
      setUsername(text);
      setErrors((prev) => ({ ...prev, username: validateUsername(text) }));
    },
    [validateUsername],
  );

  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
    setErrors((prev) => ({
      ...prev,
      email: text.trim()
        ? validateEmail(text)
          ? ""
          : "Please enter a valid email."
        : "Email is required.",
    }));
  }, []);

  const handlePasswordChange = useCallback(
    (text: string) => {
      setPassword(text);
      setErrors((prev) => ({ ...prev, password: validatePassword(text) }));
    },
    [validatePassword],
  );

  const handleSubmit = useCallback(() => {
    const nextErrors = {
      username: validateUsername(username),
      email: email.trim()
        ? validateEmail(email)
          ? ""
          : "Please enter a valid email."
        : "Email is required.",
      password: validatePassword(password),
    };

    setErrors(nextErrors);

    if (nextErrors.username || nextErrors.email || nextErrors.password) {
      return;
    }

    const payload = { username, email, password };

    let data = JSON.stringify({
      name: username,
      email: email,
      password: password,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:3000/signup",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        router.push("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  }, [username, email, password]);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Sign up</Text>

      <View style={styles.form}>
        <InputField
          label="Username"
          value={username}
          onChangeText={handleUsernameChange}
          placeholder="Enter your username"
          error={errors.username}
          autoCapitalize="none"
          autoComplete="username"
          returnKeyType="next"
        />

        <InputField
          label="Email"
          value={email}
          onChangeText={handleEmailChange}
          placeholder="Enter a valid email"
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          returnKeyType="next"
        />

        <InputField
          label="Password"
          value={password}
          onChangeText={handlePasswordChange}
          placeholder="Enter your password"
          error={errors.password}
          secureTextEntry
          showPasswordToggle
          autoComplete="password"
          returnKeyType="done"
        />

        <PrimaryButton title="Create account" onPress={handleSubmit} />

        <View style={styles.loginRow}>
          <Text style={styles.subtitle}>Already have an account? </Text>
          <Pressable onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.loginLink}>Login</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    marginTop: verticalScale(40),
  },
  form: {
    marginTop: verticalScale(32),
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(16),
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0a7ea4",
  },
});
