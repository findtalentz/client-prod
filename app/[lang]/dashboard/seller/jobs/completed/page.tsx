import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import ApiResponse from "@/schemas/ApiRespose";
import Job from "@/schemas/Job";
import apiClient from "@/services/api-client";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CompletedJob() {
  const { data } = await apiClient.get<ApiResponse<Job[]>>("/jobs/seller", {
    params: { status: "COMPLETED" },
  });

  if (data.count <= 0)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
        <p className="text-lg font-medium">No completed jobs yet</p>
        <p className="text-sm mt-1">Jobs you have completed will appear here.</p>
      </div>
    );

  return (
    <>
      <h2 className="my-5">Completed Job</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Completed At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((job) => (
            <TableRow key={job._id}>
              <TableCell>
                <Link
                  className="text-xl text-primary"
                  href={`/dashboard/seller/jobs/completed/${job._id}`}
                >
                  {job.title}
                </Link>
              </TableCell>
              <TableCell className="text-xl text-primary">
                ${job.budgetAmount}
              </TableCell>
              <TableCell>{formatDate(job.startDate)}</TableCell>
              <TableCell>{formatDate(job.completedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
