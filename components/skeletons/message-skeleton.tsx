import { Skeleton } from "@/components/ui/skeleton";

export default function MessageSkeleton() {
  return (
    <div className="flex h-[calc(100dvh-115px)] overflow-hidden rounded-lg border">
      {/* Sidebar - Chat list */}
      <div className="w-[300px] shrink-0 border-r">
        <div className="border-b p-4">
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="space-y-1 p-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-md p-3">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col">
        {/* Chat header */}
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>

        {/* Messages area */}
        <div className="flex-1 space-y-4 p-4">
          <div className="flex justify-start">
            <Skeleton className="h-10 w-48 rounded-2xl" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-10 w-56 rounded-2xl" />
          </div>
          <div className="flex justify-start">
            <Skeleton className="h-16 w-64 rounded-2xl" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-10 w-40 rounded-2xl" />
          </div>
        </div>

        {/* Message input */}
        <div className="border-t p-4">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
