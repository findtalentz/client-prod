import ApiResponse from "@/schemas/ApiRespose";
import Comment from "@/schemas/Comment";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useAllComments = () => {
  return useQuery<ApiResponse<Comment[]>, Error>({
    queryKey: ["all_comments"],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Comment[]>>("/comments/all", {
          params: { pageSize: 5 },
        })
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useAllComments;
