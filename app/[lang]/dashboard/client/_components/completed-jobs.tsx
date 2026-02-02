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
  return (
    <div
      className={cn(" flex justify-between flex-col max-h-[200px]", className)}
    >
      <div className="flex-1 flex items-center justify-between">
        <div className="flex flex-1 items-center relative">
          <div
            className={cn("absolute h-full w-2 rounded-4xl")}
            style={{
              backgroundColor:
                config[data.rankOneByCategory?.category ?? ""]?.color,
            }}
          />
          <div className="flex-1 flex flex-col ps-4 gap-2">
            <span className="font-semibold text-primary text-sm">
              {data.rankOneByCategory?.category ?? ""}
            </span>
            <div className="space-x-3">
              <span
                className="text-2xl font-semibold"
                style={{
                  color: config[data.rankOneByCategory?.category ?? ""]?.color,
                }}
              >
                {data.rankOneByCategory?.totalJobs ?? ""}
              </span>
              <span className="inline text-gray-500">Jobs</span>
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-center relative">
          <div
            className="absolute h-full w-2 rounded-4xl"
            style={{
              backgroundColor:
                config[data.rankTwoByCategory?.category ?? ""]?.color,
            }}
          />
          <div className="flex-1 flex flex-col ps-4 gap-2">
            <span className="font-semibold text-primary text-sm">
              {data.rankTwoByCategory?.category ?? ""}
            </span>
            <div className="space-x-3">
              <span
                className="text-2xl font-semibold"
                style={{
                  color: config[data.rankTwoByCategory?.category ?? ""]?.color,
                }}
              >
                {data.rankTwoByCategory?.totalJobs ?? ""}
              </span>
              <span className="inline text-gray-500">Jobs</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-between">
        <div className="flex flex-1 items-center relative">
          <div
            className="absolute h-full w-2 rounded-4xl"
            style={{
              backgroundColor:
                config[data.rankThreeByCategory?.category ?? ""]?.color,
            }}
          />
          <div className="flex-1 flex flex-col ps-4 gap-2">
            <span className="font-semibold text-primary text-sm">
              {data.rankThreeByCategory?.category ?? ""}
            </span>
            <div className="space-x-3">
              <span
                className="text-2xl font-semibold"
                style={{
                  color:
                    config[data.rankThreeByCategory?.category ?? ""]?.color,
                }}
              >
                {data.rankThreeByCategory?.totalJobs ?? ""}
              </span>
              <span className="inline text-gray-500">Jobs</span>
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-center relative">
          <div
            className="absolute h-full w-2 rounded-4xl"
            style={{
              backgroundColor:
                config[data.rankFourByCategory?.category ?? ""]?.color,
            }}
          />
          <div className="flex-1 flex flex-col ps-4 gap-2">
            <span className="font-semibold text-primary text-sm">
              {data.rankFourByCategory?.category ?? ""}
            </span>
            <div className="space-x-3">
              <span
                className="text-2xl font-semibold"
                style={{
                  color: config[data.rankFourByCategory?.category ?? ""]?.color,
                }}
              >
                {data.rankFourByCategory?.totalJobs ?? ""}
              </span>
              <span className="inline text-gray-500">Jobs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompletedJobs;
