"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAdminDisputes from "@/hooks/useAdminDisputes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { handleApiError } from "@/lib/handle-api-error";
import apiClient from "@/services/api-client";
import toast from "react-hot-toast";
import Dispute from "@/schemas/Dispute";

const statusOptions = ["open", "in_progress", "resolved", "closed"];

function getStatusVariant(status: string) {
  switch (status) {
    case "open":
      return "destructive";
    case "in_progress":
      return "secondary";
    case "resolved":
      return "default";
    case "closed":
      return "outline";
    default:
      return "outline";
  }
}

export default function DisputesTable() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useAdminDisputes();

  const updateMutation = useMutation({
    mutationFn: ({ id, dispute }: { id: string; dispute: Partial<Dispute> & { status: string } }) =>
      apiClient.put(`/disputes/${id}`, {
        title: dispute.title,
        type: dispute.type,
        description: dispute.description,
        job: dispute.job?._id,
        evidence: dispute.evidence || "",
        status: dispute.status,
      }),
    onSuccess: () => {
      toast.success("Dispute updated");
      queryClient.invalidateQueries({ queryKey: ["admin-disputes"] });
    },
    onError: (error) => handleApiError(error, "Failed to update dispute"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/disputes/${id}`),
    onSuccess: () => {
      toast.success("Dispute deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-disputes"] });
    },
    onError: (error) => handleApiError(error, "Failed to delete dispute"),
  });

  const disputes = data?.data || [];

  const handleStatusChange = (dispute: Dispute, newStatus: string) => {
    updateMutation.mutate({
      id: dispute._id,
      dispute: { ...dispute, status: newStatus },
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : disputes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No disputes found
                </TableCell>
              </TableRow>
            ) : (
              disputes.map((dispute) => (
                <TableRow key={dispute._id}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {dispute.title}
                  </TableCell>
                  <TableCell>
                    {dispute.user?.firstName} {dispute.user?.lastName}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {dispute.job?.title || "-"}
                  </TableCell>
                  <TableCell className="capitalize">{dispute.type}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(dispute.status)}>
                      {dispute.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(dispute.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        value={dispute.status}
                        onValueChange={(v) => handleStatusChange(dispute, v)}
                      >
                        <SelectTrigger className="w-[130px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s.replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Dispute</AlertDialogTitle>
                            <AlertDialogDescription>
                              Delete dispute &quot;{dispute.title}&quot;? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                deleteMutation.mutate(dispute._id)
                              }
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
