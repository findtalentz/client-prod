import Container from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container>
      {/* Heading */}
      <Skeleton className="h-8 w-40 my-6" />

      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
        {/* Sidebar filters */}
        <div className="w-full md:w-[300px] space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>

        {/* Job cards list */}
        <div className="flex-1 px-3 space-y-4 w-full">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-b pb-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-3">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
