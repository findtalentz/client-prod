"use client";

import { Button, buttonVariants } from "@/components/ui/button";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useJobCategorys from "@/hooks/useCategorys";
import { cn } from "@/lib/utils";
import { JobOverview, useJobOverviewStore, useStepStore } from "@/store";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BeatLoader } from "react-spinners";

const OverviewSchema = Joi.object({
  title: Joi.string().min(1).max(255).required().messages({
    "string.base": "Title must be text.",
    "string.empty": "Title cannot be empty.",
    "string.min": "Title must have at least 1 character.",
    "string.max": "Title cannot exceed 255 characters.",
    "any.required": "Title is required.",
  }),

  category: Joi.string().required().messages({
    "string.base": "Category must be text.",
    "string.empty": "Category cannot be empty.",
    "any.required": "Category is required.",
  }),

  jobType: Joi.string().required().messages({
    "string.base": "Job type must be text.",
    "string.empty": "Job type cannot be empty.",
    "any.required": "Job type is required.",
  }),

  company: Joi.string().optional().allow("").messages({
    "string.base": "Company name must be text.",
  }),

  location: Joi.string().required().messages({
    "string.base": "Location must be text.",
    "string.empty": "Location cannot be empty.",
    "any.required": "Location is required.",
  }),
});
function OverView() {
  const { overview, saveOverview } = useJobOverviewStore();
  const setStep = useStepStore((s) => s.setStep);
  const { data: categorys } = useJobCategorys();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<JobOverview>({
    resolver: joiResolver(OverviewSchema),
    defaultValues: {
      title: overview?.title ?? "",
      category: overview?.category ?? "",
      jobType: overview?.jobType ?? "",
      company: overview?.company ?? "",
      location: overview?.location ?? "",
    },
  });

  const onSubmit = (data: JobOverview) => {
    try {
      setIsLoading(true);
      saveOverview(data);
      router.push("/dashboard/client/jobs/new/skills");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setStep(1);
  }, [setStep]);
  return (
    <Form {...form}>
      <h2 className="mb-6">Overview</h2>

      {/* ✅ Only one form element */}
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title*</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Senior UX Designer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full border-primary">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      {categorys?.data.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Type*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full border-primary">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Types</SelectLabel>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="full-time">Full-time</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Company name" {...field} />
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
                <FormLabel>Location*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Remote, New York" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-between">
          <Link
            onClick={() => saveOverview(form.getValues())}
            href="/dashboard/client/jobs"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Save draft and exit
          </Link>
          <Button onClick={form.handleSubmit(onSubmit)}>
            {isLoading ? <BeatLoader /> : "Save & Next"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default OverView;
