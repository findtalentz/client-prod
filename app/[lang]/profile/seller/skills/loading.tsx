import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mb-30">
      {/* Title */}
      <Skeleton className="h-8 w-48 mb-5" />

      {/* Skills section */}
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-10 w-full max-w-md rounded-md" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-full" />
            ))}
          </div>
        </div>

        {/* Languages section */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full max-w-md rounded-md" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
