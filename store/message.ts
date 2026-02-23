import { v4 as uuidV4 } from "uuid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Message = {
  id: string;
  message: string;
  isBotReply: boolean;
};

type MessageStore = {
  showMessages: boolean;
  userId: string;
  isBotTyping: boolean;
  setUserId: (id: string) => void;
  messages: Message[];
  addMessage: (message: string, isBotReply: boolean) => void;
  setBotTyping: (isTyping: boolean) => void;
  setShowMessages: (show: boolean) => void;
  clearMessages: () => void;
};

const useMessageStore = create<MessageStore>()(
  persist(
    (set) => ({
      userId: "",
      showMessages: false,
      messages: [],
      isBotTyping: false,
      setUserId: (id) => set({ userId: id }),

      addMessage: (message, isBotReply) =>
        set((state) => ({
          messages: [...state.messages, { id: uuidV4(), message, isBotReply }],
        })),
      setBotTyping: (isTyping) => set({ isBotTyping: isTyping }),
      setShowMessages: (value) => set({ showMessages: value }),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: "message-storage",
    }
  )
);

export default useMessageStore;
