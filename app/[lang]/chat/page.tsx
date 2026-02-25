"use client";
import Navbar from "@/components/navbar";
import useMessageStore from "@/store";
import { SquarePen } from "lucide-react";
import { useEffect } from "react";
import { v4 as uuidV4 } from "uuid";
import BackButton from "./back-button";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";
import ChatStarter from "./chat-starter";

function ChatPage() {
  const { setUserId, userId, showMessages, clearMessages, setShowMessages } =
    useMessageStore();

  useEffect(() => {
    if (!userId) {
      setUserId(uuidV4());
    }
  }, [userId, setUserId]);

  const handleNewChat = () => {
    clearMessages();
    setShowMessages(false);
    setUserId(uuidV4());
  };

  return (
    <>
      <Navbar />
      <div className="md:h-[calc(100dvh-62px)] h-[calc(100dvh-62px)] bg-gradient-to-br from-primary-light/20 via-primary/5 to-primary-dark/10 flex items-center justify-center -mt-2 p-3 md:p-6">
        <div className="w-full md:w-[1000px] h-full md:h-[720px] bg-gradient-to-b from-[#0a2e25] to-[#061a14] border border-primary-light/20 rounded-3xl relative flex flex-col py-10 md:py-14 shadow-2xl shadow-primary-dark/20 overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />

          <BackButton />

          {/* New Chat button */}
          {showMessages && (
            <button
              onClick={handleNewChat}
              className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white/70 hover:text-white text-sm transition-all duration-200 cursor-pointer"
            >
              <SquarePen className="w-4 h-4" />
              <span className="hidden md:inline">New Chat</span>
            </button>
          )}

          <div className="flex-1 flex flex-col items-center justify-between gap-4 overflow-hidden relative z-10">
            {!showMessages && <ChatStarter />}
            {showMessages && <ChatMessages />}
            <ChatInput />
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatPage;
