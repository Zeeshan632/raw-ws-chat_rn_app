import useAuthenticationStore from "@/zustandStore/useAuthenticationStore";
import { Redirect, Stack } from "expo-router";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function ProtectedLayout() {
  const { user } = useAuthenticationStore();

  if (!user?.token) {
    return <Redirect href="/login" />;
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="chattingScreen" />
    </Stack>
  );
}
