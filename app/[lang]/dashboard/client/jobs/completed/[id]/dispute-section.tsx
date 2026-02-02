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
import { DisputeDialog } from "../../[id]/dispute-dialog";

interface Props {
  jobId: string;
}

export default function DisputeSection({ jobId }: Props) {
  const { data } = useDisputesByJob(jobId);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Disputes</h3>
        <DisputeDialog jobId={jobId} />
      </div>
      
      <p className="text-sm text-gray-600">
        Here, you can address any issues or concerns regarding your completed job. 
        Click the button above to file a dispute if payment has not been cleared properly.
      </p>

      {data && data.data.length > 0 && (
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Create Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((dispute) => (
                <TableRow key={dispute._id}>
                  <TableCell>{dispute.title}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      {dispute.status}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(dispute.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

