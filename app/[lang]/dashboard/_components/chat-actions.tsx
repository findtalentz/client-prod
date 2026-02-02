"use client";
import { queryClient } from "@/app/[lang]/query-client-provider";
import { Button } from "@/components/ui/button";
import useSession from "@/hooks/useSession";
import { useChatStore } from "@/store";
import { Avatar, Flex } from "@radix-ui/themes";
import { useState } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import { Hire } from "../client/_components/hire";

export default function ChatActions() {
  const currentChat = useChatStore((s) => s.currentChat);
  const [rotating, setRotating] = useState(false);
  const { data: user } = useSession(); // Move this hook call to the top level

  if (!currentChat) return <div />;

  const setChatUser = () => {
    if (user?.data._id === currentChat.buyer._id) return currentChat.seller;
    return currentChat.buyer;
  };

  const chatUser = setChatUser();

  const handleRefresh = async () => {
    try {
      setRotating(true);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["chats"] }),
        queryClient.invalidateQueries({ queryKey: ["messages"] }),
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => setRotating(false), 1000); // stop animation after 1s
    }
  };

  return (
    <Flex align="center" justify="between" className="border-b shadow px-8">
      <Flex align="center" gap="2">
        <Avatar
          src={chatUser.image}
          fallback={chatUser.firstName}
          radius="full"
          size="4"
        />
        <p className="font-semibold">
          {chatUser.firstName + " " + chatUser.lastName}
        </p>
      </Flex>
      <Flex align="center" gap="3">
        {chatUser.role === "SELLER" && <Hire sellerId={chatUser._id} />}
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={handleRefresh}
        >
          <MdOutlineRefresh className={rotating ? "animate-spin-slow" : ""} />
        </Button>
      </Flex>
    </Flex>
  );
}
