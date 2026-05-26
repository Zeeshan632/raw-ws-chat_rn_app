import { create } from "zustand";

interface SocketStore {
  socket: WebSocket | null;
  isConnected: boolean;

  connect: (userId: number) => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  isConnected: false,

  connect: (userId: number) => {
    if (get().socket) return; // it would prevent duplicate conenction

    const ws = new WebSocket(`http://127.0.0.1:3000/ws?userId=${userId}`);

    set({ socket: ws });

    ws.onopen = () => {
      console.log("connected");
      set({ isConnected: true });
    };
    ws.onerror = (err) => {
      console.log("Error with socket connection-->.  ", err);
      // Alert.alert("Error", err.toString());
    };
    ws.onclose = () => {
      console.log("Socket connection disconnected");
      set({ socket: null, isConnected: false });
    };
  },

  disconnect: () => {
    const socket = get().socket;
    socket?.close();
    set({ socket: null, isConnected: false });
  },
}));
