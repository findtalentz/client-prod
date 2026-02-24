import User from "@/schemas/User";
import { createQuery } from "@/lib/create-query";

interface Params {
  search?: string;
  role?: string;
  page?: number;
  pageSize?: number;
}

const useAdminUsers = createQuery<User[], Params>({
  queryKey: ({ search, role, page = 1, pageSize = 10 }) => [
    "admin-users",
    search,
    role,
    page,
    pageSize,
  ],
  url: "/users",
  params: ({ search, role, page = 1, pageSize = 10 }) => ({
    search,
    role,
    page,
    pageSize,
  }),
});

export default useAdminUsers;
