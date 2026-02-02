import { cn } from "@/lib/utils";
import useMessageStore from "@/store";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa";
import Markdown from "react-markdown";
import { PulseLoader } from "react-spinners";

function ChatMessages() {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { messages, isBotTyping } = useMessageStore();

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col overflow-y-auto py-2 gap-4 custom-scrollbar h-[500px] w-full md:w-[800px] px-13">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "md:max-w-3xl py-2 px-4 rounded-3xl bg-white relative flex items-start justify-center",
            message.isBotReply && "bg-gray-100 self-start",
            !message.isBotReply && "self-end bg-primary text-white"
          )}
        >
          <div>
            <Markdown>{message.message}</Markdown>
          </div>
          <div
            className={cn(
              "w-9 h-9 rounded-full absolute",
              message.isBotReply &&
                "-left-10 bg-primary-dark flex items-center justify-center -mt-2",
              !message.isBotReply &&
                "-right-10 bg-primary-dark flex items-center justify-center -mt-2"
            )}
          >
            {message.isBotReply && (
              <Image
                src="/logo_icon.png"
                width={20}
                height={20}
                alt="logo"
                className="w-6 h-6"
              />
            )}
            {!message.isBotReply && <FaUser />}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
      {isBotTyping && (
        <div>
          <PulseLoader size={10} color="#666" />
        </div>
      )}
    </div>
  );
}

export default ChatMessages;
