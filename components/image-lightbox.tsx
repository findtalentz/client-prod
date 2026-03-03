"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Download, X } from "lucide-react";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

function handleDownload(src: string, alt: string) {
  fetch(src)
    .then((res) => res.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = alt || "image";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
}

export default function ImageLightbox({ src, alt, isOpen, onClose }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] h-[95vh] max-w-none sm:max-w-none max-h-none p-0 border-none bg-black/80 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden [&>[data-slot=dialog-close]]:hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain p-4"
            sizes="95vw"
          />

          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={() => handleDownload(src, alt)}
              className="size-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer"
            >
              <Download className="size-5" />
            </button>
            <button
              onClick={onClose}
              className="size-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
