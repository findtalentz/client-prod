import TalentCardSkeleton from "@/components/skeletons/talent-card-skeleton";
import Container from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container className="py-6 mb-8 md:mb-3">
      {/* Heading */}
      <Skeleton className="h-8 w-32 mb-6" />

      {/* Search / filter action bar */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Skeleton className="h-10 w-64 rounded-md" />
        <Skeleton className="h-10 w-36 rounded-md" />
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>

      {/* Talent card grid */}
      <TalentCardSkeleton count={6} />
    </Container>
  );
}
