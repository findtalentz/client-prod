import { Skeleton } from "@/components/ui/skeleton";

interface RoyaltyCardSkeletonProps {
  count?: number;
}

export default function RoyaltyCardSkeleton({ count = 5 }: RoyaltyCardSkeletonProps) {
  return (
    <div>
      <Skeleton className="mb-6 h-7 w-40" />
      <div className="space-y-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {/* Left: tier card */}
            <div className="overflow-hidden rounded-xl border">
              <div className="space-y-3 p-6">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-4 w-48" />
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </div>
              <div className="border-t px-6 py-3">
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            {/* Right: progress */}
            <div className="flex flex-col justify-center space-y-4 p-4">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-full rounded-full" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
