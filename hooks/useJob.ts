import ApiResponse from "@/schemas/ApiRespose";
import Job from "@/schemas/Job";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useJob = (jobId: string) => {
  return useQuery<ApiResponse<Job>, Error>({
    queryKey: ["job", jobId],
    queryFn: () =>
      apiClient.get<ApiResponse<Job>>(`/jobs/${jobId}`).then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useJob;
