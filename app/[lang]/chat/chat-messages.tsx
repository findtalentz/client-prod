import { cn } from "@/lib/utils";
import useMessageStore from "@/store";
import { Bot, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
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
    <div className="flex flex-col overflow-y-auto gap-5 w-full md:w-[780px] px-6 md:px-10 py-2 flex-1">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3 max-w-[90%] md:max-w-[80%]",
            !message.isBotReply && "self-end flex-row-reverse"
          )}
        >
          {/* Avatar */}
          <div
            className={cn(
              "shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5",
              message.isBotReply
                ? "bg-primary-dark/80"
                : "bg-white/15"
            )}
          >
            {message.isBotReply ? (
              <Image
                src="/logo_icon.png"
                width={18}
                height={18}
                alt="TalentzAI"
                className="w-[18px] h-[18px]"
              />
            ) : (
              <User className="w-4 h-4 text-white/70" />
            )}
          </div>

          {/* Bubble */}
          <div
            className={cn(
              "px-4 py-3 rounded-2xl text-sm leading-relaxed",
              message.isBotReply
                ? "bg-white/[0.07] text-white/90 border border-white/[0.06] rounded-tl-md"
                : "bg-primary text-white rounded-tr-md",
              // Markdown prose styling for bot replies
              message.isBotReply && "[&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:mb-2 [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_pre]:bg-white/10 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:my-2 [&_pre]:overflow-x-auto [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mb-1 [&_a]:text-primary-light [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-white/20 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-white/60"
            )}
          >
            <Markdown>{message.message}</Markdown>
          </div>
        </div>
      ))}

      {/* Typing indicator */}
      {isBotTyping && (
        <div className="flex gap-3 max-w-[80%]">
          <div className="shrink-0 w-8 h-8 rounded-full bg-primary-dark/80 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-light" />
          </div>
          <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white/[0.07] border border-white/[0.06]">
            <PulseLoader size={7} color="rgba(255,255,255,0.4)" speedMultiplier={0.8} />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatMessages;
