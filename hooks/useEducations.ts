import ApiResponse from "@/schemas/ApiRespose";
import Education from "@/schemas/Education";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useEducations = () => {
  return useQuery<ApiResponse<Education[]>, Error>({
    queryKey: ["educations"],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Education[]>>("/educations")
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useEducations;
