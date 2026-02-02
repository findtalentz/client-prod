import socket from "@/lib/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useChatSocket(chatId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!chatId) return;

    if (!socket.connected) {
      socket.connect();
    }

    const handler = (data: { chatId: string }) => {
      if (data.chatId === chatId) {
        queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
      }
    };

    socket.on("new_message", handler);

    return () => {
      socket.off("new_message", handler);
    };
  }, [chatId]);
}
