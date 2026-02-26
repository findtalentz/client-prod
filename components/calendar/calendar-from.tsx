"use client";

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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import apiClient from "@/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long." })
    .max(100, { message: "Title must not exceed 100 characters." }),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(1000, { message: "Description must not exceed 1000 characters." }),

  date: z
    .string({ required_error: "Date is required." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Date must be in YYYY-MM-DD format.",
    })
    .refine(
      (val) => {
        const selectedDate = new Date(val);
        selectedDate.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      { message: "Date must be today or in the future." }
    ),

  time: z.string().optional().default(""),

  isAllDay: z.boolean().default(false),

  type: z.string(),
}).refine(
  (data) => {
    if (!data.isAllDay) {
      return /^([01]\d|2[0-3]):([0-5]\d)$/.test(data.time || "");
    }
    return true;
  },
  {
    message: "Time must be in HH:MM 24-hour format.",
    path: ["time"],
  }
);

interface CalendarFormProps {
  onSuccess?: () => void;
}

function CalendarForm({ onSuccess }: CalendarFormProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      isAllDay: false,
      type: "Event",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await apiClient.post("/calendars", {
        ...values,
        time: values.isAllDay ? "" : values.time,
      });
      toast.success("Calendar event created successfully");

      form.reset({
        title: "",
        description: "",
        date: "",
        time: "",
        isAllDay: false,
        type: "",
      });

      onSuccess?.();
      router.refresh();
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create calendar event");
      }
    }
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto p-1">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Title *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="Task">Task</SelectItem>
                      <SelectItem value="Schedule">Schedule</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="isAllDay"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (checked) {
                        form.setValue("time", "");
                      }
                    }}
                  />
                </FormControl>
                <FormLabel className="text-sm font-medium !mt-0">All Day Event</FormLabel>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Date *</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {!form.watch("isAllDay") && (
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Time *</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="HH:MM"
                        {...field}
                        className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Description *
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter description" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onSuccess}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Event
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CalendarForm;
