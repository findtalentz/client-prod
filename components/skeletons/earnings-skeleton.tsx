import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EarningsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Balance Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <Skeleton className="h-9 w-24 mt-4" />
            </CardContent>
          </Card>

          {/* Pending + Lifetime */}
          <div className="grid grid-cols-2 gap-4">
            {[0, 1].map((i) => (
              <Card key={i}>
                <CardContent className="pt-5 pb-5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-7 w-20 mt-2" />
                  <Skeleton className="h-8 w-8 rounded-full mt-3" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Methods */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-[58px] w-full rounded-lg" />
              <Skeleton className="h-[58px] w-full rounded-lg" />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <Skeleton className="h-10 w-60 rounded-md mb-4" />

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <div className="p-4 space-y-4">
                {/* Table Header */}
                <div className="flex gap-8">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                {/* Table Rows */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-8 items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
