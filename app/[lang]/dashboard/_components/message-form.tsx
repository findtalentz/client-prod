"use client";
import { queryClient } from "@/app/[lang]/query-client-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useFilesUpload } from "@/hooks/useFilesUpload";
import useSession from "@/hooks/useSession";
import apiClient from "@/services/api-client";
import { useChatStore } from "@/store";
import { Flex } from "@radix-ui/themes";
import Image from "next/image";
import { useState } from "react";
import { BsPaperclip, BsX } from "react-icons/bs";
import { FiLoader } from "react-icons/fi";
import { LuSendHorizontal } from "react-icons/lu";

export default function MessageForm() {
  const [message, setMessage] = useState("");
  const currentChat = useChatStore((s) => s.currentChat);
  const { data: user } = useSession();

  const {
    fileInputRef,
    isUploading,
    uploadProgress,
    attachments,
    handleFileChange,
    triggerFileInput,
    removeAttachment,
    resetAttachments,
  } = useFilesUpload(currentChat ? `chat/${currentChat._id}` : "temp-uploads");

  if (!currentChat || !user) return <div />;

  const handleSubmit = async () => {
    if (!message.trim() && attachments.length === 0) return;

    try {
      await apiClient.post("/messages", {
        chatId: currentChat._id,
        message,
        files: attachments.map((a) => a.url),
      });

      setMessage("");
      resetAttachments();
      if (fileInputRef.current) fileInputRef.current.value = "";

      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t flex">
      {/* File preview section */}
      {(attachments.length > 0 || isUploading) && (
        <div className="px-3 py-2 bg-gray-50 border-b flex gap-2 overflow-x-auto">
          {attachments.map((file, index) => (
            <div
              key={`${file.url}-${index}`}
              className="relative flex-shrink-0 w-16 h-16 rounded-md border overflow-hidden bg-gray-100"
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

              {uploadProgress[file.name] !== undefined &&
                uploadProgress[file.name] < 100 && (
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
              <span className="text-sm text-gray-500">Uploading files...</span>
            </div>
          )}
        </div>
      )}

      {/* Input area */}
      <Flex align="center" className="px-3 py-2 flex-1">
        <Flex align="center" className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="absolute top-0 left-0 w-full h-full border-none focus:outline-none opacity-0"
            disabled={isUploading}
          />
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            onClick={triggerFileInput}
            disabled={isUploading}
          >
            <BsPaperclip />
          </Button>
        </Flex>

        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message"
          className="flex-1 rounded-none mx-2"
          disabled={isUploading}
        />

        <Button
          onClick={handleSubmit}
          className="rounded-none cursor-pointer"
          disabled={
            isUploading || (!message.trim() && attachments.length === 0)
          }
        >
          {isUploading ? (
            <FiLoader className="animate-spin" />
          ) : (
            <LuSendHorizontal />
          )}
        </Button>
      </Flex>
    </div>
  );
}
