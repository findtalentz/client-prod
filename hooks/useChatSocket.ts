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

    // Tell server which chat we're viewing
    socket.emit("join_chat", chatId);

    const handler = (data: { chatId: string }) => {
      // Always invalidate chat list so lastMessage updates
      queryClient.invalidateQueries({ queryKey: ["chats"] });

      if (data.chatId === chatId) {
        queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
      }
    };

    socket.on("new_message", handler);

    return () => {
      socket.emit("leave_chat");
      socket.off("new_message", handler);
    };
  }, [chatId, queryClient]);
}
