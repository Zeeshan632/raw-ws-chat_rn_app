import useAuthenticationStore from "@/zustandStore/useAuthenticationStore";
import { useSocketStore } from "@/zustandStore/useSocketStore";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function AuthGate() {
  const { user, hasHydrated } = useAuthenticationStore();
  const { isConnected, disconnect } = useSocketStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!hasHydrated) return;

    if (!segments.length) return;

    const inProtected = segments[0] === "(protected)";

    if (user?.token && !inProtected) {
      router.replace("/(protected)/(tabs)/home");
    }

    if (!user?.token && inProtected) {
      router.replace("/(auth)/login");
      if (isConnected) {
        disconnect();
      }
    }
  }, [user, hasHydrated]);

  return null;
}
