import Dispute from "@/schemas/Dispute";
import { createQuery } from "@/lib/create-query";

const useAdminDisputes = createQuery<Dispute[]>({
  queryKey: ["admin-disputes"],
  url: "/disputes",
});

export default useAdminDisputes;
