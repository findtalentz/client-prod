import ApiResponse from "@/schemas/ApiRespose";
import Category from "@/schemas/Category";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

const useCategory = (id: string) => {
  return useQuery<ApiResponse<Category>, Error>({
    queryKey: ["category", id],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Category>>(`/categorys/${id}`)
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useCategory;
