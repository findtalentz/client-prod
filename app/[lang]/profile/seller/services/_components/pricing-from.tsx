"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
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
import { GoDotFill } from "react-icons/go";

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
  features: z.array(z.string().min(1)).min(2, "Please add at least 2 feature"),
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

  return (
    <div className="space-y-6">
      {data && data.data && (
        <div className="space-y-5 max-h-[60dvh] overflow-auto">
          {data.data.map((d) => (
            <div
              key={d._id}
              className="border p-3 shadow rounded-2xl relative pb-8"
            >
              <div className="flex w-full items-center justify-between">
                <h4> {d.label} </h4>
                <h4> ${d.price} </h4>
              </div>
              <ul className="space-y-1">
                {d.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-1">
                    <GoDotFill /> {f}
                  </li>
                ))}
              </ul>
              <div className="absolute bottom-2 right-3 text-[10px] italic text-gray-500">
                <DeleteDialog id={d._id} path="packages" />
              </div>
            </div>
          ))}
        </div>
      )}
      {existingLabels.length < packageLabels.length && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a package label" />
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

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input placeholder="Price" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-4">
                <FormLabel className="text-sm font-medium">
                  Features *
                </FormLabel>

                {features?.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 mt-2">
                    <Input
                      placeholder="Enter feature"
                      value={feature}
                      onChange={(e) =>
                        handleUpdateItem("features", index, e.target.value)
                      }
                      disabled={form.formState.isSubmitting}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveItem("features", index)}
                      disabled={form.formState.isSubmitting}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <RxCross2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddItem("features")}
                  disabled={form.formState.isSubmitting}
                  className="mt-3"
                >
                  {features.length > 1 ? " Add Another Feature" : "Add Feature"}
                </Button>

                {form.formState.errors.features && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.features.message}
                  </p>
                )}
              </div>
            </div>
            <div className="float-end w-full flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <BeatLoader size={6} /> : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
