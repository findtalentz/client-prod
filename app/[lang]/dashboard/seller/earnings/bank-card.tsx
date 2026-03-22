"use client";
import { queryClient } from "@/app/[lang]/query-client-provider";
import { Button } from "@/components/ui/button";
import { BankPaymentMethod } from "@/schemas/PaymentMethod";
import apiClient from "@/services/api-client";
import { AxiosError } from "axios";
import { Banknote, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  method: BankPaymentMethod;
}

const BankCard = ({ method }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await apiClient.delete(`/payment-methods/bank/${method._id}`);
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      toast.success("Bank account removed.");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to remove bank account.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Banknote className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">Bank Account</p>
          <p className="text-xs text-muted-foreground">
            {method.bankName || "Stripe"} ••••{method.last4}
          </p>
        </div>
      </div>
      <Button
        onClick={handleDelete}
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        disabled={isLoading}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default BankCard;
