"use client";

import { z } from "zod";

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: "Current password must be at least 8 characters",
    }),
    newPassword: z
      .string()
      .min(8, {
        message: "New password must be at least 8 characters",
      })
      .regex(/[A-Z]/, {
        message: "Must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, {
        message: "Must contain at least one number",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "Must contain at least one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

import useDictionary from "@/hooks/useDictionary";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { handleApiError } from "@/lib/handle-api-error";
import apiClient from "@/services/api-client";
import { Lock } from "lucide-react";

export function ChangePasswordForm() {
  const dict = useDictionary();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: PasswordChangeFormValues) {
    setIsLoading(true);
    try {
      await apiClient.post("/auth/change-password", data);
      toast.success("Password changed successfully!");
      form.reset();
    } catch (error) {
      handleApiError(error, "Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          {dict.changePassword.title}
        </CardTitle>
        <CardDescription>{dict.changePassword.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>{dict.changePassword.currentPassword}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder={
                        dict.changePassword.currentPasswordPlaceholder
                      }
                      className="focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dict.changePassword.newPassword}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder={dict.changePassword.newPasswordPlaceholder}
                      className="focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {dict.changePassword.confirmNewPassword}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder={
                        dict.changePassword.confirmNewPasswordPlaceholder
                      }
                      className="focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <BeatLoader size={8} color="white" /> : dict.changePassword.button}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
