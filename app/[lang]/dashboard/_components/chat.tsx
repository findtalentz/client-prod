"use client";
import useSession from "@/hooks/useSession";
import { cn } from "@/lib/utils";
import { Chat } from "@/schemas/Chat";
import { useChatStore } from "@/store";
import { Avatar, Flex } from "@radix-ui/themes";

interface Props {
  chat: Chat;
}

export default function ChatDetails({ chat }: Props) {
  const currentChat = useChatStore((s) => s.currentChat);
  const setCurrent = useChatStore((s) => s.setCurrentChat);
  const { data: user } = useSession();
  const setChatUser = () => {
    if (user?.data._id === chat.buyer._id) return chat.seller;
    return chat.buyer;
  };
  const chatUser = setChatUser();
  return (
    <Flex
      onClick={() => setCurrent(chat)}
      align="center"
      p="2"
      className={cn(
        "border cursor-pointer rounded-xl",
        chat._id === currentChat?._id && "bg-primary-light"
      )}
      gap="2"
    >
      <Avatar
        src={chatUser.image}
        fallback={chatUser.firstName}
        radius="full"
        size="4"
      />
      <div>
        <p className="font-semibold">
          {chatUser.firstName + " " + chatUser.lastName}
        </p>
        <p className="!text-[12px] text-gray-400">
          {chat.lastMessage ? chat.lastMessage.slice(0, 50) + "..." : ""}
        </p>
      </div>
    </Flex>
  );
}
