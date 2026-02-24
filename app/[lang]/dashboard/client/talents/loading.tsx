import TalentCardSkeleton from "@/components/skeletons/talent-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="py-6 mb-8 md:mb-3">
      <Skeleton className="mb-6 h-7 w-24" />
      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Skeleton className="h-10 w-64 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
      <TalentCardSkeleton count={6} />
    </div>
  );
}
