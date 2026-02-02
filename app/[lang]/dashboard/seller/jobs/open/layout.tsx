import JobFilters from "@/components/job-filters";
import { PropsWithChildren } from "react";

export default function JobPageLayout({ children }: PropsWithChildren) {
  return (
    <>
      <h2 className="my-6">Opening Jobs</h2>
      <div className="flex flex-col md:flex-row items-start justify-between mb-16">
        <div className="w-full md:w-[300px]">
          <JobFilters />
        </div>
        <div className="flex-1 px-3">{children}</div>
      </div>
    </>
  );
}
