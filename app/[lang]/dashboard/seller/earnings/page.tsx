"use client";

import { Badge } from "@/components/ui/badge";
import EarningsSkeleton from "@/components/skeletons/earnings-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, History, Wallet } from "lucide-react";

import useMyWithdraws from "@/hooks/useMyWithdraws";
import usePendingEarnings from "@/hooks/usePendingEarnings";
import useSession from "@/hooks/useSession";
import useTotalEarnings from "@/hooks/useTotalEarning";

import useBalances from "@/hooks/useBalances";
import useBankAccountStatus from "@/hooks/useBankAccountStatus";
import usePaymentMethods from "@/hooks/usePaymentMethods";
import { formatDate } from "@/lib/utils";
import { AddPaymentMethodDialog } from "./add-payment-method-dialog";
import BalanceTable from "./balance-table";
import BankCard from "./bank-card";
import ConnectBankButton from "./connect-bank-button";
import PaypalCard from "./paypal-card";
import WithdrawForm from "./withdraw-form";
import WithdrawFund from "./withdraw-fund";

export default function EarningsPage() {
  const { data: userData, isLoading, error } = useSession();
  const { data: withdrawals } = useMyWithdraws();
  const { data: totalEarnings } = useTotalEarnings();
  const { data: pendingEarnings } = usePendingEarnings();
  const { data: balances } = useBalances();
  const { data: accountStatus } = useBankAccountStatus();
  const { data: paymentMethods } = usePaymentMethods();

  if (isLoading) return <EarningsSkeleton />;

  if (error)
    return (
      <div className="container mx-auto py-8 text-destructive">
        Failed to load earnings data.
      </div>
    );

  if (!userData) return null;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Earnings Dashboard
        </h1>
        <p className="text-muted-foreground">
          View your earnings, payment methods, and withdrawal history
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Balance
            </CardTitle>
            <Wallet className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">
              ${userData.data.balance.toFixed(2)}
            </div>
            {accountStatus && accountStatus.data.payoutsEnabled ? (
              <WithdrawFund />
            ) : (
              <ConnectBankButton />
            )}
          </CardContent>
        </Card>

        {/* Pending Earnings */}
        <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Clearance
            </CardTitle>
            <History className="w-5 h-5 text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${pendingEarnings?.data?.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {pendingEarnings?.data
                ? "Will be available soon"
                : "No pending earnings"}
            </p>
          </CardContent>
        </Card>

        {/* Lifetime Earnings */}
        <Card className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lifetime Earnings
            </CardTitle>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${totalEarnings?.data?.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              All-time total earnings
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Withdraw & Payment Methods */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Withdraw Section */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Withdraw Funds</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <WithdrawForm />
          </CardContent>
        </Card>

        {/* Payment Methods Section */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Payment Methods</CardTitle>
              <AddPaymentMethodDialog hideIfExists />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {paymentMethods && paymentMethods.data && paymentMethods.data.length > 0 ? (
              <div className="space-y-4">
                {paymentMethods.data.map((method) => {
                  if (method.methodType === "bank") {
                    return <BankCard key={method._id} method={method} />;
                  } else if (method.methodType === "paypal") {
                    return <PaypalCard key={method._id} method={method} />;
                  }
                  return null;
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Wallet className="w-10 h-10 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No payment methods</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Add a payment method to withdraw your earnings
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section>{balances && <BalanceTable balances={balances.data} />}</section>

      {/* Withdrawal History */}
      <section>
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Withdrawal History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals?.data?.length ? (
                  withdrawals.data.map((withdrawal) => (
                    <TableRow
                      key={withdrawal._id}
                      className="hover:bg-muted/50"
                    >
                      <TableCell>{formatDate(withdrawal.createdAt)}</TableCell>
                      <TableCell>${withdrawal.amount.toFixed(2)}</TableCell>
                      <TableCell className="pr-6">
                        <Badge
                          variant={
                            withdrawal.status === "COMPLETED"
                              ? "default"
                              : withdrawal.status === "PENDING"
                              ? "secondary"
                              : "destructive"
                          }
                          className="capitalize"
                        >
                          {withdrawal.status.toLowerCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div className="flex flex-col items-center justify-center">
                        <History className="w-10 h-10 text-muted-foreground mb-3" />
                        <h3 className="text-lg font-medium">
                          No withdrawals yet
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Your withdrawal history will appear here
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
