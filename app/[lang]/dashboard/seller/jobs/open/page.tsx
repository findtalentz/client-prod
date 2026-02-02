import AllJobs from "@/components/all-jobs";
import ApiResponse from "@/schemas/ApiRespose";
import JobInterface from "@/schemas/Job";
import apiClient from "@/services/api-client";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    search: string;
    orderBy: string;
  }>;
}
export default async function JobsPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.search ? params.search : null;
  const orderBy = params.orderBy ? params.orderBy : null;
  const { data } = await apiClient.get<ApiResponse<JobInterface[]>>("/jobs", {
    params: {
      search,
      orderBy,
      status: "OPEN",
    },
  });

  return <AllJobs jobs={data.data} />;
}
