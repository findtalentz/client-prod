"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Banknote, Check, Plus } from "lucide-react";
import { useState } from "react";
import { SiPaypal } from "react-icons/si";
import usePaymentMethods from "@/hooks/usePaymentMethods";
import ConnectBankButton from "./connect-bank-button";
import ConnectPaypalButton from "./connect-paypal-button";

interface AddPaymentMethodDialogProps {
  hideIfExists?: boolean;
}

export function AddPaymentMethodDialog({
  hideIfExists = false,
}: AddPaymentMethodDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: paymentMethods } = usePaymentMethods();

  const hasBankAccount = paymentMethods?.data?.some((m) => m.methodType === "bank") ?? false;
  const hasPaypal = paymentMethods?.data?.some((m) => m.methodType === "paypal") ?? false;

  // Hide if both methods exist
  if (hideIfExists && hasBankAccount && hasPaypal) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add Method
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          {/* Bank Account Option */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Banknote className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Bank Account</p>
                <p className="text-xs text-muted-foreground">Via Stripe Connect</p>
              </div>
            </div>
            {hasBankAccount ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <Check className="h-4 w-4" />
                Connected
              </div>
            ) : (
              <ConnectBankButton />
            )}
          </div>

          {/* PayPal Option */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                <SiPaypal className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">PayPal</p>
                <p className="text-xs text-muted-foreground">Via PayPal Connect</p>
              </div>
            </div>
            {hasPaypal ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <Check className="h-4 w-4" />
                Connected
              </div>
            ) : (
              <ConnectPaypalButton />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
