import ApiResponse from "@/schemas/ApiRespose";
import Application from "@/schemas/Application";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useJobApplications = (jobId: string) => {
  return useQuery<ApiResponse<Application[]>, Error>({
    queryKey: ["jobapplications", jobId],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Application[]>>(`/applications/client/${jobId}`, {
          params: { jobId },
        })
        .then((res) => res.data),
    staleTime: 60 * 1000,
  });
};

export default useJobApplications;
