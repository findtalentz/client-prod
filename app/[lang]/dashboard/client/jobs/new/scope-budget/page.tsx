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
import useDictionary from "@/hooks/useDictionary";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BeatLoader } from "react-spinners";

const JobScopeAndBudgetSchema = Joi.object({
  duration: Joi.string().valid("large", "medium", "small").required().messages({
    "string.empty": "Duration is required",
    "any.only": "Invalid duration value",
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
  const dict = useDictionary();
  const router = useRouter();
  const { lang } = useParams();
  const setStep = useStepStore((s) => s.setStep);
  const { jobScopeAndBudget, saveJobScopeAndBudget } =
    useJobScopeAndBudgetStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<JobScopeAndBudget>({
    resolver: joiResolver(JobScopeAndBudgetSchema),
    defaultValues: {
      duration: jobScopeAndBudget?.duration ?? "",
      budgetAmount: jobScopeAndBudget?.budgetAmount ?? 0,
      description: jobScopeAndBudget?.description ?? "",
    },
  });

  const onSubmit = async (data: JobScopeAndBudget) => {
    try {
      setIsLoading(true);
      saveJobScopeAndBudget(data);
      router.push(`/${lang}/dashboard/client/jobs/new/preview`);
    } catch (error) {
      console.error("Error saving data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setStep(3);
  }, [setStep]);

  return (
    <Form {...form}>
      <form className="space-y-6 p-4">
        <h2 className="text-xl font-semibold mb-4">{dict.jobPost.jobScopeAndBudget}</h2>

        {/* Duration */}
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dict.jobPost.duration}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full border-primary">
                    <SelectValue placeholder={dict.jobPost.selectDuration} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{dict.jobPost.projectDuration}</SelectLabel>
                    <SelectItem value="large">{dict.jobPost.moreThan6Months}</SelectItem>
                    <SelectItem value="medium">{dict.jobPost["3to6months"]}</SelectItem>
                    <SelectItem value="small">{dict.jobPost["1to3months"]}</SelectItem>
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
              <FormLabel>{dict.jobPost.budgetAmount}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={dict.jobPost.enterBudgetAmount}
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
              <FormLabel>{dict.jobPost.jobDescription}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={dict.jobPost.describeJobRequirements}
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
            href={`/${lang}/dashboard/client/jobs`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            {dict.common.saveDraftAndExit}
          </Link>
          <Button disabled={isLoading} onClick={form.handleSubmit(onSubmit)}>
            {isLoading ? <BeatLoader size={8} color="white" /> : dict.common.saveAndNext}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default ScopeAndBudget;
