"use client";
import { queryClient } from "@/app/[lang]/query-client-provider";
import { CommentOptions, CreateComment } from "@/components/create-activity";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TableCell } from "@/components/ui/table";
import useComments from "@/hooks/useComments";
import { Chat } from "@/schemas/Chat";
import Job from "@/schemas/Job";
import apiClient from "@/services/api-client";
import { useChatStore } from "@/store";
import { Flex } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaAngleLeft } from "react-icons/fa6";
import Comment from "./comment";

interface Props {
  job: Job;
  title: string;
}

const commentTypes: CommentOptions = [
  { value: "COMMENT", label: "Comment" },
  { value: "DELIVERY", label: "Submit Work" },
  { value: "TIME_REQUEST", label: "Extend Delivery Date" },
];

export function JobDetails({ job, title }: Props) {
  const [isOpen, setOpen] = useState(false);
  const { data } = useComments(job._id);
  const setCurrentChat = useChatStore((s) => s.setCurrentChat);
  const router = useRouter();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <TableCell className="w-[200px] hover:bg-gray-50 transition-colors cursor-pointer">
          <SheetTitle asChild>
            <h3>{title}</h3>
          </SheetTitle>
        </TableCell>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-3xl lg:max-w-4xl pb-28">
        <SheetHeader className="mb-6">
          <Flex justify="between" align="center" className="px-1">
            <Button
              onClick={() => setOpen(false)}
              variant="ghost"
              className="gap-2 text-gray-600 hover:text-gray-900"
            >
              <FaAngleLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="px-6 border-gray-300 hover:bg-gray-50 cursor-pointer"
              onClick={async () => {
                try {
                  const { data } = await apiClient.post<Chat>("/chats", {
                    buyer: job.author._id,
                  });
                  setCurrentChat(data);
                  queryClient.invalidateQueries({
                    queryKey: ["chats"],
                  });
                  router.push("/dashboard/seller/messages");
                } catch {
                  toast.error("Failed to start chat");
                }
              }}
            >
              Message
            </Button>
          </Flex>
        </SheetHeader>

        <div className="px-4 pb-10 h-full flex flex-col">
          {/* Job Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">{job.title}</h2>
            <div className="inline-flex items-center h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm px-6">
              <span className="font-medium text-primary">Activity</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mb-8">
            <CreateComment jobId={job._id} options={commentTypes} />
          </div>

          {/* Comments Section */}
          <div className="space-y-6 flex-1 overflow-y-auto pr-2">
            {data?.data.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
