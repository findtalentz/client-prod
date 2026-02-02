"use client";

import { useState } from "react";
import { queryClient } from "@/app/[lang]/query-client-provider";
import apiClient from "@/services/api-client";
import { PayPalPaymentMethod } from "@/schemas/PaymentMethod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trash } from "lucide-react";
import { SiPaypal } from "react-icons/si";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

interface PaypalCardProps {
  method: PayPalPaymentMethod;
}

const PaypalCard = ({ method }: PaypalCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await apiClient.delete(`/payment-methods/paypal/${method._id}`);
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      toast.success("PayPal method removed successfully.");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to delete PayPal method. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="relative border">
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
          <div className="p-2 rounded-lg bg-blue-500/10">
            <SiPaypal className="w-5 h-5 text-blue-500" />
          </div>
          <span className="font-medium">PayPal</span>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Email</span>
          <span>{method.email}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaypalCard;
