"use client";

import { queryClient } from "@/app/[lang]/query-client-provider";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { storage } from "@/firebase";
import ApiResponse from "@/schemas/ApiRespose";
import apiClient from "@/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Plus, UploadIcon } from "lucide-react"; // Import the upload icon
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import * as z from "zod";

const disputeFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters long",
  }),
  type: z.string().min(2),
  evidence: z.string().optional(),
  description: z
    .string()
    .min(20, {
      message: "Description must be at least 20 characters long",
    })
    .max(1000, {
      message: "Description must not exceed 1000 characters",
    }),
});

type DisputeFormValues = z.infer<typeof disputeFormSchema>;

interface Props {
  jobId: string;
}

export function DisputeDialog({ jobId }: Props) {
  const [isOpen, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<DisputeFormValues>({
    resolver: zodResolver(disputeFormSchema),
    defaultValues: {
      title: "",
      type: "Service Not Good",
      evidence: "",
      description: "",
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setIsUploading(true);
    setUploadProgress(0);

    const storageRef = ref(
      storage,
      `dispute-evidence/${Date.now()}-${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        toast.error("Failed to upload evidence");
        setIsUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setImageUrl(downloadURL);
        form.setValue("evidence", downloadURL);
        setIsUploading(false);
      }
    );
  };

  const onSubmit = async (data: DisputeFormValues) => {
    try {
      setIsSubmitting(true);

      const res = await apiClient.post<ApiResponse<string>>("/disputes", {
        ...data,
        job: jobId,
      });

      toast.success(res.data.message);
      form.reset();
      setImageUrl("");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["job_disputes"] });
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || "Failed to submit dispute"
          : "Failed to submit dispute";
      toast.error(message);
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white hover:bg-primary cursor-pointer">
          <Plus /> Submit Dispute
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Submit Dispute
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dispute Title*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief title summarizing your dispute"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Dispute Type*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select dispute type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Service Not Good">
                          Service Not Good
                        </SelectItem>
                        <SelectItem value="Seller Not Available">
                          Seller Not Available
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* File Upload */}
              <FormField
                control={form.control}
                name="evidence"
                render={() => (
                  <FormItem>
                    <FormLabel>Supporting Evidence</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed rounded px-4 flex items-center justify-center text-center gap-2 cursor-pointer hover:bg-muted transition">
                        <Input
                          type="file"
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          disabled={isUploading || isSubmitting}
                          className="hidden"
                          id="evidence-upload"
                        />
                        {!imageUrl && (
                          <label
                            htmlFor="evidence-upload"
                            className="cursor-pointer flex items-center gap-2 w-full"
                          >
                            <UploadIcon
                              size="15"
                              className="text-muted-foreground text-sm"
                            />
                            <span className="text-xs text-muted-foreground">
                              {isUploading
                                ? "Uploading..."
                                : " PNG, JPG, PDF, DOC (max. 10MB)"}
                            </span>
                          </label>
                        )}

                        {isUploading && (
                          <Progress
                            value={uploadProgress}
                            className="w-full mt-2"
                          />
                        )}

                        {imageUrl && !isUploading && (
                          <p className="text-sm text-green-600">
                            File uploaded successfully
                          </p>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your dispute in detail..."
                      className="min-h-[200px]"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Footer */}
            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setImageUrl("");
                  setOpen(false);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSubmitting || isUploading}>
                {isSubmitting ? (
                  <BeatLoader color="#fff" size={8} />
                ) : (
                  "Submit Dispute"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
