import socket from "@/lib/socket";
import { useEffect } from "react";
import { create } from "zustand";

interface OnlineUsersState {
  onlineUsers: Set<string>;
  addUser: (id: string) => void;
  removeUser: (id: string) => void;
  setUsers: (ids: string[]) => void;
}

const useOnlineUsersStore = create<OnlineUsersState>((set) => ({
  onlineUsers: new Set(),
  addUser: (id) =>
    set((state) => {
      const next = new Set(state.onlineUsers);
      next.add(id);
      return { onlineUsers: next };
    }),
  removeUser: (id) =>
    set((state) => {
      const next = new Set(state.onlineUsers);
      next.delete(id);
      return { onlineUsers: next };
    }),
  setUsers: (ids) => set({ onlineUsers: new Set(ids) }),
}));

export function useOnlineUsers() {
  const onlineUsers = useOnlineUsersStore((s) => s.onlineUsers);
  const { addUser, removeUser, setUsers } = useOnlineUsersStore();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    // Request initial online users list
    socket.emit("get_online_users", (users: string[]) => {
      setUsers(users);
    });

    socket.on("user_online", addUser);
    socket.on("user_offline", removeUser);

    return () => {
      socket.off("user_online", addUser);
      socket.off("user_offline", removeUser);
    };
  }, [addUser, removeUser, setUsers]);

  return onlineUsers;
}

export default useOnlineUsersStore;
