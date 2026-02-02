import ApiResponse from "@/schemas/ApiRespose";
import Job from "@/schemas/Job";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useMyJobs = (status: "OPEN" | "IN_PROGRESS" | "COMPLETED") => {
  return useQuery<ApiResponse<Job[]>, Error>({
    queryKey: ["my_jobs", status],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Job[]>>("/jobs/client", {
          params: {
            status,
          },
        })
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useMyJobs;
