"use client";
import useComments from "@/hooks/useComments";
import { cn } from "@/lib/utils";
import Job from "@/schemas/Job";
import { useState } from "react";
import { Activity } from "./activity";
import Disput from "./disput";

interface Props {
  job: Job;
}

function Actions({ job }: Props) {
  const [current, setCurrent] = useState<"details" | "disput">("details");
  const { data } = useComments(job._id);
  return (
    <div>
      <div className="mb-6 px-4">
        <h2 className="text-2xl font-semibold mb-4">{job.title}</h2>
        <div className="w-full max-w-md flex items-center justify-between h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm">
          <button
            type="button"
            onClick={() => setCurrent("details")}
            className={cn(
              "flex-1 flex items-center justify-center h-full rounded-full font-medium",
              current === "details" && "bg-primary text-white"
            )}
          >
            Activity
          </button>
          <button
            type="button"
            onClick={() => setCurrent("disput")}
            className={cn(
              "flex-1 flex items-center justify-center h-full rounded-full font-medium",
              current === "disput" && "bg-primary text-white"
            )}
          >
            Dispute
          </button>
        </div>
      </div>
      {current === "details" ? (
        <Activity job={job} comments={data?.data || []} />
      ) : (
        <Disput jobId={job._id} />
      )}
    </div>
  );
}

export default Actions;
