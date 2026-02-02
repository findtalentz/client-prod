import { Badge } from "@/components/ui/badge";
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

export default async function JobManagemnet() {
  const { data } = await apiClient.get<ApiResponse<Job[]>>("/jobs/seller", {
    params: {
      status: "IN_PROGRESS",
    },
  });

  if (data.count <= 0) return null;

  return (
    <>
      <h1 className="my-5">In Progress Tasks</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Deliver Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((job) => (
            <TableRow key={job._id}>
              <TableCell>
                <Link
                  className="text-xl text-primary"
                  href={`/dashboard/seller/jobs/${job._id}`}
                >
                  {job.title}
                </Link>
              </TableCell>
              <TableCell className="text-xl text-primary">
                ${job.budgetAmount}
              </TableCell>
              <TableCell>{formatDate(job.startDate)}</TableCell>
              <TableCell>
                {formatDate(job.deliveryDate)}

                {new Date(job.deliveryDate) < new Date() && (
                  <Badge className="ms-2" variant="destructive">
                    LATE
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
