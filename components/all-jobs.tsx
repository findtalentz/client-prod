import Job from "@/schemas/Job";
import JobCard from "./job-card";
import SearchBox from "./search-box";
import JobSortBy from "./job-sort-by";

interface Props {
  jobs: Job[];
}

export default function AllJobs({ jobs }: Props) {
  return (
    <div>
      <div className="flex items-center gap-5 mt-6 md:mt-0">
        <JobSortBy />
        <SearchBox />
      </div>
      <div className="space-y-2 md:ps-6">
        {jobs.map((job) => (
          <JobCard job={job} key={job._id} />
        ))}
      </div>
    </div>
  );
}
