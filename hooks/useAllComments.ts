import Comment from "@/schemas/Comment";
import { createQuery } from "@/lib/create-query";

const useAllComments = createQuery<Comment[]>({
  queryKey: ["all_comments"],
  url: "/comments/all",
  params: { pageSize: 5 },
});

export default useAllComments;
