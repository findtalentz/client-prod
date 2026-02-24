import Comment from "@/schemas/Comment";
import { createQuery } from "@/lib/create-query";

const useComments = createQuery<Comment[], string>({
  queryKey: (job) => ["comments", job],
  url: (job) => `/comments/job/${job}`,
});

export default useComments;
