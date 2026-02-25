"use client";
import useSession from "@/hooks/useSession";
import { cn } from "@/lib/utils";
import { Chat } from "@/schemas/Chat";
import { useChatStore } from "@/store";
import { Avatar } from "@radix-ui/themes";

interface Props {
  chat: Chat;
}

export default function ChatDetails({ chat }: Props) {
  const currentChat = useChatStore((s) => s.currentChat);
  const setCurrent = useChatStore((s) => s.setCurrentChat);
  const { data: user } = useSession();

  const chatUser =
    user?.data._id === chat.buyer._id ? chat.seller : chat.buyer;
  const isActive = chat._id === currentChat?._id;

  return (
    <div
      onClick={() => setCurrent(chat)}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150",
        isActive
          ? "bg-primary/10 ring-1 ring-primary/20"
          : "hover:bg-gray-50 active:bg-gray-100"
      )}
    >
      <div className="relative shrink-0">
        <Avatar
          src={chatUser.image}
          fallback={chatUser.firstName.charAt(0)}
          radius="full"
          size="3"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium truncate",
            isActive ? "text-primary-dark" : "text-gray-900"
          )}
        >
          {chatUser.firstName + " " + chatUser.lastName}
        </p>
        {chat.lastMessage && (
          <p className="text-xs text-gray-400 truncate mt-0.5 leading-relaxed">
            {chat.lastMessage.length > 45
              ? chat.lastMessage.slice(0, 45) + "..."
              : chat.lastMessage}
          </p>
        )}
      </div>
    </div>
  );
}
