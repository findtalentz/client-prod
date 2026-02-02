"use client";
import Navbar from "@/components/navbar";
import useMessageStore from "@/store";
import { useEffect } from "react";
import { v4 as uuidV4 } from "uuid";
import BackButton from "./back-button";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";
import ChatStarter from "./chat-starter";

function ChatPage() {
  const { setUserId, userId, showMessages } = useMessageStore();

  useEffect(() => {
    if (!userId) {
      setUserId(uuidV4());
    }
  }, [userId, setUserId]);
  return (
    <>
      <Navbar />
      <div className="md:h-[calc(100dvh-62px)] h-full bg-[#AAEBCA]/20 flex items-center justify-center -mt-2 p-4">
        <div className="w-full md:w-[960px] h-full md:h-[700px] bg-[#04201A] border-8 border-primary-light rounded-4xl relative flex items-center flex-col py-16 justify-between gap-6">
          <BackButton />
          {!showMessages && <ChatStarter />}
          {showMessages && <ChatMessages />}
          <ChatInput />
        </div>
      </div>
    </>
  );
}

export default ChatPage;
