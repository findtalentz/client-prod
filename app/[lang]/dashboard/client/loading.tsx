import ChartSkeleton from "@/components/skeletons/chart-skeleton";
import MiniCalendarSkeleton from "@/components/skeletons/mini-calendar-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-2 sm:p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>

      {/* Top row: 3-col grid (lists, calendar) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Applications list */}
        <div className="rounded-3xl border p-6 shadow-sm space-y-4">
          <Skeleton className="h-5 w-32" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>

        {/* Actions list */}
        <div className="rounded-3xl border p-6 shadow-sm space-y-4">
          <Skeleton className="h-5 w-32" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <MiniCalendarSkeleton />
      </div>

      {/* Bottom row: Active Jobs + Royalty | Spend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6">
        <div className="space-y-6">
          {/* Active jobs / pie chart */}
          <div className="rounded-3xl border p-6 shadow-sm space-y-3">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="mx-auto h-[160px] w-[160px] rounded-full" />
            <div className="flex justify-center gap-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          {/* Royalty progress */}
          <div className="rounded-3xl border p-6 shadow-sm space-y-3">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <ChartSkeleton />
      </div>
    </div>
  );
}
