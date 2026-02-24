import Category from "@/schemas/Category";
import { createQuery } from "@/lib/create-query";

const useJobCategorys = createQuery<Category[]>({
  queryKey: ["categorys"],
  url: "/categories/job",
});

export default useJobCategorys;
