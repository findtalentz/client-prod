"use client";
import ImageLightbox from "@/components/image-lightbox";
import useChatSocket from "@/hooks/useChatSocket";
import useMessages from "@/hooks/useMessages";
import useSession from "@/hooks/useSession";
import { getFileIcon, getFileNameFromUrl } from "@/lib/file-utils";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { useChatStore } from "@/store";
import { Avatar } from "@radix-ui/themes";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FiDownload } from "react-icons/fi";

export default function Messages() {
  const currentChat = useChatStore((s) => s.currentChat);
  const { data: session } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: messages } = useMessages(currentChat?._id as string);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);
  useChatSocket(currentChat?._id as string);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!currentChat)
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <MessageCircle className="w-9 h-9 text-gray-300" />
        </div>
        <p className="text-base font-medium text-gray-400">
          Select a conversation
        </p>
        <p className="text-sm text-gray-300 mt-1">
          Choose a chat from the sidebar to start messaging
        </p>
      </div>
    );

  if (!messages)
    return <div className="flex-1 bg-gray-50/30" />;

  const userId = session?.data._id;

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/30 px-5 py-4">
      <div className="flex flex-col gap-3">
        {messages.data.map((message, index) => {
          const isOwn = message.sender._id === userId;
          const prevMessage = messages.data[index - 1];
          const isSameSender = prevMessage?.sender._id === message.sender._id;
          const showAvatar = !isSameSender;

          return (
            <div
              key={message._id}
              className={cn(
                "flex gap-2.5 max-w-[75%]",
                isOwn ? "ml-auto flex-row-reverse" : "",
                showAvatar ? "mt-2" : "mt-0"
              )}
            >
              {/* Avatar */}
              {!isOwn && (
                <div className="shrink-0 w-8 pt-1">
                  {showAvatar ? (
                    <Avatar
                      src={message.sender.image}
                      fallback={message.sender.firstName.charAt(0)}
                      radius="full"
                      size="2"
                    />
                  ) : null}
                </div>
              )}

              {/* Message bubble */}
              <div className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}>
                {showAvatar && !isOwn && (
                  <span className="text-xs font-medium text-gray-500 mb-1 ml-1">
                    {message.sender.firstName}
                  </span>
                )}
                {message.message && (
                  <div
                    className={cn(
                      "px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed break-words",
                      isOwn
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-md"
                    )}
                  >
                    {message.message}
                  </div>
                )}

                {/* File attachments */}
                {message.files.length > 0 && (
                  <div className={cn("flex flex-wrap gap-2 mt-1", message.message && "mt-1.5")}>
                    {message.files.map((file) => {
                      const fileName = getFileNameFromUrl(file);
                      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);

                      return (
                        <div
                          key={file}
                          className="relative group rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                          {isImage ? (
                            <div
                              className="relative w-48 h-36 cursor-pointer"
                              onClick={() => setLightboxImage({ src: file, alt: fileName })}
                            >
                              <Image
                                src={file}
                                fill
                                className="object-cover"
                                alt={fileName}
                                sizes="192px"
                              />
                            </div>
                          ) : (
                            <a
                              href={file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-48 h-28 flex flex-col items-center justify-center p-4 bg-gray-50 cursor-pointer"
                            >
                              <div className="text-2xl mb-1.5">
                                {getFileIcon(fileName)}
                              </div>
                              <p className="text-xs text-center text-gray-600 truncate w-full px-2">
                                {fileName}
                              </p>
                            </a>
                          )}

                          <a
                            href={file}
                            download={fileName}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100"
                          >
                            <div className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg">
                              <FiDownload className="text-gray-700 w-4 h-4" />
                            </div>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Timestamp */}
                <span
                  className={cn(
                    "text-[10px] text-gray-400 mt-1 px-1",
                    isOwn ? "text-right" : "text-left"
                  )}
                >
                  {formatDate(message.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {lightboxImage && (
        <ImageLightbox
          src={lightboxImage.src}
          alt={lightboxImage.alt}
          isOpen={!!lightboxImage}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
}
