"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import apiClient from "@/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { handleApiError } from "@/lib/handle-api-error";
import ApiResponse from "@/schemas/ApiRespose";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BeatLoader } from "react-spinners";

const FormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

function ForgotPassword() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      const { data } = await apiClient.post<ApiResponse<string>>(
        "/auth/check-email",
        values
      );
      form.reset();
      setLoading(false);
      localStorage.setItem("vEmail", data.data);
      router.push("/forgot/check-email");
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-start justify-between flex-col py-10 md:max-w-[500px] mx-auto h-[calc(100dvh-65px)] px-3">
      <div className="w-full text-2xl text-primary-dark">
        <Link href="/log-in">
          <FaArrowLeftLong />
        </Link>
      </div>
      <div className="w-full space-y-6">
        <div className="w-full">
          <h2 className="text-primary">Forget Password?</h2>
          <p>Enter your Registered Email to reset your Password.</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email Address"
                      type="email"
                      {...field}
                    />
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
      </div>
      <div className="text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/log-in" className="text-primary underline">
          Log in here
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
