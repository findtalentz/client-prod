"use client";
import useChats from "@/hooks/useChats";
import { Flex } from "@radix-ui/themes";
import ChatDetails from "./chat";

export default function Chats() {
  const { data } = useChats();
  if (!data)
    return (
      <Flex align="center" justify="center" className="bg-gray-200">
        <p className="!text-3xl text-center text-gray-400">
          There are no conversion available!
        </p>
      </Flex>
    );
  return (
    <div className="border-r overflow-auto p-4 space-y-3">
      {data.data.map((chat) => (
        <ChatDetails key={chat._id} chat={chat} />
      ))}
    </div>
  );
}
