"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

import useDisputesByJob from "@/hooks/useDisputesByJob";
import { DisputeDialog } from "./dispute-dialog";

interface Props {
  jobId: string;
}

export default function DisputePage({ jobId }: Props) {
  const { data } = useDisputesByJob(jobId);

  return (
    <div className="space-y-4 px-4">
      <p>
        Here, you can address any issues or concerns regarding your projects. To
        get started, click the button below to file a dispute for any unresolved
        matters.
      </p>
      <div className="mt-6">
        {data && data.data.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead> Title </TableHead>
                <TableHead> Status </TableHead>
                <TableHead> Create Date </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((dispute) => (
                <TableRow key={dispute._id}>
                  <TableCell> {dispute.title} </TableCell>
                  <TableCell> {dispute.status} </TableCell>
                  <TableCell> {formatDate(dispute.createdAt)} </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <DisputeDialog jobId={jobId} />
    </div>
  );
}
