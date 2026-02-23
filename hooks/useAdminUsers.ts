import ApiResponse from "@/schemas/ApiRespose";
import User from "@/schemas/User";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

interface Params {
  search?: string;
  role?: string;
  page?: number;
  pageSize?: number;
}

const useAdminUsers = ({ search, role, page = 1, pageSize = 10 }: Params) => {
  return useQuery<ApiResponse<User[]>, Error>({
    queryKey: ["admin-users", search, role, page, pageSize],
    queryFn: () =>
      apiClient
        .get<ApiResponse<User[]>>("/users", {
          params: { search, role, page, pageSize },
        })
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useAdminUsers;
