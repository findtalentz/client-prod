"use client";
import ImageLightbox from "@/components/image-lightbox";
import { getFileIcon, getFileNameFromUrl } from "@/lib/file-utils";
import Image from "next/image";
import { useState } from "react";
import { FiDownload } from "react-icons/fi";

interface Props {
  files: string[];
  size?: "sm" | "md";
}

export default function FileAttachmentGrid({ files, size = "md" }: Props) {
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  if (!files || files.length === 0) return null;

  const width = size === "sm" ? "w-[90px]" : "w-40";
  const imgSizes = size === "sm" ? "90px" : "160px";

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-3">
        {files.map((file) => {
          const fileName = getFileNameFromUrl(file);
          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);

          return (
            <div
              key={file}
              className={`relative group border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow ${width}`}
            >
              {isImage ? (
                <div
                  className="relative w-full aspect-square cursor-pointer"
                  onClick={() => setLightboxImage({ src: file, alt: fileName })}
                >
                  <Image
                    src={file}
                    fill
                    className="object-cover"
                    alt={fileName}
                    sizes={imgSizes}
                  />
                </div>
              ) : (
                <a
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full aspect-square flex flex-col items-center justify-center p-4 cursor-pointer"
                >
                  <div className="text-3xl mb-2">{getFileIcon(fileName)}</div>
                  <p className="text-xs text-center text-gray-600 truncate w-full">
                    {fileName}
                  </p>
                </a>
              )}

              <a
                href={file}
                download={fileName}
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100"
              >
                <div className="bg-white p-2 rounded-full shadow-lg">
                  <FiDownload className="text-gray-700" />
                </div>
              </a>

              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-2">
                <p className="text-xs text-white truncate">{fileName}</p>
              </div>
            </div>
          );
        })}
      </div>

      {lightboxImage && (
        <ImageLightbox
          src={lightboxImage.src}
          alt={lightboxImage.alt}
          isOpen={!!lightboxImage}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </>
  );
}
