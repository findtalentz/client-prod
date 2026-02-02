import ApiResponse from "@/schemas/ApiRespose";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useIsApplyed = (jobId: string) => {
  return useQuery<ApiResponse<boolean>, Error>({
    queryKey: ["is_applyed", jobId],
    queryFn: () =>
      apiClient
        .post<ApiResponse<boolean>>("/applications/is-applyed", { job: jobId })
        .then((res) => res.data),
    staleTime: 60 * 1000,
  });
};

export default useIsApplyed;
