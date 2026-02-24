import Jobwishlist from "@/schemas/JobWishlist";
import { createQuery } from "@/lib/create-query";

const useJobWishlists = createQuery<Jobwishlist[]>({
  queryKey: ["jobwishlist"],
  url: "/jobwishlist",
});

export default useJobWishlists;
