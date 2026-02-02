import ApiResponse from "@/schemas/ApiRespose";
import Comment from "@/schemas/Comment";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useComments = (job: string) => {
  return useQuery<ApiResponse<Comment[]>, Error>({
    queryKey: ["comments", job],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Comment[]>>(`/comments/job/${job}`)
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useComments;
