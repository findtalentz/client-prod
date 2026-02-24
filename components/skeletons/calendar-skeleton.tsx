import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-28" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-16 rounded-md" />
          <Skeleton className="h-9 w-16 rounded-md" />
          <Skeleton className="h-9 w-16 rounded-md" />
        </div>
      </div>

      {/* Calendar grid */}
      <div className="rounded-lg border">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="border-r p-3 last:border-r-0">
              <Skeleton className="mx-auto h-4 w-8" />
            </div>
          ))}
        </div>
        {/* Grid rows */}
        {Array.from({ length: 5 }).map((_, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-7 border-b last:border-b-0">
            {Array.from({ length: 7 }).map((_, colIdx) => (
              <div key={colIdx} className="min-h-[80px] border-r p-2 last:border-r-0">
                <Skeleton className="h-4 w-5" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
