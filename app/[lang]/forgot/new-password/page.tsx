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
import { handleApiError } from "@/lib/handle-api-error";
import ApiResponse from "@/schemas/ApiRespose";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BeatLoader } from "react-spinners";

const FormSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(64, "Password must not exceed 64 characters"),
    retypePassword: z.string().min(1, "Please retype your password"),
  })
  .refine((data) => data.password === data.retypePassword, {
    message: "Passwords don't match",
    path: ["retypePassword"],
  });

function NewPassword() {
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      retypePassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      const { data } = await apiClient.post<ApiResponse<string>>(
        "/auth/new-password",
        {
          code: localStorage.getItem("vCode"),
          email: localStorage.getItem("vEmail"),
          newPassword: values.password,
        }
      );
      form.reset();
      toast.success(data.message);
      setLoading(false);
      localStorage.removeItem("vCode");
      localStorage.removeItem("vEmail");
      window.location.href = "/log-in";
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex items-start justify-between flex-col py-10 md:max-w-[500px] mx-auto h-[calc(100dvh-65px)] px-3">
      <div className="w-full text-2xl text-primary-dark">
        <Link href="/log-in/forgot/verify-email">
          <FaArrowLeftLong />
        </Link>
      </div>
      <div className="w-full space-y-6">
        <div className="w-full">
          <h2 className="text-primary">Create New Password</h2>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="********"
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="retypePassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="********"
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">
              {isLoading ? <BeatLoader /> : "Reset Password"}
            </Button>
          </form>
        </Form>
      </div>
      <div />
    </div>
  );
}

export default NewPassword;
