import Category from "@/schemas/Category";
import { createQuery } from "@/lib/create-query";

const useCategory = createQuery<Category, string>({
  queryKey: (id) => ["category", id],
  url: (id) => `/categorys/${id}`,
});

export default useCategory;
