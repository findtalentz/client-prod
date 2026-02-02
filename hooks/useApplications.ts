import ApiResponse from "@/schemas/ApiRespose";
import Application from "@/schemas/Application";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useApplications = (jobId: string) => {
  return useQuery<ApiResponse<Application[]>, Error>({
    queryKey: ["applications", jobId],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Application[]>>("/applications", {
          params: {
            jobId,
          },
        })
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useApplications;
