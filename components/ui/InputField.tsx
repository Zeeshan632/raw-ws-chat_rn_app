import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    type TextInputProps,
    View,
} from "react-native";

type InputFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  showPasswordToggle?: boolean;
} & Omit<TextInputProps, "value" | "onChangeText">;

export function InputField({
  label,
  value,
  onChangeText,
  error,
  style,
  secureTextEntry,
  showPasswordToggle,
  ...rest
}: InputFieldProps) {
  const [secure, setSecure] = useState(secureTextEntry ?? false);

  useEffect(() => {
    setSecure(secureTextEntry ?? false);
  }, [secureTextEntry]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {error ? (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.inputRow}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={[
            styles.input,
            showPasswordToggle && styles.inputWithIcon,
            style,
          ]}
          placeholderTextColor="rgba(0,0,0,0.4)"
          secureTextEntry={secure}
          {...rest}
        />
        {showPasswordToggle ? (
          <Pressable
            onPress={() => setSecure((prev) => !prev)}
            style={styles.iconButton}
          >
            <Feather name={secure ? "eye-off" : "eye"} size={20} color="#666" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#1f1f1f",
  },
  inputRow: {
    position: "relative",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#111",
    backgroundColor: "#fafafa",
  },
  inputWithIcon: {
    paddingRight: 46,
  },
  iconButton: {
    position: "absolute",
    right: 12,
    top: "30%",
    // transform: [{ translateY: -10 }],
    // padding: 8,
  },
  tooltip: {
    alignSelf: "flex-start",
    backgroundColor: "#fdecea",
    borderColor: "#f5c6cb",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 6,
  },
  tooltipText: {
    color: "#a94442",
    fontSize: 12,
  },
  error: {
    marginTop: 6,
    color: "#d32f2f",
    fontSize: 12,
  },
});
