"use client";
import { queryClient } from "@/app/[lang]/query-client-provider";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import useSession from "@/hooks/useSession";
import { handleUpload } from "@/lib/utils";
import apiClient from "@/services/api-client";
import setCanvasPreview from "@/set-canvas-preview";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";
import { Camera } from "lucide-react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  Crop,
  makeAspectCrop,
} from "react-image-crop";
import { BeatLoader } from "react-spinners";

const ASPECT_RATIO = 16 / 5;
const MIN_WIDTH = 400;

const UpdateCoverPhoto = () => {
  const router = useRouter();
  const { data } = useSession();
  const session = data?.data;
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [crop, setCrop] = useState<Crop | undefined>(undefined);
  const [error, setError] = useState<string>("");

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e: Event) => {
        if (error) setError("");
        const { naturalWidth } = e.currentTarget as HTMLImageElement;
        if (naturalWidth < MIN_WIDTH) {
          setError("Image must be at least 400px wide.");
          return setImgSrc("");
        }
      });
      setImgSrc(imageUrl);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = Math.min((MIN_WIDTH / width) * 100, 90);

    const crop = makeAspectCrop(
      { unit: "%", width: cropWidthInPercent },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  if (!session) return null;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-3 right-3 gap-1.5 cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          Edit Cover
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Update Cover Photo</AlertDialogTitle>
          <div className="space-y-4">
            <label className="block mb-3 w-fit">Choose cover photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
            />

            {error && <p className="text-red-400 text-xs">{error}</p>}

            {imgSrc && (
              <div className="flex flex-col items-center relative">
                <ReactCrop
                  crop={crop}
                  onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
                  keepSelection
                  aspect={ASPECT_RATIO}
                  minWidth={200}
                >
                  <NextImage
                    ref={imgRef}
                    src={imgSrc}
                    alt="Upload"
                    style={{ maxHeight: "60vh" }}
                    width={1000}
                    height={20000}
                    onLoad={onImageLoad}
                    className="w-auto h-auto"
                  />
                </ReactCrop>
                {loading && (
                  <div className="w-full h-full bg-primary-dark/60 absolute flex items-center justify-center">
                    <BeatLoader color="#fff" />
                  </div>
                )}
              </div>
            )}

            <canvas
              ref={previewCanvasRef}
              className="mt-4 hidden"
              style={{
                border: "1px solid black",
                objectFit: "contain",
                width: 800,
                height: 250,
              }}
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className={buttonVariants({ variant: "secondary", size: "sm" })}
          >
            Cancel
          </AlertDialogCancel>
          <Button
            disabled={loading || !imgSrc}
            size="sm"
            onClick={async () => {
              setLoading(true);
              if (imgRef.current && previewCanvasRef.current && crop) {
                setCanvasPreview(
                  imgRef.current,
                  previewCanvasRef.current,
                  convertToPixelCrop(
                    crop,
                    imgRef.current.width,
                    imgRef.current.height
                  )
                );
                const dataUrl = previewCanvasRef.current.toDataURL();
                const downloadURL = await handleUpload(dataUrl);
                apiClient
                  .put(`/users/${session._id}`, {
                    coverPhoto: downloadURL,
                  })
                  .then(() => {
                    setLoading(false);
                    setOpen(false);
                    queryClient.invalidateQueries({ queryKey: ["session"] });
                    router.refresh();
                  });
              }
            }}
          >
            {loading ? <BeatLoader color="#fff" /> : "Continue"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateCoverPhoto;
