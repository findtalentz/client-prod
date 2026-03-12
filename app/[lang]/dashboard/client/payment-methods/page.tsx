"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, History, Wallet } from "lucide-react";

import useDictionary from "@/hooks/useDictionary";
import useMyTransactions from "@/hooks/useMyTransactions";
import usePaymentMethods from "@/hooks/usePaymentMethods";
import useSession from "@/hooks/useSession";
import { formatDate } from "@/lib/utils";
import { AddPaymentMethodDialog } from "../../seller/earnings/add-payment-method-dialog";
import BankCard from "../../seller/earnings/bank-card";
import PaypalCard from "../../seller/earnings/paypal-card";

export default function PaymentMethodsPage() {
  const dict = useDictionary();
  const { data: userData, isLoading } = useSession();
  const { data: paymentMethods } = usePaymentMethods();
  const { data: transactions } = useMyTransactions();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-muted rounded" />
            <div className="h-48 bg-muted rounded" />
          </div>
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{dict.paymentMethods.title}</h1>
        <p className="text-muted-foreground">
          {dict.paymentMethods.description}
        </p>
      </header>

      {/* Balance Card */}
      <section>
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {dict.paymentMethods.accountBalance}
            </CardTitle>
            <Wallet className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${userData.data.balance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {dict.paymentMethods.availableForHiring}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Payment Methods Section */}
      <section>
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{dict.paymentMethods.savedPaymentMethods}</CardTitle>
              <AddPaymentMethodDialog hideIfExists />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {paymentMethods &&
            paymentMethods.data &&
            paymentMethods.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <CreditCard className="w-10 h-10 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">{dict.paymentMethods.noPaymentMethods}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {dict.paymentMethods.addPaymentMethodToStart}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Transaction History */}
      <section>
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-lg">{dict.paymentMethods.transactionHistory}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{dict.paymentMethods.date}</TableHead>
                  <TableHead>{dict.paymentMethods.type}</TableHead>
                  <TableHead>{dict.paymentMethods.amount}</TableHead>
                  <TableHead>{dict.paymentMethods.gateway}</TableHead>
                  <TableHead>{dict.paymentMethods.status}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.data?.length ? (
                  transactions.data.map((tx) => (
                    <TableRow key={tx._id} className="hover:bg-muted/50">
                      <TableCell>{formatDate(tx.createdAt)}</TableCell>
                      <TableCell className="capitalize">{tx.type}</TableCell>
                      <TableCell>${tx.amount.toFixed(2)}</TableCell>
                      <TableCell className="capitalize">
                        {tx.paymentGateway || dict.paymentMethods.na}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tx.status === "completed"
                              ? "default"
                              : tx.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                          className="capitalize"
                        >
                          {tx.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div className="flex flex-col items-center justify-center py-12">
                        <History className="w-10 h-10 text-muted-foreground mb-3" />
                        <h3 className="text-lg font-medium">
                          {dict.paymentMethods.noTransactionsYet}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {dict.paymentMethods.transactionHistoryWillAppear}
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
