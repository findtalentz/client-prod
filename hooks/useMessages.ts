import { Message } from "@/schemas/Message";
import { createQuery } from "@/lib/create-query";

const useMessages = createQuery<Message[], string>({
  queryKey: (chatId) => ["messages", chatId],
  url: "/messages",
  params: (chatId) => ({ chatId }),
});

export default useMessages;
