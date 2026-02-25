import { Message } from "@/schemas/Message";
import { createQuery } from "@/lib/create-query";
import { CACHE } from "@/lib/constants";

const useMessages = createQuery<Message[], string>({
  queryKey: (chatId) => ["messages", chatId],
  url: "/messages",
  params: (chatId) => ({ chatId }),
  staleTime: CACHE.REALTIME,
});

export default useMessages;
