import ApiResponse from "@/schemas/ApiRespose";
import Category from "@/schemas/Category";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useJobCategorys = () => {
  return useQuery<ApiResponse<Category[]>, Error>({
    queryKey: ["categorys"],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Category[]>>("/categorys/job")
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useJobCategorys;
