import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface User {
  id: number;
  username: string;
  email: string;
  token: string;
}

interface AuthState {
  user: User | null;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  updateUserInfo: (user: User) => void;
  deleteUserInfo: () => void;
}

const useAuthenticationStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
      updateUserInfo: (user: User) => set({ user: user }),
      deleteUserInfo: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
);

export default useAuthenticationStore;
