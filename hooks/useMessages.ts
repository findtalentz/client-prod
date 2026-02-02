import ApiResponse from "@/schemas/ApiRespose";
import { Message } from "@/schemas/Message";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useMessages = (chatId: string) => {
  return useQuery<ApiResponse<Message[]>, Error>({
    queryKey: ["messages", chatId],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Message[]>>("/messages", {
          params: {
            chatId,
          },
        })
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useMessages;
