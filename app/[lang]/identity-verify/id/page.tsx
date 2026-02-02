"use client";
import { queryClient } from "@/app/[lang]/query-client-provider";
import { storage } from "@/firebase";
import apiClient from "@/services/api-client";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

type UploadState = {
  front: string;
  back: string;
  uploading: "front" | "back" | null;
};

export default function IDVerification() {
  const [idImages, setIdImages] = useState<UploadState>({
    front: "",
    back: "",
    uploading: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleUpload = useCallback(
    async (side: "front" | "back", e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const validTypes = ["image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a JPG or PNG image");
        return;
      }

      if (file.size > maxSize) {
        toast.error("Image must be less than 5MB");
        return;
      }

      setIdImages((prev) => ({ ...prev, uploading: side }));

      try {
        const storageRef = ref(
          storage,
          `id-verification/${side}-${Date.now()}`
        );
        await uploadBytesResumable(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setIdImages((prev) => ({ ...prev, [side]: downloadURL }));
        toast.success(`${side.toUpperCase()} uploaded successfully`);
      } catch (error) {
        toast.error(`Failed to upload ${side} image`);
        console.error("Upload error:", error);
      } finally {
        setIdImages((prev) => ({ ...prev, uploading: null }));
      }
    },
    []
  );

  const handleRemove = (side: "front" | "back") => {
    setIdImages((prev) => ({ ...prev, [side]: "" }));
  };

  const handleSubmit = async () => {
    if (!idImages.front || !idImages.back) {
      toast.error("Please upload both front and back images");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post("/verifications/id", {
        frontImage: idImages.front,
        backImage: idImages.back,
      });
      toast.success("ID verification submitted successfully!");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/identity-verify/submitted");
    } catch (error) {
      toast.error("Failed to submit ID verification");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = idImages.front && idImages.back;

  return (
    <div className="min-h-[calc(100dvh-70px)] flex items-center justify-center p-2">
      <div className="w-full md:w-[900px] bg-white rounded-xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">ID Verification</h1>
          <p className="text-gray-600">
            Please upload both sides of your government-issued ID for
            verification.
            <br />
            <Link
              href="/privacy-policy"
              className="text-primary hover:underline"
            >
              View our Privacy Policy
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(["front", "back"] as const).map((side) => (
            <div key={side} className="space-y-3">
              <h3 className="font-medium capitalize">{side} side</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 relative hover:border-primary transition-colors">
                {idImages[side] ? (
                  <>
                    <Image
                      src={idImages[side]}
                      alt={`ID ${side} side`}
                      fill
                      className="object-contain p-2"
                    />
                    <button
                      onClick={() => handleRemove(side)}
                      className="absolute top-2 right-2 w-6 h-6 cursor-pointer bg-red-500 text-white flex items-center justify-center rounded-full hover:bg-red-600 transition-colors"
                      disabled={idImages.uploading === side || isSubmitting}
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUpload(side, e)}
                      disabled={idImages.uploading === side || isSubmitting}
                    />
                    {idImages.uploading === side ? (
                      <div className="flex flex-col items-center gap-2">
                        <BeatLoader size={8} />
                        <span className="text-sm text-gray-500">
                          Uploading...
                        </span>
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 mx-auto text-gray-400 mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="text-sm text-gray-700">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          JPG or PNG (max 5MB)
                        </p>
                      </div>
                    )}
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || !!idImages.uploading || isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium ${
              canSubmit
                ? "bg-primary text-white hover:bg-primary-dark"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            } transition-colors`}
          >
            {isSubmitting || idImages.uploading ? (
              <span className="flex items-center justify-center gap-2">
                <BeatLoader size={8} color="white" />
                {isSubmitting ? "Submitting..." : "Processing..."}
              </span>
            ) : (
              "Submit Verification"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
