import { Skeleton } from "@/components/ui/skeleton";

interface TalentCardSkeletonProps {
  count?: number;
}

export default function TalentCardSkeleton({ count = 6 }: TalentCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border">
          {/* Banner */}
          <Skeleton className="h-24 w-full rounded-none" />

          <div className="space-y-4 px-3 py-4">
            {/* Avatar + name + actions */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="space-y-1 text-center">
                  <Skeleton className="mx-auto h-5 w-10" />
                  <Skeleton className="mx-auto h-3 w-14" />
                </div>
              ))}
            </div>

            <Skeleton className="h-px w-full" />

            {/* About text */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
