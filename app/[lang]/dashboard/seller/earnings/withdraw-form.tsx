"use client";

import { queryClient } from "@/app/[lang]/query-client-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import useSession from "@/hooks/useSession";
import usePaymentMethods from "@/hooks/usePaymentMethods";
import useBankAccountStatus from "@/hooks/useBankAccountStatus";
import ApiResponse from "@/schemas/ApiRespose";
import { PaymentMethod, isBankPaymentMethod, isPayPalPaymentMethod } from "@/schemas/PaymentMethod";
import { handleApiError } from "@/lib/handle-api-error";
import apiClient from "@/services/api-client";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { ArrowDownToLine, Banknote, Info, Wallet } from "lucide-react";
import { SiPaypal } from "react-icons/si";

interface Props {
  onSuccess?: () => void;
}

function WithdrawForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: userData } = useSession();
  const { data: paymentMethods } = usePaymentMethods();
  const { data: accountStatus } = useBankAccountStatus();

  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>("");
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState<"stripe" | "paypal" | "">("");

  const availablePaymentMethods = useMemo(() => {
    if (!paymentMethods?.data) return [];

    const methods: Array<{
      id: string;
      gateway: "stripe" | "paypal";
      method: PaymentMethod;
      displayName: string;
      displayInfo: string;
    }> = [];

    paymentMethods.data.forEach((method) => {
      if (isBankPaymentMethod(method)) {
        if (accountStatus?.data?.payoutsEnabled) {
          methods.push({
            id: method._id,
            gateway: "stripe",
            method,
            displayName: "Bank Account",
            displayInfo: `${method.bankName} ••••${method.last4}`,
          });
        }
      } else if (isPayPalPaymentMethod(method)) {
        methods.push({
          id: method._id,
          gateway: "paypal",
          method,
          displayName: "PayPal",
          displayInfo: method.email,
        });
      }
    });

    return methods;
  }, [paymentMethods, accountStatus]);

  useEffect(() => {
    if (availablePaymentMethods.length > 0 && !selectedPaymentMethodId) {
      const firstMethod = availablePaymentMethods[0];
      setSelectedPaymentMethodId(firstMethod.id);
      setSelectedPaymentGateway(firstMethod.gateway);
    }
  }, [availablePaymentMethods, selectedPaymentMethodId]);

  if (!userData) return null;

  const handleWithdraw = async () => {
    setLoading(true);
    try {
      const amount = parseFloat(withdrawAmount);

      if (isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      if (amount < 30) {
        toast.error("Minimum withdrawal amount is $30");
        return;
      }

      if (amount > userData.data.balance) {
        toast.error("Insufficient balance");
        return;
      }

      if (!selectedPaymentMethodId || !selectedPaymentGateway) {
        toast.error("Please select a payment method");
        return;
      }

      const { data } = await apiClient.post<ApiResponse<string>>("/withdraws", {
        amount,
        paymentMethodId: selectedPaymentMethodId,
        paymentGateway: selectedPaymentGateway,
      });

      toast.success(data.message);
      setWithdrawAmount("");
      setSelectedPaymentMethodId("");
      setSelectedPaymentGateway("");

      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["my_withdraws"] });
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      queryClient.invalidateQueries({ queryKey: ["pending_earning"] });
      queryClient.invalidateQueries({ queryKey: ["total_earning"] });
      queryClient.invalidateQueries({ queryKey: ["balances"] });

      if (onSuccess) onSuccess();
      router.refresh();
    } catch (error) {
      handleApiError(error, "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodChange = (value: string) => {
    const method = availablePaymentMethods.find((m) => m.id === value);
    if (method) {
      setSelectedPaymentMethodId(method.id);
      setSelectedPaymentGateway(method.gateway);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setWithdrawAmount(value);
    }
  };

  const balance = userData.data.balance;
  const amount = parseFloat(withdrawAmount);
  const isValidAmount = !isNaN(amount) && amount > 0;
  const exceedsBalance = isValidAmount && amount > balance;
  const belowMin = isValidAmount && amount < 30;
  const canSubmit =
    isValidAmount &&
    !exceedsBalance &&
    !belowMin &&
    !!selectedPaymentMethodId &&
    availablePaymentMethods.length > 0;

  const quickAmounts = [
    { label: "25%", value: balance * 0.25 },
    { label: "50%", value: balance * 0.5 },
    { label: "75%", value: balance * 0.75 },
    { label: "Max", value: balance },
  ];

  return (
    <div className="flex flex-col gap-5 overflow-hidden">
      {/* Balance Display */}
      <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Available Balance</span>
        </div>
        <span className="text-lg font-bold text-emerald-600">${balance.toFixed(2)}</span>
      </div>

      <Separator />

      {/* Payment Method */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Withdraw to</label>
        {availablePaymentMethods.length === 0 ? (
          <div className="rounded-lg border border-dashed p-4 text-center">
            <p className="text-sm text-muted-foreground">
              No payment methods available. Add one first.
            </p>
          </div>
        ) : (
          <Select
            value={selectedPaymentMethodId}
            onValueChange={handlePaymentMethodChange}
            disabled={loading}
          >
            <SelectTrigger className="w-full h-10 [&>span]:truncate">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent className="w-[var(--radix-select-trigger-width)]">
              {availablePaymentMethods.map((method) => {
                const info = method.displayInfo;
                const shortInfo =
                  method.gateway === "paypal" && info.length > 20
                    ? info.slice(0, 18) + "..."
                    : info;

                return (
                  <SelectItem key={method.id} value={method.id}>
                    <div className="flex items-center gap-2">
                      {method.gateway === "stripe" ? (
                        <Banknote className="h-4 w-4 text-muted-foreground shrink-0" />
                      ) : (
                        <SiPaypal className="h-4 w-4 text-blue-500 shrink-0" />
                      )}
                      <span className="font-medium">{method.displayName}</span>
                      <span className="text-muted-foreground text-xs">
                        {shortInfo}
                      </span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Amount</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground text-sm pointer-events-none">
            $
          </span>
          <Input
            value={withdrawAmount}
            onChange={handleAmountChange}
            placeholder="0.00"
            type="text"
            inputMode="decimal"
            className="pl-7 h-11 text-lg font-semibold"
            disabled={loading}
          />
        </div>

        {/* Quick Amounts */}
        <div className="grid grid-cols-4 gap-2">
          {quickAmounts.map((q) => (
            <button
              key={q.label}
              type="button"
              onClick={() => setWithdrawAmount(q.value.toFixed(2))}
              disabled={loading}
              className="rounded-md border px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Validation */}
        {exceedsBalance && (
          <p className="text-xs text-destructive flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 shrink-0" />
            Amount exceeds your available balance
          </p>
        )}
        {belowMin && (
          <p className="text-xs text-destructive flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 shrink-0" />
            Minimum withdrawal amount is $30
          </p>
        )}
        {canSubmit && (
          <div className="flex items-center justify-between text-sm pt-1">
            <span className="text-muted-foreground">You will receive</span>
            <span className="font-semibold">${amount.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2.5">
        <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Withdrawals are typically processed within 2–3 business days. You&apos;ll receive a confirmation email once completed.
        </p>
      </div>

      {/* Submit */}
      <Button
        onClick={handleWithdraw}
        disabled={loading || !canSubmit}
        className="w-full h-11"
        size="lg"
      >
        {loading ? (
          <BeatLoader color="#fff" size={8} />
        ) : (
          <span className="flex items-center gap-2">
            <ArrowDownToLine className="h-4 w-4" />
            Request Withdrawal
          </span>
        )}
      </Button>
    </div>
  );
}

export default WithdrawForm;
