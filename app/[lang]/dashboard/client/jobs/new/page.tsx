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
import useDictionary from "@/hooks/useDictionary";
import { useParams, useRouter } from "next/navigation";
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

  location: Joi.string().required().messages({
    "string.base": "Location must be text.",
    "string.empty": "Location cannot be empty.",
    "any.required": "Location is required.",
  }),
});
function OverView() {
  const dict = useDictionary();
  const { overview, saveOverview } = useJobOverviewStore();
  const setStep = useStepStore((s) => s.setStep);
  const { data: categorys } = useJobCategorys();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { lang } = useParams();

  const form = useForm<JobOverview>({
    resolver: joiResolver(OverviewSchema),
    defaultValues: {
      title: overview?.title ?? "",
      category: overview?.category ?? "",
      jobType: overview?.jobType ?? "",
      location: overview?.location ?? "",
    },
  });

  const onSubmit = (data: JobOverview) => {
    try {
      setIsLoading(true);
      saveOverview(data);
      router.push(`/${lang}/dashboard/client/jobs/new/skills`);
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
      <h2 className="mb-6">{dict.jobPost.overview}</h2>

      {/* ✅ Only one form element */}
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dict.jobPost.jobTitleLabel}</FormLabel>
              <FormControl>
                <Input placeholder={dict.jobPost.jobTitlePlaceholder} {...field} />
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
                <FormLabel>{dict.jobPost.category}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full border-primary">
                      <SelectValue placeholder={dict.jobPost.selectCategory} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{dict.jobPost.categories}</SelectLabel>
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
                <FormLabel>{dict.jobPost.jobType}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full border-primary">
                      <SelectValue placeholder={dict.jobPost.selectJobType} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{dict.jobPost.types}</SelectLabel>
                      <SelectItem value="fixed">{dict.jobPost.fixed}</SelectItem>
                      <SelectItem value="full-time">{dict.jobPost.fullTime}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dict.jobPost.location}</FormLabel>
              <FormControl>
                <Input placeholder={dict.jobPost.locationPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <Link
            onClick={() => saveOverview(form.getValues())}
            href={`/${lang}/dashboard/client/jobs`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            {dict.common.saveDraftAndExit}
          </Link>
          <Button onClick={form.handleSubmit(onSubmit)}>
            {isLoading ? <BeatLoader /> : dict.common.saveAndNext}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default OverView;
