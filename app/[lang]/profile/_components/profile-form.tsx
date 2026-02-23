"use client";

import { queryClient } from "@/app/[lang]/query-client-provider";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useSession from "@/hooks/useSession";
import apiClient from "@/services/api-client";
import { joiResolver } from "@hookform/resolvers/joi";
import { Flex, Grid } from "@radix-ui/themes";
import MDEditor from "@uiw/react-md-editor";
import Joi from "joi";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { handleApiError } from "@/lib/handle-api-error";
import rehypeSanitize from "rehype-sanitize";

// Joi validation schema
const FormSchema = Joi.object({
  firstName: Joi.string().min(1).max(255).required().messages({
    "any.required": "First name is required.",
    "string.empty": "First name cannot be empty.",
    "string.min": "First name must contain at least 1 character.",
    "string.max": "First name must be less than 255 characters.",
  }),

  lastName: Joi.string().min(1).max(255).required().messages({
    "any.required": "Last name is required.",
    "string.empty": "Last name cannot be empty.",
    "string.min": "Last name must contain at least 1 character.",
    "string.max": "Last name must be less than 255 characters.",
  }),

  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]*$/)
    .min(5)
    .max(20)
    .required()
    .messages({
      "any.required": "Phone number is required.",
      "string.empty": "Phone number cannot be empty.",
      "string.pattern.base": "Phone number format is invalid.",
      "string.min": "Phone number must be at least 5 digits.",
      "string.max": "Phone number must be less than 20 digits.",
    }),

  title: Joi.string().min(2).max(255).required().messages({
    "any.required": "Title is required.",
    "string.empty": "Title cannot be empty.",
    "string.min": "Title must be at least 2 characters.",
    "string.max": "Title must be less than 255 characters.",
  }),

  location: Joi.string().min(2).max(255).required().messages({
    "any.required": "Location is required.",
    "string.empty": "Location cannot be empty.",
    "string.min": "Location must be at least 2 characters.",
    "string.max": "Location must be less than 255 characters.",
  }),

  about: Joi.string().min(100).max(10000).required().messages({
    "any.required": "About section is required.",
    "string.empty": "About section cannot be empty.",
    "string.min": "About section must be at least 100 characters long.",
    "string.max": "About section must be less than 10,000 characters.",
  }),
});

interface FromData {
  firstName: string;
  lastName: string;
  about: string;
  phone: string;
  title: string;
  location: string;
}

export default function ProfileForm() {
  const { data: user, isLoading, error } = useSession();
  const router = useRouter();

  const form = useForm<FromData>({
    resolver: joiResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      title: "",
      location: "",
      about: "",
    },
  });

  // Reset form when user data loads
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.data.firstName || "",
        lastName: user.data.lastName || "",
        phone: user.data.phone || "",
        title: user.data.title || "",
        location: user.data.location || "",
        about: user.data.about || "",
      });
    }
  }, [user, form]);

  async function onSubmit(data: FromData) {
    try {
      await apiClient.put(`/users/${user?.data._id}`, data);
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["me"] });
      router.refresh();
    } catch (error) {
      handleApiError(error);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded border border-red-200 bg-red-50">
        Error loading profile data: {error.message}
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <Grid columns={{ initial: "1fr", md: "2" }} gap="4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="First Name"
                    {...field}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Last Name"
                    {...field}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Grid>

        <Grid columns={{ initial: "1fr", md: "2" }} gap="4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Phone"
                    type="tel"
                    {...field}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your location"
                    {...field}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Grid>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your professional title"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <div
                  data-color-mode="light"
                  className="border rounded-lg overflow-hidden"
                >
                  <MDEditor
                    value={field.value}
                    onChange={field.onChange}
                    previewOptions={{
                      rehypePlugins: [[rehypeSanitize]],
                    }}
                    height={400}
                  />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Flex justify="end" gap="3">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
          >
            {form.formState.isSubmitting ? <BeatLoader /> : "Save Updates"}
          </Button>
        </Flex>
      </form>
    </Form>
  );
}
