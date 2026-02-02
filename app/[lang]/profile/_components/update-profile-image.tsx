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
import { Flex } from "@radix-ui/themes";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  Crop,
  makeAspectCrop,
} from "react-image-crop";
import { BeatLoader } from "react-spinners";

const ASPECT_RATIO = 4 / 4;
const MIN_DIMENSION = 150;

const UpdateProfileImage = () => {
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
        const { naturalWidth, naturalHeight } =
          e.currentTarget as HTMLImageElement;
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setError("Image must be at least 150 x 150 pixels.");
          return setImgSrc("");
        }
      });
      setImgSrc(imageUrl);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
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
      <AlertDialogTrigger className="bg-transparent hover:bg-transparent">
        <Flex
          align="center"
          justify="center"
          className="w-9 h-9 rounded-full bg-white text-black border cursor-pointer"
        >
          <FaRegEdit />
        </Flex>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Profile Image</AlertDialogTitle>
          <div className="space-y-4">
            <label className="block mb-3 w-fit">Choose profile photo</label>
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
                  circularCrop
                  keepSelection
                  aspect={ASPECT_RATIO}
                  minWidth={MIN_DIMENSION}
                >
                  <NextImage
                    ref={imgRef}
                    src={imgSrc}
                    alt="Upload"
                    style={{ maxHeight: "70vh" }}
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
                width: 150,
                height: 150,
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
                    image: downloadURL,
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

export default UpdateProfileImage;
