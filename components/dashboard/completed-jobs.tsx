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
  ];

  return (
    <div
      className={cn(
        "flex justify-between flex-col max-h-[220px] gap-6",
        className
      )}
    >
      {[0, 2].map((startIndex) => (
        <div
          key={startIndex}
          className="flex-1 flex items-center justify-between"
        >
          {ranks.slice(startIndex, startIndex + 2).map((rank, i) => {
            const category = rank?.category ?? "";
            return (
              <div
                key={startIndex + i}
                className="flex flex-1 items-center relative"
              >
                <div
                  className="absolute h-full w-2 rounded-4xl"
                  style={{
                    backgroundColor: config[category]?.color,
                  }}
                />
                <div className="flex-1 flex flex-col ps-4 gap-2">
                  <span className="font-semibold text-primary text-sm">
                    {category}
                  </span>
                  <div className="space-x-1">
                    <span
                      className="text-2xl font-semibold"
                      style={{
                        color: config[category]?.color,
                      }}
                    >
                      {rank?.totalJobs ?? ""}
                    </span>
                    <span className="inline text-gray-500 text-sm">Jobs</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default CompletedJobs;
