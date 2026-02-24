import TableSkeleton from "@/components/skeletons/table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-end">
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>
      <Skeleton className="h-6 w-40" />
      <TableSkeleton columns={4} rows={5} />
    </div>
  );
}
