import { Chat } from "@/schemas/Chat";
import { createQuery } from "@/lib/create-query";

const useChats = createQuery<Chat[]>({
  queryKey: ["chats"],
  url: "chats",
});

export default useChats;
