import { Skeleton } from "@/components/ui/skeleton";

interface ChartSkeletonProps {
  className?: string;
}

export default function ChartSkeleton({ className }: ChartSkeletonProps) {
  return (
    <div className={`rounded-3xl border p-6 shadow-sm ${className ?? ""}`}>
      <Skeleton className="mb-2 h-5 w-36" />
      <Skeleton className="mb-6 h-3 w-48" />
      <Skeleton className="h-[220px] w-full rounded-xl" />
    </div>
  );
}
