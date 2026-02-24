import { Skeleton } from "@/components/ui/skeleton";

export default function MiniCalendarSkeleton() {
  return (
    <div className="rounded-3xl border p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-5 w-28" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-7 rounded" />
          <Skeleton className="h-7 w-7 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={`h-${i}`} className="mx-auto h-4 w-6" />
        ))}
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} className="mx-auto h-8 w-8 rounded-full" />
        ))}
      </div>
    </div>
  );
}
