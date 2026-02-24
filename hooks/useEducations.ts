import Education from "@/schemas/Education";
import { createQuery } from "@/lib/create-query";

const useEducations = createQuery<Education[]>({
  queryKey: ["educations"],
  url: "/educations",
});

export default useEducations;
