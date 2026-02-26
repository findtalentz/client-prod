"use client";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageLightbox({ src, alt, isOpen, onClose }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent shadow-none">
        <div className="relative w-full h-[80vh] flex items-center justify-center">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            sizes="90vw"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
