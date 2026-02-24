import TableSkeleton from "@/components/skeletons/table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* 3 Balance cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-5 w-5 rounded" />
            </div>
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        ))}
      </div>

      {/* Withdraw & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Withdraw form */}
        <div className="rounded-lg border">
          <div className="border-b p-6">
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="space-y-4 p-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>

        {/* Payment methods */}
        <div className="rounded-lg border">
          <div className="flex items-center justify-between border-b p-6">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
          <div className="space-y-4 p-6">
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
          </div>
        </div>
      </div>

      {/* Balance table */}
      <TableSkeleton columns={3} rows={3} />

      {/* Withdrawal history */}
      <div className="rounded-lg border">
        <div className="border-b p-6">
          <Skeleton className="h-5 w-40" />
        </div>
        <TableSkeleton columns={3} rows={4} showHeader={true} />
      </div>
    </div>
  );
}
