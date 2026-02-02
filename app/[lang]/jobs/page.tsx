import AllJobs from "@/components/all-jobs";
import ApiResponse from "@/schemas/ApiRespose";
import JobSchema from "@/schemas/Job";
import apiClient from "@/services/api-client";

interface Props {
  searchParams: Promise<{
    search: string;
    orderBy: string;
    jobType: string;
    requiredExperienceLevel: string;
    duration: string;
    category: string;
    budgetType: string;
  }>;
}

import JobFilters from "@/components/job-filters";
import Container from "@/components/ui/container";
export const dynamic = "force-dynamic";

export default async function Jobs({ searchParams }: Props) {
  const filterParams = await searchParams;
  const search = filterParams.search ? filterParams.search : null;
  const budgetType = filterParams.budgetType ? filterParams.budgetType : null;
  const jobType = filterParams.jobType ? filterParams.jobType : null;
  const duration = filterParams.duration ? filterParams.duration : null;
  const requiredExperienceLevel = filterParams.requiredExperienceLevel
    ? filterParams.requiredExperienceLevel
    : null;
  const category = filterParams.category ? filterParams.category : null;
  const orderBy = filterParams.orderBy ? filterParams.orderBy : null;
  const { data } = await apiClient.get<ApiResponse<JobSchema[]>>("/jobs", {
    params: {
      status: "OPEN",
      search,
      orderBy,
      budgetType,
      requiredExperienceLevel,
      duration,
      jobType,
      category,
    },
  });
  return (
    <>
      <Container>
        <h2 className="my-6">Opening Jobs</h2>
      </Container>
      <Container className="flex flex-col md:flex-row items-start justify-between mb-16">
        <div className="w-full md:w-[300px]">
          <JobFilters />
        </div>
        <div className="flex-1 px-3">
          <AllJobs jobs={data.data} />
        </div>
      </Container>
    </>
  );
}
