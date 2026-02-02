"use client";
import { queryClient } from "@/app/[lang]/query-client-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Text from "@/components/ui/text";
import useSession from "@/hooks/useSession";
import { formatDate } from "@/lib/utils";
import CommentSchema from "@/schemas/Comment";
import FILE_ICONS from "@/schemas/FileIcons";
import apiClient from "@/services/api-client";
import { Avatar, Flex } from "@radix-ui/themes";
import { AxiosError } from "axios";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiDownload, FiFilePlus } from "react-icons/fi";
import { BeatLoader } from "react-spinners";

const getFileIcon = (url: string) => {
  const extension = url.split(".").pop()?.toLowerCase() || "";
  return FILE_ICONS[extension] || <FiFilePlus className="text-gray-500" />;
};

const getFileNameFromUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return pathname.substring(pathname.lastIndexOf("/") + 1);
  } catch {
    return url.substring(url.lastIndexOf("/") + 1);
  }
};

interface Props {
  comment: CommentSchema;
}

export default function Comment({ comment }: Props) {
  const [isApproving, setApproving] = useState(false);
  const [isDeclining, setDeclining] = useState(false);
  const { data: user } = useSession();

  const approveRequest = async () => {
    setApproving(true);
    try {
      if (comment.reqType === "TIME_REQUEST") {
        await apiClient.post("/comments/approve/time", {
          commentId: comment._id,
          jobId: comment.job,
          deliveryDate: comment.reqTime,
        });
      } else {
        return null;
      }
      toast.success("Approved");
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my_jobs"],
      });
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      }
    } finally {
      setApproving(false);
    }
  };

  const deniedRequest = async () => {
    setDeclining(true);
    try {
      await apiClient.put(`/comments/${comment._id}`, {
        status: "CANCELLED",
      });
      toast.success("Declined");
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      }
    } finally {
      setDeclining(false);
    }
  };

  if (!user) return null;

  const author = comment.seller ? comment.seller : comment.client;

  return (
    <div className=" overflow-hidden">
      <div className="p-4 relative mx-10 border rounded-2xl">
        <div className="absolute w-4 h-4 bg-primary rounded-full top-3 -left-8" />
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

        {/* Comment Content */}
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

          {/* File attachments */}
          {comment.attachments && comment.attachments.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {comment.attachments.map((file) => {
                const fileName = getFileNameFromUrl(file);
                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);

                return (
                  <div
                    key={file}
                    className="relative group border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow w-40"
                  >
                    {isImage ? (
                      <div className="relative w-full aspect-square">
                        <Image
                          src={file}
                          fill
                          className="object-cover"
                          alt={fileName}
                          sizes="160px"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-square flex flex-col items-center justify-center p-4">
                        <div className="text-3xl mb-2">
                          {getFileIcon(fileName)}
                        </div>
                        <p className="text-xs text-center text-gray-600 truncate w-full">
                          {fileName}
                        </p>
                      </div>
                    )}

                    {/* Download button overlay */}
                    <a
                      href={file}
                      download={fileName}
                      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <div className="bg-white p-2 rounded-full shadow-lg">
                        <FiDownload className="text-gray-700" />
                      </div>
                    </a>

                    {/* File name at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-2">
                      <p className="text-xs text-white truncate">{fileName}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {comment.reqType !== "COMMENT" &&
          comment.reqType !== "DELIVERY" &&
          comment.status === "PENDING" &&
          author._id !== user.data._id && (
            <Flex justify="end" gap="3" className="pt-2 border-t gap-3!">
              <Button
                disabled={isDeclining}
                onClick={deniedRequest}
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
      </div>
    </div>
  );
}
