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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFilesUpload } from "@/hooks/useFilesUpload";
import useSession from "@/hooks/useSession";
import apiClient from "@/services/api-client";
import { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsPaperclip, BsX } from "react-icons/bs";
import { LuPlus } from "react-icons/lu";
import { BeatLoader } from "react-spinners";

type Type = "COMMENT" | "FUND_REQUEST" | "TIME_REQUEST" | "DELIVERY";

export type CommentOptions = Array<{ value: Type; label: string }>;

interface Props {
  jobId: string;
  options: CommentOptions;
}

export function CreateComment({ jobId, options }: Props) {
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [reqTime, setReqTime] = useState("");
  const [selectedOption, setSelectedOption] = useState<Type>("COMMENT");

  const router = useRouter();
  const { data: user } = useSession();

  const {
    fileInputRef,
    isUploading,
    attachments,
    handleFileChange,
    triggerFileInput,
    removeAttachment,
    resetAttachments,
  } = useFilesUpload(`comments/${jobId}`);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !jobId) return;
    setLoading(true);

    try {
      await apiClient.post("/comments", {
        job: jobId,
        reqType: selectedOption,
        message,
        reqTime: selectedOption === "TIME_REQUEST" ? reqTime : undefined,
        attachments: attachments.map((a) => a.url),
        ...(user.data.role === "CLIENT"
          ? { client: user.data._id }
          : { seller: user.data._id }),
      });

      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("Comment added successfully");
      resetAttachments();
      setMessage("");
      setReqTime("");
      router.refresh();
      setOpen(false);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        setError(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const getDialogTitle = () => {
    switch (selectedOption) {
      case "DELIVERY":
        return "Submit Work";
      case "TIME_REQUEST":
        return "Request Time Extension";
      case "FUND_REQUEST":
        return "Request Additional Funds";
      default:
        return "Add Comment";
    }
  };

  const getPlaceholderText = () => {
    switch (selectedOption) {
      case "DELIVERY":
        return "Describe your work submission...";
      case "TIME_REQUEST":
        return "Explain why you need more time...";
      case "FUND_REQUEST":
        return "Explain why you need additional funds...";
      default:
        return "Write your comment...";
    }
  };

  const handleOptionChange = (value: Type) => {
    setSelectedOption(value);
    if (value !== "TIME_REQUEST") {
      setReqTime("");
    }
    if (value === "COMMENT") {
      setMessage("");
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild className="bg-transparent">
        <div className="flex-1 flex items-center gap-2">
          <LuPlus />{" "}
          <span>
            Create Comment / Request{" "}
            {user.data.role === "SELLER" && "/ Submit Work"}
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {getDialogTitle()}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none">
                Comment Type
              </label>
              <Select value={selectedOption} onValueChange={handleOptionChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select comment type" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none">
                Message
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={getPlaceholderText()}
                rows={4}
                className="rounded-lg"
                required={
                  selectedOption !== "COMMENT" || attachments.length === 0
                }
              />
            </div>

            {selectedOption === "TIME_REQUEST" && (
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none">
                  New Delivery Date
                </label>
                <Input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={reqTime}
                  onChange={(e) => setReqTime(e.target.value)}
                  className="rounded-lg"
                  required
                />
              </div>
            )}

            {/* File preview section using hook's attachments */}
            {attachments.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Attachments
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-muted/50 border rounded-lg">
                  {attachments.map((file, index) => (
                    <div
                      key={`${file.url}-${index}`}
                      className="relative w-20 h-20 rounded-md border overflow-hidden bg-background"
                    >
                      {file.type.startsWith("image/") ? (
                        <Image
                          src={file.url}
                          alt={file.name}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full p-1">
                          <BsPaperclip className="text-muted-foreground" />
                          <span className="text-xs text-center truncate w-full px-1">
                            {file.name}
                          </span>
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeAttachment(index);
                        }}
                        className="absolute top-1 right-1 p-1 bg-foreground/50 rounded-full hover:bg-foreground/70"
                        disabled={isUploading}
                      >
                        <BsX className="text-background text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                onClick={triggerFileInput}
                disabled={isUploading}
              >
                <BsPaperclip className="h-4 w-4" />
                <span>Add Attachment</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
                  disabled={isUploading}
                />
              </Button>
            </div>
          </div>

          <div>{error && <p className="text-destructive"> {error} </p>}</div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                resetAttachments();
                setMessage("");
                setReqTime("");
                setSelectedOption("COMMENT");
              }}
              disabled={isLoading || isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                isUploading ||
                (!message.trim() &&
                  attachments.length === 0 &&
                  selectedOption !== "TIME_REQUEST") ||
                (selectedOption === "TIME_REQUEST" && !reqTime)
              }
            >
              {isLoading ? (
                <BeatLoader size={8} color="#ffffff" />
              ) : selectedOption === "COMMENT" ? (
                "Post Comment"
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
