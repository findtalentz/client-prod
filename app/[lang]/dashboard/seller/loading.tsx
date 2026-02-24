import ChartSkeleton from "@/components/skeletons/chart-skeleton";
import MiniCalendarSkeleton from "@/components/skeletons/mini-calendar-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <Skeleton className="mb-2 h-7 w-36" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-5">
        {/* Left column: charts + progress */}
        <div className="space-y-6">
          <ChartSkeleton />
          <ChartSkeleton />
          {/* Royalty progress */}
          <div className="rounded-3xl border p-6 shadow-sm space-y-3">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        {/* Right column: balance + calendar + active jobs */}
        <div className="space-y-6">
          {/* Balance card */}
          <div className="rounded-3xl border p-6 shadow-sm space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
          <MiniCalendarSkeleton />
          {/* Active jobs pie */}
          <div className="rounded-3xl border p-6 shadow-sm space-y-3">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="mx-auto h-[160px] w-[160px] rounded-full" />
            <div className="flex justify-center gap-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
