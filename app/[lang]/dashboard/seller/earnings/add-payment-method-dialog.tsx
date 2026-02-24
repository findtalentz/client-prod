"use client";

import { queryClient } from "@/app/[lang]/query-client-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import apiClient from "@/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import * as z from "zod";
import usePaymentMethods from "@/hooks/usePaymentMethods";
import ConnectBankButton from "./connect-bank-button";

// Schema definitions
const baseSchema = z.object({
  methodType: z.enum(["bank", "paypal"]),
});

const paypalSchema = baseSchema.extend({
  methodType: z.literal("paypal"),
  email: z.string().email("Please enter a valid email address"),
});

const bankStubSchema = baseSchema.extend({
  methodType: z.literal("bank"),
});

const formSchema = z.discriminatedUnion("methodType", [
  bankStubSchema,
  paypalSchema,
]);

type FormValues = z.infer<typeof formSchema>;

interface AddPaymentMethodDialogProps {
  onSuccess?: () => void;
  hideIfExists?: boolean;
}

export function AddPaymentMethodDialog({
  onSuccess,
  hideIfExists = false,
}: AddPaymentMethodDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: paymentMethods } = usePaymentMethods();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      methodType: "bank",
    },
  });

  const selectedMethod = form.watch("methodType");

  // Hide the dialog if payment methods exist and hideIfExists is true
  if (hideIfExists && paymentMethods && paymentMethods.data?.length >= 2) {
    return null;
  }

  const onSubmit = async (values: FormValues) => {
    if (values.methodType === "bank") return;

    setIsSubmitting(true);
    try {
      await apiClient.post("/payment-methods/paypal-accounts", {
        email: values.email,
        methodType: "paypal",
      });
      toast.success("Payment method added successfully");
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });

      setOpen(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      let errorMessage = "Failed to add payment method";

      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-transparent text-primary border-primary hover:bg-primary/10"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Payment Method
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="methodType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bank">Bank Account</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedMethod === "bank" ? (
              <div className="py-4">
                <ConnectBankButton />
              </div>
            ) : (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PayPal Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@paypal.com"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {selectedMethod !== "bank" && (
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <BeatLoader size={8} color="#ffffff" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
