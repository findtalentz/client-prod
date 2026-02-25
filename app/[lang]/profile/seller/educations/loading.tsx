import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      {/* Title */}
      <Skeleton className="h-8 w-36 mb-5" />

      {/* Education cards */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="w-full md:w-[450px] border rounded-2xl p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add button */}
      <Skeleton className="h-10 w-40 rounded-md" />
    </div>
  );
}
