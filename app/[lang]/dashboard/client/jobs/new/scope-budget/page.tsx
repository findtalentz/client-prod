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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  JobScopeAndBudget,
  useJobScopeAndBudgetStore,
  useStepStore,
} from "@/store";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const JobScopeAndBudgetSchema = Joi.object({
  duration: Joi.string().valid("large", "medium", "small").required().messages({
    "string.empty": "Duration is required",
    "any.only": "Invalid duration value",
  }),
  budgetType: Joi.string().valid("fixed", "custom").required().messages({
    "string.empty": "Budget type is required",
    "any.only": "Invalid budget type",
  }),
  budgetAmount: Joi.number().min(5).max(10000).required().messages({
    "number.base": "Budget amount must be a number",
    "number.min": "Minimum budget is $5",
    "number.max": "Maximum budget is $10,000",
    "any.required": "Budget amount is required",
  }),
  description: Joi.string().min(50).max(5000).required().messages({
    "string.empty": "Job description is required",
    "string.min": "Description should be at least 50 characters",
    "string.max": "Description should be less than 5000 characters",
  }),
});

function ScopeAndBudget() {
  const router = useRouter();
  const setStep = useStepStore((s) => s.setStep);
  const { jobScopeAndBudget, saveJobScopeAndBudget } =
    useJobScopeAndBudgetStore();

  const form = useForm<JobScopeAndBudget>({
    resolver: joiResolver(JobScopeAndBudgetSchema),
    defaultValues: {
      duration: jobScopeAndBudget?.duration ?? "",
      budgetType: jobScopeAndBudget?.budgetType ?? "",
      budgetAmount: jobScopeAndBudget?.budgetAmount ?? 0,
      description: jobScopeAndBudget?.description ?? "",
    },
  });

  const onSubmit = async (data: JobScopeAndBudget) => {
    try {
      saveJobScopeAndBudget(data);
      router.push("/dashboard/client/jobs/new/preview");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  useEffect(() => {
    setStep(3);
  }, [setStep]);

  return (
    <Form {...form}>
      <form className="space-y-6 p-4">
        <h2 className="text-xl font-semibold mb-4">Job Scope & Budget</h2>

        {/* Duration */}
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full border-primary">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Project Duration</SelectLabel>
                    <SelectItem value="large">More than 6 months</SelectItem>
                    <SelectItem value="medium">3 - 6 months</SelectItem>
                    <SelectItem value="small">1 - 3 months</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Budget Type */}
        <FormField
          control={form.control}
          name="budgetType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Type *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full border-primary">
                    <SelectValue placeholder="Select budget type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Budget Options</SelectLabel>
                    <SelectItem value="fixed">Fixed Package</SelectItem>
                    <SelectItem value="custom">Custom Offer</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Budget Amount */}
        <FormField
          control={form.control}
          name="budgetAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Amount ($)*</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter budget amount"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Job Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the job requirements..."
                  rows={8}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <Link
            onClick={() => saveJobScopeAndBudget(form.getValues())}
            href="/dashboard/client/jobs"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Save draft and exit
          </Link>
          <Button onClick={form.handleSubmit(onSubmit)}>Save & Next</Button>
        </div>
      </form>
    </Form>
  );
}

export default ScopeAndBudget;
