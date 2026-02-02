"use client";
import { queryClient } from "@/app/[lang]/query-client-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BankPaymentMethod } from "@/schemas/PaymentMethod";
import apiClient from "@/services/api-client";
import { AxiosError } from "axios";
import { Banknote, Trash } from "lucide-react";
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
      toast.success("Bank account removed successfully.");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to delete bank account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card key={method._id} className="border relative">
      <Button
        onClick={handleDelete}
        size="icon"
        className="absolute top-2 right-2"
        variant="destructive"
        disabled={isLoading}
      >
        <Trash />
      </Button>
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Banknote className="h-5 w-5 text-primary" />
          </div>

          <span className="font-medium">Bank Account</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bank</span>
            <span>{method.bankName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account</span>
            <span>••••{method.accountNumber?.slice(-4)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankCard;
