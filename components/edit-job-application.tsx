"use client";
import { queryClient } from "@/app/[lang]/query-client-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import Text from "@/components/ui/text";
import { useFilesUpload } from "@/hooks/useFilesUpload";
import useSession from "@/hooks/useSession";
import Application from "@/schemas/Application"; // Assuming you have an Application type
import apiClient from "@/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BiEdit } from "react-icons/bi";
import { BsPaperclip, BsX } from "react-icons/bs";
import { FiLoader } from "react-icons/fi";
import { BeatLoader } from "react-spinners";
import { z } from "zod";

const FormSchema = z.object({
  message: z.string().min(2, {
    message: "Comment must be at least 2 characters.",
  }),
});

interface Props {
  application: Application;
}

export function EditJobApplication({ application }: Props) {
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: application.message || "",
    },
  });

  // Initialize the filesUpload hook with existing attachments
  const {
    fileInputRef,
    isUploading,
    attachments,
    handleFileChange,
    triggerFileInput,
    removeAttachment,
    uploadProgress,
  } = useFilesUpload(`applications/${application.job}`);

  const isFormEmpty =
    form.watch("message").trim() === "" && attachments.length === 0;

  // Disable button when submitting, uploading, or form is empty
  const isSubmitDisabled = isFormEmpty || isLoading || isUploading;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!application._id || isSubmitDisabled) return;
    setLoading(true);

    try {
      await apiClient.put(`/applications/${application._id}`, {
        message: data.message,
        attachments: attachments.map((a) => a.url),
      });
      toast.success("Application updated successfully");
      form.reset();
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["seller_application"] });
      setOpen(false);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        setError(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  }

  if (!session) return null;
  if (session.data.role === "CLIENT") return null;

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded">
          <BiEdit />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[800px]!">
        <DialogHeader>
          <DialogTitle>Edit Your Application</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <div className="border p-2 rounded-xl relative pb-5 overflow-hidden">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <textarea
                          placeholder="Write something"
                          {...field}
                          className="border-none !focus:outline-none outline-none pb-10 w-full"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Preview area for attachments */}
                {(attachments.length > 0 || isUploading) && (
                  <div className="px-3 py-2 bg-gray-50 border rounded-lg flex gap-2 overflow-x-auto mb-2">
                    {attachments.map((file, index) => (
                      <div
                        key={`${file.url}-${index}`}
                        className="relative shrink-0 w-16 h-16 rounded-md border overflow-hidden bg-gray-100"
                      >
                        {file.type.startsWith("image/") ? (
                          <Image
                            src={file.url}
                            alt={file.name}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            <span className="text-xs text-center p-1 break-all">
                              {file.name}
                            </span>
                          </div>
                        )}

                        {uploadProgress[file.name] !== undefined && (
                          <div className="absolute bottom-0 left-0 right-0 p-1">
                            <Progress
                              value={uploadProgress[file.name]}
                              className="h-1"
                            />
                          </div>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAttachment(index);
                          }}
                          className="absolute top-0 right-0 p-1 bg-black/50 rounded-full hover:bg-black/70"
                          disabled={isUploading}
                        >
                          <BsX className="text-white text-xs" />
                        </button>
                      </div>
                    ))}

                    {isUploading && attachments.length === 0 && (
                      <div className="flex items-center justify-center w-full py-2">
                        <FiLoader className="animate-spin text-gray-500 mr-2" />
                        <span className="text-sm text-gray-500">
                          Uploading files...
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="absolute bottom-0 py-2 bg-white w-full">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="flex items-center gap-1 cursor-pointer"
                      disabled={isUploading}
                    >
                      <BsPaperclip /> <Text size="small">Attachment</Text>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      multiple
                      className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
                      disabled={isUploading}
                    />
                  </div>
                </div>
              </div>
              {error && <p className="text-destructive"> {error} </p>}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="px-10"
                  disabled={isSubmitDisabled}
                >
                  {isLoading || isUploading ? (
                    <BeatLoader size={8} color="#ffffff" />
                  ) : (
                    "Update Application"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
