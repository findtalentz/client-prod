"use client";
import { Badge } from "@/components/ui/badge";
import CommentSchema from "@/schemas/Comment";
import apiClient from "@/services/api-client";
import { Flex } from "@radix-ui/themes";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  comment: CommentSchema;
}

function Comment({ comment }: Props) {
  const router = useRouter();
  return (
    <div
      className="border-b pb-2 last:border-none cursor-pointer"
      onClick={async () => {
        try {
          await apiClient.put(`/comments/${comment._id}`, {
            isOpened: true,
          });
          router.refresh();
          router.push(`/dashboard/client/jobs/${comment.job}`);
        } catch (error) {
          if (error instanceof AxiosError) {
            toast.error(error.message);
          }
        }
      }}
    >
      <Flex align="start" direction="column">
        <Badge
          variant="secondary"
          className="bg-primary-light text-primary-dark mb-1"
        >
          Action Required
        </Badge>
      </Flex>
      <p className="text-sm text-gray-700 line-clamp-2">
        {comment.message.slice(0, 50)}
        {comment.message.length > 50 && "..."}
      </p>
    </div>
  );
}

export default Comment;
