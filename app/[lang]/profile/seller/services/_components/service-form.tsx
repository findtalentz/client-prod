"use client";

import { joiResolver } from "@hookform/resolvers/joi";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { BeatLoader } from "react-spinners";

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
import Text from "@/components/ui/text";
import Joi from "joi";

import { queryClient } from "@/app/[lang]/query-client-provider";
import { storage } from "@/firebase";
import useSession from "@/hooks/useSession";
import Service from "@/schemas/Service";
import apiClient from "@/services/api-client";
import MDEditor from "@uiw/react-md-editor";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import rehypeSanitize from "rehype-sanitize";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const serviceFormSchema = Joi.object({
  title: Joi.string()
    .required()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-Z0-9\s\-_,.!'()]+$/)
    .messages({
      "string.empty": "Service title is required",
      "string.min": "Please enter a service title",
      "string.max": "Title must not exceed 100 characters",
      "string.pattern.base": "Title contains invalid characters",
    }),

  description: Joi.string()
    .required()
    .min(30)
    .max(1000)
    .custom((value, helpers) => {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount < 10) {
        return helpers.error("string.minWords", { count: 10 });
      }
      return value;
    }, "minimum words validation")
    .messages({
      "string.empty": "Description is required",
      "string.min": "Description must be at least 30 characters long",
      "string.max": "Description must not exceed 1000 characters",
      "string.minWords": "Description should contain at least {{#count}} words",
    }),

  image: Joi.string().required().uri().messages({
    "string.empty": "Please upload an image",
    "string.uri": "Please provide a valid image URL",
  }),

  tools: Joi.array()
    .items(
      Joi.string().min(2).messages({
        "string.empty": "Tool cannot be empty",
        "string.min": "Each tool must contain at least 2 characters",
      })
    )
    .min(2)
    .required()
    .messages({
      "array.min": "Please add at least 2 tools",
      "any.required": "Tools are required",
    }),

  features: Joi.array()
    .items(
      Joi.string().min(2).messages({
        "string.empty": "Feature cannot be empty",
        "string.min": "Each feature must contain at least 2 characters",
      })
    )
    .min(2)
    .required()
    .messages({
      "array.min": "Please add at least 2 features",
      "any.required": "Features are required",
    }),

  details: Joi.array()
    .items(
      Joi.string().min(2).messages({
        "string.empty": "Detail cannot be empty",
        "string.min": "Each detail must contain at least 2 characters",
      })
    )
    .min(2)
    .required()
    .messages({
      "array.min": "Please add at least 2 details",
      "any.required": "Details are required",
    }),
});
type ServiceFormValues = {
  title: string;
  description: string;
  image: string;
  tools: string[];
  features: string[];
  details: string[];
};

interface EditServiceProps {
  service?: Service;
}

