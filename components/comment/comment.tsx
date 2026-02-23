"use client";
import { queryClient } from "@/app/[lang]/query-client-provider";
import FileAttachmentGrid from "@/components/file-attachment-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Text from "@/components/ui/text";
import useSession from "@/hooks/useSession";
import { handleApiError } from "@/lib/handle-api-error";
import { formatDate } from "@/lib/utils";
import CommentSchema from "@/schemas/Comment";
import apiClient from "@/services/api-client";
import { Avatar, Flex } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

interface Props {
  comment: CommentSchema;
  role: "client" | "seller";
  variant: "active" | "completed" | "list";
}

export default function Comment({ comment, role, variant }: Props) {
  const [isApproving, setApproving] = useState(false);
  const [isDeclining, setDeclining] = useState(false);
  const { data: user } = useSession();
  const router = useRouter();

  const author = comment.seller ? comment.seller : comment.client;

  const approveRequest = async () => {
    setApproving(true);
    try {
      if (comment.reqType === "TIME_REQUEST") {
        await apiClient.post("/comments/approve/time", {
          commentId: comment._id,
          jobId: comment.job,
          deliveryDate: comment.reqTime,
        });
      } else if (comment.reqType === "DELIVERY" && role === "client") {
        await apiClient.post("/comments/approve/delivery", {
          commentId: comment._id,
          jobId: comment.job,
          sellerId: comment.seller._id,
        });
      } else {
        return null;
      }
      toast.success("Approved");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["comments"] }),
        queryClient.invalidateQueries({ queryKey: ["jobs"] }),
        queryClient.invalidateQueries({ queryKey: ["my_jobs"] }),
        queryClient.invalidateQueries({ queryKey: ["session"] }),
      ]);
      router.refresh();
    } catch (error) {
      handleApiError(error);
    } finally {
      setApproving(false);
    }
  };

  const declineRequest = async () => {
    setDeclining(true);
    try {
      await apiClient.put(`/comments/${comment._id}`, {
        status: comment.reqType === "DELIVERY" ? "cancel" : "CANCELLED",
      });
      toast.success("Declined");
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    } catch (error) {
      if (comment.reqType === "DELIVERY") {
        console.log(error);
        toast.error("Failed to decline request");
      } else {
        handleApiError(error);
      }
    } finally {
      setDeclining(false);
    }
  };

  if (variant === "active" && !user) return null;

  const isActive = variant === "active";
  const fileSize = variant === "list" || variant === "completed" ? "sm" : "md";

  const canActOnNonDelivery =
    isActive &&
    comment.reqType !== "COMMENT" &&
    comment.reqType !== "DELIVERY" &&
    comment.status === "PENDING" &&
    author._id !== user?.data._id;

  const canActOnDelivery =
    isActive &&
    role === "client" &&
    comment.reqType === "DELIVERY" &&
    comment.status === "PENDING" &&
    comment.seller._id !== user?.data._id;

  const commentContent = (
    <>
      <Flex align="center" justify="between" className="pb-3 border-b">
        <Flex align="center" gap="3">
          <Avatar
            src={author.image}
            fallback="U"
            radius="full"
            className="w-8! h-8! mr-2! rounded-full!"
          />
          <Text className="font-medium">
            {author.firstName} {author.lastName}
          </Text>
        </Flex>
        <Text className="text-gray-500 text-sm">
          {formatDate(comment.createdAt)}
        </Text>
      </Flex>

      <div className="py-4">
        {comment.reqType === "FUND_REQUEST" && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <Flex align="center" justify="between">
              <Text className="font-medium">Fund Increase Request</Text>
              <Badge className="bg-blue-100 text-blue-800 text-lg font-semibold">
                ${comment.reqFund}
              </Badge>
            </Flex>
          </div>
        )}

        {comment.reqType === "TIME_REQUEST" && (
          <div className="mb-4 p-3 bg-purple-50 rounded-lg">
            <Flex direction="column" gap="1">
              <Text className="font-medium">Time Extension Request</Text>
              <Badge className="bg-purple-100 text-purple-800 text-lg font-semibold mt-1">
                {formatDate(comment.reqTime)}
              </Badge>
            </Flex>
          </div>
        )}

        <Text className="text-gray-700">
          {comment.message || "No additional message provided"}
        </Text>

        <FileAttachmentGrid
          files={comment.attachments}
          size={fileSize as "sm" | "md"}
        />
      </div>

      {/* Non-delivery action buttons */}
      {canActOnNonDelivery && (
        <Flex justify="end" gap="3" className="pt-2 border-t gap-3!">
          <Button
            disabled={isDeclining}
            onClick={declineRequest}
            variant="outline"
            className="text-gray-700"
          >
            {isDeclining ? <BeatLoader size={8} /> : "Decline"}
          </Button>
          <Button disabled={isApproving} onClick={approveRequest}>
            {isApproving ? <BeatLoader size={8} /> : "Approve"}
          </Button>
        </Flex>
      )}

      {/* Delivery action buttons (client only) */}
      {canActOnDelivery && (
        <Flex justify="end" gap="3" className="pt-2 border-t gap-3!">
          <Button
            disabled={isDeclining}
            onClick={declineRequest}
            variant="outline"
            className="text-gray-700"
          >
            {isDeclining ? <BeatLoader size={8} /> : "Decline"}
          </Button>
          <Button disabled={isApproving} onClick={approveRequest}>
            {isApproving ? <BeatLoader size={8} /> : "Accept"}
          </Button>
        </Flex>
      )}

      {/* List variant — basic stubs */}
      {variant === "list" &&
        comment.reqType !== "COMMENT" &&
        comment.status === "PENDING" &&
        author._id !== user?.data._id && (
          <Flex justify="end" gap="3" className="pt-2 border-t">
            <Button variant="outline" className="text-gray-700">
              Decline
            </Button>
            <Button>Approve</Button>
          </Flex>
        )}

      {/* Status badges */}
      {comment.status === "APPROVED" && (
        <Flex justify="end" gap="3" className="pt-2 border-t gap-3!">
          <Button disabled variant="light" className="text-gray-700">
            Approved
          </Button>
        </Flex>
      )}
      {comment.status === "CANCELLED" && (
        <Flex justify="end" gap="3" className="pt-2 border-t gap-3!">
          <Button
            disabled
            variant="destructive"
            className="bg-destructive/20 text-gray-600"
          >
            Declined
          </Button>
        </Flex>
      )}
    </>
  );

  if (isActive) {
    return (
      <div className="overflow-hidden">
        <div className="p-4 relative mx-10 border rounded-2xl">
          <div className="absolute w-4 h-4 bg-primary rounded-full top-3 -left-8" />
          {commentContent}
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="p-4">{commentContent}</div>
    </div>
  );
}
