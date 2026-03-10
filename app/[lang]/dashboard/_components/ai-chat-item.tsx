"use client";

import { cn } from "@/lib/utils";
import { useChatStore } from "@/store";
import { Sparkles } from "lucide-react";
import Image from "next/image";

export default function AiChatItem() {
  const currentChat = useChatStore((s) => s.currentChat);
  const setCurrent = useChatStore((s) => s.setCurrentChat);

  // Use a sentinel value to indicate AI chat is selected
  const isActive = currentChat?._id === "ai-assistant";

  return (
    <div
      onClick={() =>
        setCurrent({
          _id: "ai-assistant",
          buyer: { _id: "", firstName: "Talentz", lastName: "AI", image: "" },
          seller: { _id: "", firstName: "Talentz", lastName: "AI", image: "" },
          lastMessage: "Ask me anything about Talentz",
        } as any)
      }
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 mx-2 mb-1",
        isActive
          ? "bg-primary/10 ring-1 ring-primary/20"
          : "hover:bg-gray-50 active:bg-gray-100"
      )}
    >
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
          <Image
            src="/logo_icon.png"
            width={20}
            height={20}
            alt="TalentzAI"
            className="w-5 h-5"
          />
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary-light flex items-center justify-center ring-2 ring-white">
          <Sparkles className="w-2.5 h-2.5 text-white" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium truncate",
            isActive ? "text-primary-dark" : "text-gray-900"
          )}
        >
          TalentzAI Assistant
        </p>
        <p className="text-xs text-gray-400 truncate mt-0.5 leading-relaxed">
          Ask me anything about Talentz
        </p>
      </div>
      <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary-light/15 text-primary-dark">
        AI
      </span>
    </div>
  );
}
