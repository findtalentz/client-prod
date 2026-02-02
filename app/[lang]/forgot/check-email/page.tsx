"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import apiClient from "@/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaArrowLeftLong } from "react-icons/fa6";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ApiResponse from "@/schemas/ApiRespose";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

const FormSchema = z.object({
  code: z.string().min(1, "Email is required").max(6),
});

function VerifyEmail() {
  const [isLoading, setLoading] = useState(false);
  const [isResending, setResending] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    setEmail(localStorage.getItem("vEmail") || "");
  }, []);

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      const { data } = await apiClient.post<ApiResponse<number>>(
        "/auth/verify-code",
        {
          code: values.code,
          email: localStorage.getItem("vEmail"),
        }
      );
      form.reset();
      setLoading(false);
      localStorage.setItem("vCode", data.data.toString());
      router.push("/forgot/new-password");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-start justify-between flex-col py-10 md:max-w-[500px] mx-auto h-[calc(100dvh-65px)] px-3">
      <div className="w-full text-2xl text-primary-dark">
        <Link href="/log-in/forgot">
          <FaArrowLeftLong />
        </Link>
      </div>
      <div className="w-full space-y-6">
        <div className="w-full">
          <h2 className="text-primary">Verify Email</h2>
          <p>
            Please enter the 6 digit code sent to your email{" "}
            <span className="font-semibold">{email}</span>
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code:</FormLabel>
                  <FormControl>
                    <Input placeholder="000 000" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">
              {isLoading ? <BeatLoader /> : "Continue"}
            </Button>
          </form>
        </Form>
        <p className="text-center text-sm text-gray-600">
          Didn&apos;t receive the code{" "}
          <button
            disabled={isResending}
            onClick={async () => {
              setResending(true);
              try {
                await apiClient.post<ApiResponse<string>>("/auth/check-email", {
                  email: localStorage.getItem("vEmail"),
                });
                toast.success("Resend code");
                setResending(false);
              } catch (error) {
                if (error instanceof AxiosError && error.response) {
                  return toast.error(error.response.data.message);
                }
              } finally {
                setResending(false);
              }
            }}
            className="text-primary underline border-none outline-none cursor-pointer"
          >
            Resend
          </button>
        </p>
      </div>
      <div />
    </div>
  );
}

export default VerifyEmail;
