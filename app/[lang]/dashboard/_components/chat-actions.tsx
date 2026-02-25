"use client";
import { queryClient } from "@/app/[lang]/query-client-provider";
import { Button } from "@/components/ui/button";
import useSession from "@/hooks/useSession";
import { useChatStore } from "@/store";
import { Avatar } from "@radix-ui/themes";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { Hire } from "../client/_components/hire";

export default function ChatActions() {
  const currentChat = useChatStore((s) => s.currentChat);
  const [rotating, setRotating] = useState(false);
  const { data: user } = useSession();

  if (!currentChat)
    return (
      <div className="h-[68px] border-b border-gray-100 bg-white" />
    );

  const chatUser =
    user?.data._id === currentChat.buyer._id
      ? currentChat.seller
      : currentChat.buyer;

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
      setTimeout(() => setRotating(false), 1000);
    }
  };

  return (
    <div className="h-[68px] flex items-center justify-between px-5 border-b border-gray-100 bg-white">
      <div className="flex items-center gap-3">
        <Avatar
          src={chatUser.image}
          fallback={chatUser.firstName.charAt(0)}
          radius="full"
          size="3"
        />
        <div>
          <p className="text-sm font-semibold text-gray-900 leading-tight">
            {chatUser.firstName + " " + chatUser.lastName}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 capitalize">
            {chatUser.role?.toLowerCase()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {chatUser.role === "SELLER" && <Hire sellerId={chatUser._id} />}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          onClick={handleRefresh}
        >
          <RefreshCw
            className={`w-4 h-4 ${rotating ? "animate-spin-slow" : ""}`}
          />
        </Button>
      </div>
    </div>
  );
}
