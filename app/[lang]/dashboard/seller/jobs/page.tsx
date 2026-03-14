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
import { getDictionary } from "../../../dictionaries";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ lang: "en" | "ch" }>;
}

export default async function JobManagemnet({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.dashboard;

  const [{ data }, { data: settingsRes }] = await Promise.all([
    apiClient.get<ApiResponse<Job[]>>("/jobs/seller", {
      params: { status: "IN_PROGRESS" },
    }),
    apiClient.get<ApiResponse<{ serviceFee: number }>>("/settings/public"),
  ]);
  const COMMISSION_RATE = 1 - (settingsRes.data.serviceFee ?? 10) / 100;

  if (data.count <= 0)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
        <p className="text-lg font-medium">{t.seller.noInProgressTasks}</p>
        <p className="text-sm mt-1">{t.seller.jobsWillAppearHere}</p>
      </div>
    );

  return (
    <>
      <h1 className="my-5">{t.common.inProgressTasks}</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t.common.jobTitle}</TableHead>
            <TableHead>{t.seller.sellerEarnings}</TableHead>
            <TableHead>{t.common.startDate}</TableHead>
            <TableHead>{t.common.deliverDate}</TableHead>
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
                ${(job.budgetAmount * COMMISSION_RATE).toFixed(2)}
              </TableCell>
              <TableCell>{formatDate(job.startDate)}</TableCell>
              <TableCell>
                {formatDate(job.deliveryDate)}

                {new Date(job.deliveryDate) < new Date() && (
                  <Badge className="ms-2" variant="destructive">
                    {t.common.late}
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
