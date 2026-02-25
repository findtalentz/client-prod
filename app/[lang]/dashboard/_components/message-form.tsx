"use client";
import { queryClient } from "@/app/[lang]/query-client-provider";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useFilesUpload } from "@/hooks/useFilesUpload";
import useSession from "@/hooks/useSession";
import apiClient from "@/services/api-client";
import { useChatStore } from "@/store";
import { Loader2, Paperclip, Send, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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

  if (!currentChat || !user) return <div className="h-0" />;

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

  const canSend = !isUploading && (message.trim() || attachments.length > 0);

  return (
    <div className="border-t border-gray-100 bg-white">
      {/* Attachment preview strip */}
      {(attachments.length > 0 || isUploading) && (
        <div className="px-4 pt-3 pb-1 flex gap-2 overflow-x-auto">
          {attachments.map((file, index) => (
            <div
              key={`${file.url}-${index}`}
              className="relative shrink-0 w-16 h-16 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 group"
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
                  <span className="text-[10px] text-center text-gray-500 p-1 break-all leading-tight">
                    {file.name}
                  </span>
                </div>
              )}

              {uploadProgress[file.name] !== undefined &&
                uploadProgress[file.name] < 100 && (
                  <div className="absolute bottom-0 left-0 right-0 p-0.5">
                    <Progress
                      value={uploadProgress[file.name]}
                      className="h-1 rounded-none"
                    />
                  </div>
                )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeAttachment(index);
                }}
                className="absolute -top-0.5 -right-0.5 p-0.5 bg-gray-800 rounded-full hover:bg-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={isUploading}
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}

          {isUploading && attachments.length === 0 && (
            <div className="flex items-center justify-center w-full py-2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400 mr-2" />
              <span className="text-xs text-gray-400">Uploading...</span>
            </div>
          )}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
            disabled={isUploading}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
            onClick={triggerFileInput}
            disabled={isUploading}
          >
            <Paperclip className="w-4 h-4" />
          </Button>
        </div>

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 text-sm bg-gray-100 rounded-full border-0 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-gray-50 transition-all"
          disabled={isUploading}
        />

        <Button
          onClick={handleSubmit}
          disabled={!canSend}
          size="icon"
          className="h-9 w-9 rounded-full bg-primary hover:bg-primary-dark disabled:bg-gray-200 disabled:text-gray-400 transition-colors cursor-pointer"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
