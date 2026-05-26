import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { verticalScale } from "react-native-size-matters";

import useAuthenticationStore from "@/zustandStore/useAuthenticationStore";
import axios from "axios";
import { InputField } from "../../components/ui/InputField";
import { PrimaryButton } from "../../components/ui/PrimaryButton";

const validateEmail = (value: string) => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(value);
};

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const { updateUserInfo } = useAuthenticationStore();

  const validatePassword = (value: string) => {
    if (!value) return "Password is required.";
    if (value.length < 8) return "Password must be at least 8 characters.";
    return "";
  };

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
      email: email.trim()
        ? validateEmail(email)
          ? ""
          : "Please enter a valid email."
        : "Email is required.",
      password: validatePassword(password),
    };

    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) {
      return;
    }

    // const payload = { email, password };

    let data = JSON.stringify({
      email: email,
      password: password,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:3000/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        updateUserInfo({
          id: response.data.data.id,
          username: response.data.data.name,
          email: response.data.data.email,
          token: response.data.accessToken,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [email, password]);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Log in</Text>

      <View style={styles.form}>
        <InputField
          label="Email"
          value={email}
          onChangeText={handleEmailChange}
          placeholder="Enter your email"
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

        <PrimaryButton title="Log in" onPress={handleSubmit} />

        <View style={styles.loginRow}>
          <Text style={styles.subtitle}>Don’t have an account? </Text>
          <Pressable onPress={() => router.push("/(auth)/signup")}>
            <Text style={styles.loginLink}>Sign up</Text>
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
