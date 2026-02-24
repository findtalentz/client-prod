import Job from "@/schemas/Job";
import { createQuery } from "@/lib/create-query";

interface Params {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

const useAdminJobs = createQuery<Job[], Params>({
  queryKey: ({ search, status, page = 1, pageSize = 10 }) => [
    "admin-jobs",
    search,
    status,
    page,
    pageSize,
  ],
  url: "/jobs",
  params: ({ search, status, page = 1, pageSize = 10 }) => ({
    search,
    status,
    page,
    pageSize,
  }),
});

export default useAdminJobs;
