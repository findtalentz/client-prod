"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Education from "@/schemas/Education";
import apiClient from "@/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import { z } from "zod";

const educationFormSchema = z
  .object({
    degree: z.string().min(1, "Degree is required"),
    institution: z.string().min(1, "Institution is required"),
    startDate: z.date({
      required_error: "Please select a start date",
    }),
    endDate: z.date().optional().nullable(),
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

type EducationFormValues = z.infer<typeof educationFormSchema>;

interface Props {
  education?: Education;
}

export function EducationFormDialog({ education }: Props) {
  const isEdit = !!education;
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: education
      ? {
          degree: education.degree,
          institution: education.institution,
          startDate: new Date(education.startDate),
          endDate: education.endDate ? new Date(education.endDate) : null,
        }
      : {
          degree: "",
          institution: "",
          startDate: undefined,
          endDate: null,
        },
    mode: "onChange",
  });

  const handleSubmit = async (data: EducationFormValues) => {
    try {
      if (isEdit) {
        await apiClient.put(`/educations/${education._id}`, data);
        toast.success("Education updated successfully");
      } else {
        await apiClient.post("/educations", data);
        form.reset();
        toast.success("Education added successfully");
      }
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      toast.error(
        isEdit
          ? "Unable to update education at this time"
          : "Unable to add education at this time"
      );
      console.error("Education submission error:", error);
    }
  };

  const isSubmitting = form.formState.isSubmitting;
  const isValid = form.formState.isValid;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className={
          isEdit
            ? buttonVariants({ variant: "ghost", size: "sm" })
            : buttonVariants()
        }
      >
        {isEdit ? (
          <FaRegEdit className="text-gray-600 hover:text-gray-900" />
        ) : (
          "Add Education"
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Education" : "Add Education"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Bachelor of Science in Computer Science"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="University of Technology" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        onChange={(e) => field.onChange(e.target.valueAsDate)}
                        value={
                          field.value
                            ? field.value.toISOString().split("T")[0]
                            : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        onChange={(e) => field.onChange(e.target.valueAsDate)}
                        value={
                          field.value
                            ? field.value.toISOString().split("T")[0]
                            : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <BeatLoader size={8} color="#ffffff" />
                ) : isEdit ? (
                  "Update Education"
                ) : (
                  "Save Education"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
