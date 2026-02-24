import TableSkeleton from "@/components/skeletons/table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-36" />
      <TableSkeleton columns={5} rows={8} />
    </div>
  );
}
