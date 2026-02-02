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

// Schema definitions
const baseSchema = z.object({
  methodType: z.enum(["bank", "paypal"]),
});

const bankAccountSchema = baseSchema.extend({
  methodType: z.literal("bank"),
  accountHolderName: z.string().min(2, "Name must be at least 2 characters"),
  accountNumber: z.string().min(5, "Account number must be at least 5 digits"),
  bankName: z.string().min(2, "Bank name must be at least 2 characters"),
  routingNumber: z.string().min(5, "Routing number must be at least 5 digits"),
  accountType: z.enum(["checking", "savings"]).default("checking"),
});

const paypalSchema = baseSchema.extend({
  methodType: z.literal("paypal"),
  email: z.string().email("Please enter a valid email address"),
});

const formSchema = z.discriminatedUnion("methodType", [
  bankAccountSchema,
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
      accountHolderName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: "checking",
    },
  });

  const selectedMethod = form.watch("methodType");

  // Hide the dialog if payment methods exist and hideIfExists is true
  if (hideIfExists && paymentMethods && paymentMethods.data?.length >= 2) {
    return null;
  }

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const endpoint =
        values.methodType === "bank"
          ? "/payment-methods/bank-accounts"
          : "/payment-methods/paypal-accounts";

      const body =
        values.methodType === "bank"
          ? {
              accountHolderName: values.accountHolderName,
              accountNumber: values.accountNumber,
              bankName: values.bankName,
              routingNumber: values.routingNumber,
              accountType: values.accountType,
              methodType: "bank",
            }
          : {
              email: values.email,
              methodType: "paypal",
            };

      await apiClient.post(endpoint, body);
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
              <>
                <FormField
                  control={form.control}
                  name="accountHolderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Holder Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123456789"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Example Bank"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="routingNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Routing Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123456789"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="checking">Checking</SelectItem>
                          <SelectItem value="savings">Savings</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
