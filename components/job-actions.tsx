"use client";
import { CreateJobApplication } from "@/components/create-job-application";
import { Button } from "@/components/ui/button";
import useSession from "@/hooks/useSession";
import Job from "@/schemas/Job";
import { FaAngleLeft } from "react-icons/fa";

interface Props {
  job: Job;
  handleOpen: () => void;
  isApplied: boolean;
}

function JobActions({ job, handleOpen, isApplied }: Props) {
  const { data } = useSession();

  return (
    <div className="flex items-center justify-between">
      <Button
        onClick={handleOpen}
        variant="link"
        className="no-underline cursor-pointer"
      >
        <FaAngleLeft /> Back
      </Button>
      {data?.data.role === "SELLER" && (
        <div>
          {isApplied && <Button variant="light">Applied</Button>}
          {!isApplied && <CreateJobApplication job={job} />}
        </div>
      )}
    </div>
  );
}

export default JobActions;
