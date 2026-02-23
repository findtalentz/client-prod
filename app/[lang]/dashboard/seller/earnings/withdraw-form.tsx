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
import { FaWallet, FaInfoCircle } from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import { Banknote } from "lucide-react";
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
  const [focused, setFocused] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>("");
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState<"stripe" | "paypal" | "">("");

  // Filter available payment methods
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
        // Only show Stripe bank accounts if Stripe is connected
        if (accountStatus?.data?.payoutsEnabled) {
          methods.push({
            id: method._id,
            gateway: "stripe",
            method,
            displayName: "Bank Account (Stripe)",
            displayInfo: `${method.bankName} ••••${method.accountNumber?.slice(-4)}`,
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

  // Auto-select first payment method if available
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

      if (onSuccess) {
        onSuccess();
      }

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

  // Quick amount options (25%, 50%, 75%, 100% of balance)
  const quickAmounts = [
    { label: "25%", value: balance * 0.25 },
    { label: "50%", value: balance * 0.5 },
    { label: "75%", value: balance * 0.75 },
    { label: "100%", value: balance },
  ];

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mx-auto">
          <FaWallet className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Withdraw Funds</h2>
        <p className="text-sm text-gray-600">
          Transfer money from your wallet to your bank account
        </p>
      </div>

      {/* Balance Display */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Available Balance
          </span>
          <span className="text-lg font-bold text-green-600">
            ${balance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">
          Payment Method *
        </label>
        {availablePaymentMethods.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              No payment methods available. Please add a payment method first.
            </p>
          </div>
        ) : (
          <Select
            value={selectedPaymentMethodId}
            onValueChange={handlePaymentMethodChange}
            disabled={loading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              {availablePaymentMethods.map((method) => (
                <SelectItem key={method.id} value={method.id}>
                  <div className="flex items-center gap-2">
                    {method.gateway === "stripe" ? (
                      <Banknote className="h-4 w-4 text-primary" />
                    ) : (
                      <SiPaypal className="h-4 w-4 text-blue-500" />
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium">{method.displayName}</span>
                      <span className="text-xs text-muted-foreground">
                        {method.displayInfo}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Quick Amount Buttons */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">
          Quick Select
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {quickAmounts.map((quick) => (
            <button
              key={quick.label}
              type="button"
              onClick={() => setWithdrawAmount(quick.value.toFixed(2))}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors duration-200"
            >
              {quick.label}
            </button>
          ))}
        </div>
      </div>

      {/* Amount Input */}
      <div className="space-y-3">
        <label
          htmlFor="withdraw-amount"
          className="text-sm font-medium text-gray-700"
        >
          Withdrawal Amount
        </label>
        <div
          className={`relative rounded-lg transition-all duration-200 ${
            focused ? "ring-2 ring-blue-500 ring-opacity-50" : ""
          }`}
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <Input
            id="withdraw-amount"
            value={withdrawAmount}
            onChange={handleAmountChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="0.00"
            type="text"
            inputMode="decimal"
            className="pl-7 pr-4 py-3 text-lg font-medium"
            disabled={loading}
          />
        </div>

        {/* Validation Messages */}
        {exceedsBalance && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <FaInfoCircle className="h-4 w-4" />
            <span>Amount exceeds available balance</span>
          </div>
        )}

        {isValidAmount && !exceedsBalance && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">You will receive:</span>
            <span className="font-semibold text-green-600">
              ${amount.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FaInfoCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Withdrawal Processing</p>
            <p className="mt-1">
              Withdrawals are typically processed within 2-3 business days. You
              will receive a confirmation email once completed.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleWithdraw}
        disabled={
          loading ||
          !isValidAmount ||
          exceedsBalance ||
          !selectedPaymentMethodId ||
          availablePaymentMethods.length === 0
        }
        className="w-full py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        size="lg"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <BeatLoader color="#fff" size={8} />
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <FaWallet className="h-5 w-5" />
            <span>Request Withdrawal</span>
          </div>
        )}
      </Button>
    </div>
  );
}

export default WithdrawForm;
