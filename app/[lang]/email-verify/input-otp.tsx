"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import useSession from "@/hooks/useSession";
import ApiResponse from "@/schemas/ApiRespose";
import { handleApiError } from "@/lib/handle-api-error";
import apiClient from "@/services/api-client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { queryClient } from "../query-client-provider";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export function InputOTPForm() {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const resendCode = async () => {
    setLoading(true);
    if (!session) return;
    try {
      const { data } = await apiClient.post<ApiResponse<string>>(
        "/auth/resend"
      );
      toast.success(data.message);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await apiClient.post<ApiResponse<string>>(
        "/auth/verify-email",
        {
          code: parseInt(data.pin),
        }
      );

      toast.success("Email Verification Completed");
      Cookies.set("token", res.data.data, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
      form.reset();
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.refresh();
      window.location.href = "/refer";
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-6 bg-linear-to-br from-blue-50 to-purple-50 rounded-xl shadow-sm">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Enter Verification Code
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We&apos;ve sent a 6-digit verification code to your email:
            <span className="text-primary font-semibold">
              {session.data.email}
            </span>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel className="text-sm font-medium text-gray-700 mb-2">
                    Enter Your Verification Code
                  </FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="gap-2">
                        {[...Array(6)].map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="w-12 h-12 text-lg border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="text-xs mt-2" />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-40"
                disabled={form.formState.isSubmitting || isLoading}
              >
                {form.formState.isSubmitting || isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>
            </div>
          </form>
        </Form>

        <div className="text-center text-sm text-gray-500">
          Didn&apos;t receive a code?{" "}
          <button
            type="button"
            className="font-medium text-blue-600 hover:text-blue-500"
            onClick={resendCode}
            disabled={isLoading}
          >
            {isLoading ? "Sending ocde" : "Resend"}
          </button>
        </div>
      </div>
    </div>
  );
}
