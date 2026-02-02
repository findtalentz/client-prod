import ApiResponse from "@/schemas/ApiRespose";
import Notification from "@/schemas/Notification";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useNotifications = () => {
  return useQuery<ApiResponse<Notification[]>, Error>({
    queryKey: ["notifications"],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Notification[]>>("/notifications")
        .then((res) => res.data),
    staleTime: 30 * 1000,
    retry: 1,
  });
};

export default useNotifications;
