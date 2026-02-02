import Container from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { Flex, Grid } from "@radix-ui/themes";

export default function Loading() {
  return (
    <Container className="py-10">
      <div className="space-y-10 pb-20">
        <Flex justify="between">
          <Flex gap="5">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-5">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Flex align="center" gap="6">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </Flex>
              </div>
              <Flex wrap="wrap" gap="2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-20 rounded-full" />
                ))}
              </Flex>
            </div>
          </Flex>
          <Skeleton className="h-10 w-32" />
        </Flex>

        <Grid columns={{ initial: "1", md: "2" }} align="center" gap="5">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              className="rounded-3xl border shadow-2xl p-5 space-y-3"
              key={i}
            >
              <Skeleton className="h-5 w-24 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Flex align="center" justify="between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-20" />
              </Flex>
            </div>
          ))}

          <div className="rounded-3xl border shadow-2xl p-5 h-full">
            <Skeleton className="h-5 w-24 mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-28" />
              ))}
            </div>
          </div>
        </Grid>

        <div>
          <Skeleton className="h-5 w-16 mb-3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      <div className="space-y-10">
        <div className="space-y-6">
          <Skeleton className="h-6 w-32" />
          <Grid columns={{ initial: "1", md: "3" }} gap="5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </Grid>
        </div>

        <div className="space-y-6">
          <Skeleton className="h-6 w-32" />
          <Grid columns={{ initial: "1", md: "3" }} gap="5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3 p-4 border rounded-lg">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full mt-2" />
              </div>
            ))}
          </Grid>
        </div>
      </div>
    </Container>
  );
}
