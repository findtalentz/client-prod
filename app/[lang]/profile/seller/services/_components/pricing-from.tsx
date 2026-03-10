"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { z } from "zod";

import { queryClient } from "@/app/[lang]/query-client-provider";
import { DeleteDialog } from "@/components/delete-dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import usePackages from "@/hooks/usePackages";
import { handleApiError } from "@/lib/handle-api-error";
import apiClient from "@/services/api-client";
import { Check, DollarSign, Plus, X } from "lucide-react";

const PACKAGE_LABELS = {
  BASIC: "Basic",
  STANDARD: "Standard",
  PREMIUM: "Premium",
} as const;

const packageLabels = Object.values(PACKAGE_LABELS);

const portfolioFormSchema = z.object({
  label: z.enum(
    [PACKAGE_LABELS.BASIC, PACKAGE_LABELS.STANDARD, PACKAGE_LABELS.PREMIUM],
    {
      required_error: "Please select a package label",
    }
  ),
  features: z.array(z.string().min(1)).min(2, "Please add at least 2 features"),
  price: z.string().min(1, "Price is required").max(5000),
});

type PortfolioFormValues = z.infer<typeof portfolioFormSchema>;

interface Props {
  serviceId: string;
}

export default function AddPricing({ serviceId }: Props) {
  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      label: undefined,
      price: "",
      features: [],
    },
  });

  const features = form.watch("features");

  const handleAddItem = (field: "features") => {
    const currentValues = form.getValues()[field];
    form.setValue(field, [...currentValues, ""]);
  };

  const handleUpdateItem = (
    field: "features",
    index: number,
    value: string
  ) => {
    const currentValues = form.getValues()[field];
    const updatedValues = [...currentValues];
    updatedValues[index] = value;
    form.setValue(field, updatedValues);
  };

  const handleRemoveItem = (field: "features", index: number) => {
    const currentValues = form.getValues()[field];
    form.setValue(
      field,
      currentValues.filter((_, idx) => idx !== index)
    );
  };

  const onSubmit = async (formData: PortfolioFormValues) => {
    try {
      await apiClient.post("/packages", {
        ...formData,
        features,
        serviceId,
      });
      toast.success("Package added successfully!");
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      form.reset();
    } catch (error) {
      handleApiError(error);
    }
  };

  const { data } = usePackages(serviceId);
  const existingLabels = data?.data.map((pkg) => pkg.label) || [];

  const labelColors: Record<string, string> = {
    Basic: "bg-blue-50 text-blue-700 border-blue-100",
    Standard: "bg-purple-50 text-purple-700 border-purple-100",
    Premium: "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <div className="space-y-5">
      {/* Existing packages */}
      {data && data.data && data.data.length > 0 && (
        <div className="grid grid-cols-1 gap-3">
          {data.data.map((d) => (
            <div
              key={d._id}
              className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    labelColors[d.label] || "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  {d.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">${d.price}</span>
                  <DeleteDialog id={d._id} path="packages" />
                </div>
              </div>
              <ul className="space-y-1.5">
                {d.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Add new package form */}
      {existingLabels.length < packageLabels.length && (
        <div className="border border-dashed border-gray-200 rounded-xl p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Tier</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {packageLabels.map((label) => (
                            <SelectItem
                              key={label}
                              value={label}
                              disabled={existingLabels.includes(label)}
                            >
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (USD)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input placeholder="99" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormLabel className="text-sm font-medium">Features</FormLabel>
                <div className="space-y-2 mt-2">
                  {features?.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="e.g. Unlimited revisions"
                        value={feature}
                        onChange={(e) =>
                          handleUpdateItem("features", index, e.target.value)
                        }
                        disabled={form.formState.isSubmitting}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem("features", index)}
                        disabled={form.formState.isSubmitting}
                        className="shrink-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddItem("features")}
                  disabled={form.formState.isSubmitting}
                  className="mt-2 gap-1.5 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add feature
                </Button>

                {form.formState.errors.features && (
                  <p className="text-sm font-medium text-destructive mt-1.5">
                    {form.formState.errors.features.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <BeatLoader size={6} color="#fff" />
                  ) : (
                    "Add Package"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
