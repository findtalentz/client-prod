import ApiResponse from "@/schemas/ApiRespose";
import Job from "@/schemas/Job";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

interface Params {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

const useAdminJobs = ({ search, status, page = 1, pageSize = 10 }: Params) => {
  return useQuery<ApiResponse<Job[]>, Error>({
    queryKey: ["admin-jobs", search, status, page, pageSize],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Job[]>>("/jobs", {
          params: { search, status, page, pageSize },
        })
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useAdminJobs;
