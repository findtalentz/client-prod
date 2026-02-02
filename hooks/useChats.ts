import ApiResponse from "@/schemas/ApiRespose";
import { Chat } from "@/schemas/Chat";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useChats = () => {
  return useQuery<ApiResponse<Chat[]>, Error>({
    queryKey: ["chats"],
    queryFn: () =>
      apiClient.get<ApiResponse<Chat[]>>("chats").then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useChats;
