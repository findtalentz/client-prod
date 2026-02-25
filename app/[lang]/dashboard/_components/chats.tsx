"use client";
import useChats from "@/hooks/useChats";
import { MessageCircle, Search } from "lucide-react";
import { useState } from "react";
import ChatDetails from "./chat";

export default function Chats() {
  const { data } = useChats();
  const [search, setSearch] = useState("");

  if (!data || data.data.length === 0)
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <MessageCircle className="w-7 h-7 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-500">No conversations yet</p>
        <p className="text-xs text-gray-400 mt-1">
          Start a conversation to see it here
        </p>
      </div>
    );

  const filteredChats = data.data.filter((chat) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      chat.buyer.firstName.toLowerCase().includes(q) ||
      chat.buyer.lastName.toLowerCase().includes(q) ||
      chat.seller.firstName.toLowerCase().includes(q) ||
      chat.seller.lastName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="p-4 pb-3">
        <h3 className="!text-base font-semibold text-gray-900 mb-3">Messages</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-100 border-0 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
        {filteredChats.map((chat) => (
          <ChatDetails key={chat._id} chat={chat} />
        ))}
        {filteredChats.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">
            No conversations found
          </p>
        )}
      </div>
    </div>
  );
}
