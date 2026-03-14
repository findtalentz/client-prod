import DownloadInvoiceButton from "@/components/download-invoice-button";
import { buttonVariants } from "@/components/ui/button";
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
interface Props {
  params: Promise<{ lang: "en" | "ch" }>;
}

export default async function CompletedJob({ params }: Props) {
  const { lang } = await params;
  const { data } = await apiClient.get<ApiResponse<Job[]>>("/jobs/client", {
    params: {
      status: "COMPLETED",
    },
  });

  return (
    <>
      <div className="flex items-center justify-end w-full">
        <Link href={`/${lang}/dashboard/client/jobs/new`} className={buttonVariants()}>
          Create New Job
        </Link>
      </div>
      <h2 className="my-5">Completed Job</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Completed At</TableHead>
            <TableHead>Invoice</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((job) => (
            <TableRow key={job._id}>
              <TableCell>
                <Link
                  className="text-xl text-primary"
                  href={`/${lang}/dashboard/client/jobs/completed/${job._id}`}
                >
                  {job.title}
                </Link>
              </TableCell>
              <TableCell className="text-xl text-primary">
                ${job.budgetAmount}
              </TableCell>
              <TableCell>{formatDate(job.startDate)}</TableCell>
              <TableCell>{formatDate(job.completedAt)}</TableCell>
              <TableCell>
                <DownloadInvoiceButton jobId={job._id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
