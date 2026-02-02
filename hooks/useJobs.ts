import ApiResponse from "@/schemas/ApiRespose";
import Job from "@/schemas/Job";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useJobs = () => {
  return useQuery<ApiResponse<Job[]>, Error>({
    queryKey: ["jobs"],
    queryFn: () =>
      apiClient.get<ApiResponse<Job[]>>("/jobs").then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useJobs;
