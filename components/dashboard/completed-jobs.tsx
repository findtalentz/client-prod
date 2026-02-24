import { cn } from "@/lib/utils";
import ActiveJobReport from "@/schemas/ActiveJobReport";

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

interface Props {
  className?: string;
  data: ActiveJobReport;
  config: ChartConfig;
}

function CompletedJobs({ className, data, config }: Props) {
  const ranks = [
    data.rankOneByCategory,
    data.rankTwoByCategory,
    data.rankThreeByCategory,
    data.rankFourByCategory,
  ].filter(Boolean);

  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      {ranks.map((rank, i) => {
        const category = rank?.category ?? "";
        return (
          <div key={i} className="flex items-start gap-3">
            <div
              className="w-1.5 min-h-[40px] h-full rounded-full flex-shrink-0 mt-0.5"
              style={{
                backgroundColor: config[category]?.color,
              }}
            />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-medium text-primary text-xs sm:text-sm truncate">
                {category}
              </span>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-xl sm:text-2xl font-semibold"
                  style={{
                    color: config[category]?.color,
                  }}
                >
                  {rank?.totalJobs ?? 0}
                </span>
                <span className="text-muted-foreground text-xs">Jobs</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CompletedJobs;
