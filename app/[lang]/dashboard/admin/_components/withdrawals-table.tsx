"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAdminWithdrawals from "@/hooks/useAdminWithdrawals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import Withdraw from "@/schemas/Withdraw";
import PaginationControls from "./pagination-controls";

const statusFilters = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Failed", value: "FAILED" },
];

function getStatusVariant(status: string) {
  switch (status) {
    case "COMPLETED":
      return "default";
    case "PENDING":
      return "secondary";
    case "FAILED":
      return "destructive";
    default:
      return "outline";
  }
}

export default function WithdrawalsTable() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useAdminWithdrawals({
    status: status || undefined,
    page,
    pageSize: 10,
  });

  const approveMutation = useMutation({
    mutationFn: (withdraw: Withdraw) =>
      apiClient.post("/withdraws/approve", {
        withdrawId: withdraw._id,
        sellerId: withdraw.user._id,
        amount: withdraw.amount,
      }),
    onSuccess: () => {
      toast.success("Withdrawal approved");
      queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
    },
    onError: (error) => handleApiError(error, "Failed to approve withdrawal"),
  });

  const cancelMutation = useMutation({
    mutationFn: (withdrawId: string) =>
      apiClient.post("/withdraws/cancel", { withdrawId }),
    onSuccess: () => {
      toast.success("Withdrawal cancelled");
      queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
    },
    onError: (error) => handleApiError(error, "Failed to cancel withdrawal"),
  });

  const withdrawals = data?.data || [];
  const pageCount = data?.pageCount || 1;

  return (
    <div className="space-y-4">
      <Tabs
        value={status || "all"}
        onValueChange={(v) => {
          setStatus(v === "all" ? "" : v);
          setPage(1);
        }}
      >
        <TabsList>
          {statusFilters.map((f) => (
            <TabsTrigger key={f.value || "all"} value={f.value || "all"}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Gateway</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : withdrawals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No withdrawals found
                </TableCell>
              </TableRow>
            ) : (
              withdrawals.map((w) => (
                <TableRow key={w._id}>
                  <TableCell>{formatDate(w.createdAt)}</TableCell>
                  <TableCell className="font-medium">
                    {w.user?.firstName} {w.user?.lastName}
                  </TableCell>
                  <TableCell>${w.amount.toLocaleString()}</TableCell>
                  <TableCell className="capitalize">
                    {w.paymentGateway || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(w.status)}>
                      {w.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {w.status === "PENDING" && (
                      <div className="flex gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="default">
                              Approve
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Approve Withdrawal
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Approve ${w.amount} withdrawal for{" "}
                                {w.user?.firstName} {w.user?.lastName}? This
                                will process the payment.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => approveMutation.mutate(w)}
                              >
                                Approve
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              Reject
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Reject Withdrawal
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Reject ${w.amount} withdrawal for{" "}
                                {w.user?.firstName} {w.user?.lastName}?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => cancelMutation.mutate(w._id)}
                              >
                                Reject
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationControls
        currentPage={page}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    </div>
  );
}
