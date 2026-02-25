import { Chat } from "@/schemas/Chat";
import { createQuery } from "@/lib/create-query";
import { CACHE } from "@/lib/constants";

const useChats = createQuery<Chat[]>({
  queryKey: ["chats"],
  url: "/chats",
  staleTime: CACHE.FREQUENT,
});

export default useChats;
