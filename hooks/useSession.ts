import ApiResponse from "@/schemas/ApiRespose";
import User from "@/schemas/User";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useSession = () => {
  return useQuery<ApiResponse<User>, Error>({
    queryKey: ["session"],
    queryFn: () =>
      apiClient.get<ApiResponse<User>>("/auth/me").then((res) => res.data),
    staleTime: 60 * 1000,
    retry: 1,
  });
};

export default useSession;