export default function ServiceFormPage({ service }: EditServiceProps) {
  const { data: userData } = useSession();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ServiceFormValues>({
    resolver: joiResolver(serviceFormSchema),
    defaultValues: {
      title: service?.title ?? "",
      description: service?.description ?? "",
      image: service?.image ?? "",
      tools: service?.tools ?? [],
      features: service?.features ?? [],
      details: service?.details ?? [],
    },
  });

  const { watch } = form;
  const details = watch("details");
  const tools = watch("tools");
  const features = watch("features");
  const router = useRouter();

  const handleRemoveItem = (
    field: "tools" | "features" | "details",
    index: number
  ) => {
    const currentValues = form.getValues()[field];
    form.setValue(
      field,
      currentValues.filter((_, idx) => idx !== index)
    );
  };

  const handleAddItem = (field: "tools" | "features" | "details") => {
    const currentValues = form.getValues()[field];
    form.setValue(field, [...currentValues, ""]);
  };

  const handleUpdateItem = (
    field: "tools" | "features" | "details",
    index: number,
    value: string
  ) => {
    const currentValues = form.getValues()[field];
    const updatedValues = [...currentValues];
    updatedValues[index] = value;
    form.setValue(field, updatedValues);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or WEBP image");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 1MB");
      return;
    }

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `services/${Date.now()}_${file.name}`);
      await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      form.setValue("image", downloadURL);
    } catch (error) {
      toast.error("Failed to upload image");
      console.error("Image upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (formData: ServiceFormValues) => {
    if (!userData) {
      toast.error("User not authenticated");
      return;
    }

    const serviceData = {
      ...formData,
      userId: userData.data._id,
    };

    try {
      const endpoint = service ? `/services/${service._id}` : "/services";

      const method = service ? "put" : "post";

      const { data } = await apiClient[method](endpoint, serviceData);
      toast.success(`Service ${service ? "updated" : "created"} successfully!`);
      if (!service) {
        router.push(`/profile/seller/services/${data.data._id}`);
      }
      queryClient.invalidateQueries({ queryKey: ["services"] });
      if (service) {
        router.push("/profile/seller/services/");
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Web Development"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Details */}
        <div className="mt-4">
          <FormLabel className="text-sm font-medium">Details *</FormLabel>

          {details?.map((detail, index) => (
            <div key={index} className="flex items-center gap-2 mt-2">
              <Input
                placeholder="Enter detail"
                value={detail}
                onChange={(e) =>
                  handleUpdateItem("details", index, e.target.value)
                }
                disabled={form.formState.isSubmitting}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleRemoveItem("details", index)}
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
            onClick={() => handleAddItem("details")}
            disabled={form.formState.isSubmitting}
            className="mt-3"
          >
            Add Another Detail
          </Button>

          {form.formState.errors.details && (
            <p className="text-sm font-medium text-destructive mt-2">
              {form.formState.errors.details.message}
            </p>
          )}
        </div>

        {/* Tools */}
        <div className="mt-4">
          <FormLabel className="text-sm font-medium">Tools *</FormLabel>

          {tools?.map((tool, index) => (
            <div key={index} className="flex items-center gap-2 mt-2">
              <Input
                placeholder="Enter tool"
                value={tool}
                onChange={(e) =>
                  handleUpdateItem("tools", index, e.target.value)
                }
                disabled={form.formState.isSubmitting}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleRemoveItem("tools", index)}
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
            onClick={() => handleAddItem("tools")}
            disabled={form.formState.isSubmitting}
            className="mt-3"
          >
            Add Another Tool
          </Button>

          {form.formState.errors.tools && (
            <p className="text-sm font-medium text-destructive mt-2">
              {form.formState.errors.tools.message}
            </p>
          )}
        </div>

        {/* Features */}
        <div className="mt-4">
          <FormLabel className="text-sm font-medium">Features *</FormLabel>

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
            Add Another Feature
          </Button>

          {form.formState.errors.features && (
            <p className="text-sm font-medium text-destructive mt-2">
              {form.formState.errors.features.message}
            </p>
          )}
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
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

        {/* Image Upload */}
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormLabel>Service Image</FormLabel>
              <FormControl>
                <div className="relative h-[500px] border-2 border-dashed border-primary rounded-2xl flex flex-col items-center justify-center gap-2 overflow-hidden">
                  <input
                    id="service-image"
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    onChange={handleImageUpload}
                    disabled={form.formState.isSubmitting || isUploading}
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                  />
                  {form.watch("image") ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={form.watch("image")}
                        alt="Service preview"
                        fill
                        className="object-cover rounded-lg w-full h-full"
                      />
                    </div>
                  ) : isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <BeatLoader size={8} />
                      <Text variant="gray" size="small">
                        Uploading...
                      </Text>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <Text>
                        <span className="text-primary">Click to upload</span> or
                        drag and drop
                      </Text>
                      <Text variant="gray" size="small">
                        (JPG, PNG, WEBP up to 1MB)
                      </Text>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting || isUploading}
          className="w-full"
        >
          {form.formState.isSubmitting ? (
            <BeatLoader size={6} color="#ffffff" />
          ) : service ? (
            "Update Service"
          ) : (
            "Create Service"
          )}
        </Button>
      </form>
    </Form>
  );
}
