import useAuthenticationStore from "@/zustandStore/useAuthenticationStore";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function index() {
  const { user, hasHydrated, setHasHydrated } = useAuthenticationStore();

  useEffect(() => {
    const store = useAuthenticationStore.persist;

    if (store.hasHydrated()) {
      setHasHydrated(true);
    }

    const unsub = store.onFinishHydration(() => {
      setHasHydrated(true);
    });

    return unsub;
  }, []);

  if (!hasHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color={"blue"} />
      </View>
    );
  }

  if (user?.token) {
    return <Redirect href={"/(protected)/(tabs)/home"} />;
  }

  return <Redirect href={"/login"} />;
}
