"use client";

import { useChatStore } from "@/store";
import AiChatPanel from "./ai-chat-panel";
import ChatActions from "./chat-actions";
import Chats from "./chats";
import MessageForm from "./message-form";
import Messages from "./messages";

export default function MessagePageLayout() {
  const currentChat = useChatStore((s) => s.currentChat);
  const isAiChat = currentChat?._id === "ai-assistant";

  return (
    <div className="flex h-[calc(100dvh-115px)] bg-gray-50/50 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <div className="w-[340px] shrink-0 border-r border-gray-200 bg-white flex flex-col">
        <Chats />
      </div>
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {isAiChat ? (
          <AiChatPanel />
        ) : (
          <>
            <ChatActions />
            <Messages />
            <MessageForm />
          </>
        )}
      </div>
    </div>
  );
}
