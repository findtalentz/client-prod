"use client";

import { queryClient } from "@/app/[lang]/query-client-provider";
import { Badge } from "@/components/ui/badge";
import EarningsSkeleton from "@/components/skeletons/earnings-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDownToLine,
  Banknote,
  Clock,
  DollarSign,
  TrendingUp,
  Wallet,
} from "lucide-react";

import useMyWithdraws from "@/hooks/useMyWithdraws";
import usePendingEarnings from "@/hooks/usePendingEarnings";
import useSession from "@/hooks/useSession";
import useTotalEarnings from "@/hooks/useTotalEarning";

import useBalances from "@/hooks/useBalances";
import useBankAccountStatus from "@/hooks/useBankAccountStatus";
import useDictionary from "@/hooks/useDictionary";
import usePaymentMethods from "@/hooks/usePaymentMethods";
import apiClient from "@/services/api-client";
import { formatDate } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { SiPaypal } from "react-icons/si";
import { AddPaymentMethodDialog } from "./add-payment-method-dialog";
import BalanceTable from "./balance-table";
import BankCard from "./bank-card";
import PaypalCard from "./paypal-card";
import WithdrawFund from "./withdraw-fund";

export default function EarningsPage() {
  const dict = useDictionary();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: userData, isLoading, error } = useSession();
  const { data: withdrawals } = useMyWithdraws();
  const { data: totalEarnings } = useTotalEarnings();
  const { data: pendingEarnings } = usePendingEarnings();
  const { data: balances } = useBalances();
  useBankAccountStatus();
  const { data: paymentMethods } = usePaymentMethods();
  const paypalCallbackHandled = useRef(false);

  // Handle PayPal OAuth callback
  useEffect(() => {
    const paypalConnect = searchParams.get("paypal_connect");
    const code = searchParams.get("code");

    if (paypalConnect === "callback" && code && !paypalCallbackHandled.current) {
      paypalCallbackHandled.current = true;

      apiClient
        .post("/payment-methods/connect-paypal/callback", { code })
        .then((res) => {
          toast.success(res.data.message || "PayPal account connected successfully!");
          queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
        })
        .catch((err) => {
          const message = err?.response?.data?.message || "Failed to connect PayPal account.";
          toast.error(message);
        })
        .finally(() => {
          router.replace(window.location.pathname);
        });
    }
  }, [searchParams, router]);

  if (isLoading) return <EarningsSkeleton />;

  if (error)
    return (
      <div className="py-8 text-destructive">
        {dict.earnings.failedToLoad}
      </div>
    );

  if (!userData) return null;

  const balance = userData.data.balance;
  const pending = pendingEarnings?.data ?? 0;
  const lifetime = totalEarnings?.data ?? 0;
  const hasPaymentMethods = paymentMethods?.data && paymentMethods.data.length > 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {dict.earnings.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {dict.earnings.description}
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats + Payment Methods */}
        <div className="space-y-6">
          {/* Available Balance */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {dict.earnings.availableBalance}
                  </p>
                  <p className="text-2xl font-bold mt-1">${balance.toFixed(2)}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              {hasPaymentMethods && balance > 0 && (
                <div className="mt-4">
                  <WithdrawFund />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending + Lifetime in a row */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-5 pb-5">
                <p className="text-xs text-muted-foreground">
                  {dict.earnings.pendingClearance}
                </p>
                <p className="text-xl font-bold mt-1">${pending.toFixed(2)}</p>
                <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mt-3">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-5 pb-5">
                <p className="text-xs text-muted-foreground">
                  {dict.earnings.lifetimeEarnings}
                </p>
                <p className="text-xl font-bold mt-1">${lifetime.toFixed(2)}</p>
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mt-3">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">
                  {dict.earnings.paymentMethods}
                </CardTitle>
                <AddPaymentMethodDialog hideIfExists />
              </div>
            </CardHeader>
            <CardContent>
              {hasPaymentMethods ? (
                <div className="space-y-3">
                  {paymentMethods!.data.map((method) => {
                    if (method.methodType === "bank") {
                      return <BankCard key={method._id} method={method} />;
                    } else if (method.methodType === "paypal") {
                      return <PaypalCard key={method._id} method={method} />;
                    }
                    return null;
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-2">
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">{dict.earnings.noPaymentMethods}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {dict.earnings.addPaymentMethodToWithdraw}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - History (takes 2/3 width) */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="withdrawals" className="w-full">
            <TabsList>
              <TabsTrigger value="withdrawals" className="gap-1.5">
                <ArrowDownToLine className="h-4 w-4" />
                Withdrawals
              </TabsTrigger>
              <TabsTrigger value="earnings" className="gap-1.5">
                <DollarSign className="h-4 w-4" />
                Earnings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="withdrawals">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{dict.earnings.date}</TableHead>
                        <TableHead>{dict.earnings.amount}</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>{dict.earnings.status}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {withdrawals?.data?.length ? (
                        withdrawals.data.map((withdrawal) => (
                          <TableRow key={withdrawal._id}>
                            <TableCell className="text-sm">
                              {formatDate(withdrawal.createdAt)}
                            </TableCell>
                            <TableCell className="font-medium">
                              ${withdrawal.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                {withdrawal.paymentGateway === "stripe" ? (
                                  <Banknote className="h-3.5 w-3.5 text-muted-foreground" />
                                ) : (
                                  <SiPaypal className="h-3.5 w-3.5 text-blue-500" />
                                )}
                                <span className="text-sm">
                                  {withdrawal.paymentGateway === "stripe" ? "Bank" : "PayPal"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  withdrawal.status === "COMPLETED"
                                    ? "default"
                                    : withdrawal.status === "PENDING"
                                    ? "secondary"
                                    : "destructive"
                                }
                                className="text-xs"
                              >
                                {withdrawal.status.toLowerCase()}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4}>
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                              <ArrowDownToLine className="h-8 w-8 text-muted-foreground/50 mb-2" />
                              <p className="text-sm font-medium">
                                {dict.earnings.noWithdrawalsYet}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {dict.earnings.withdrawalHistoryWillAppear}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="earnings">
              {balances ? (
                <BalanceTable balances={balances.data} />
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">No earnings data available</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
