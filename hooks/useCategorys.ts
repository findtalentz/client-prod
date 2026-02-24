import Category from "@/schemas/Category";
import { createQuery } from "@/lib/create-query";

const useJobCategorys = createQuery<Category[]>({
  queryKey: ["categorys"],
  url: "/categorys/job",
});

export default useJobCategorys;
