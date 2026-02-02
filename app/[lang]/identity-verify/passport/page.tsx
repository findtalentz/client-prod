"use client";
import { queryClient } from "@/app/[lang]/query-client-provider";
import Text from "@/components/ui/text";
import { storage } from "@/firebase";
import apiClient from "@/services/api-client";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

function Passport() {
  const [image, setImage] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 50 * 1024 * 1024; // 50MB

      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file format. Please upload JPG or PNG.");
        return;
      }

      if (file.size > maxSize) {
        toast.error("File size exceeds 50MB limit.");
        return;
      }

      setIsUploading(true);

      try {
        const storageRef = ref(storage, `portfolio/${Date.now()}_${file.name}`);
        await uploadBytesResumable(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setImage(downloadURL);
        toast.success("Image uploaded successfully");
      } catch (error) {
        toast.error("Failed to upload image");
        console.error("Upload error:", error);
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  const handleSubmit = async () => {
    if (!image) {
      toast.error("Please upload an image first");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post("/verifications/passport", { passportImage: image });
      toast.success("Passport submitted successfully!");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/identity-verify/submitted");
    } catch (error) {
      toast.error("Failed to submit passport");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100dvh-70px)] p-4">
      <div className="flex flex-col items-center gap-6 w-full md:w-[600px]">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">Upload Your Passport</h2>
          <p className="text-sm text-gray-600">
            Financial regulation require us to verify your identity, Please have
            a look for our{" "}
            <Link
              href="/privacy-policy"
              className="text-primary hover:underline"
            >
              Privacy Policy
            </Link>{" "}
            for more information about how we store and use your data.
          </p>
        </div>

        {image ? (
          <div className="w-full h-[350px]">
            <div className="h-full border-2 border-dashed border-primary rounded-2xl overflow-hidden relative">
              <Image
                src={image}
                width={650}
                height={550}
                className="w-full max-h-[350px] object-cover"
                alt="Passport preview"
              />
              <input
                onChange={handleImageUpload}
                id="passport-image"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                type="file"
                accept="image/jpeg, image/png"
                disabled={isUploading}
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-[200px] md:h-[350px] relative">
            <div className="h-full border-2 border-dashed border-primary rounded-xl flex items-center justify-center">
              <input
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                type="file"
                accept="image/jpeg, image/png"
                disabled={isUploading}
              />
              <div className="text-center p-4">
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <BeatLoader size={8} color="#3B82F6" />
                    <span className="text-sm text-gray-500">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <Text className="text-gray-700">
                      <span className="text-primary font-medium">Upload</span>{" "}
                      image or drag and drop
                    </Text>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG formats, up to 50MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 w-full">
          {image && (
            <button
              onClick={() => setImage("")}
              className="flex-1 px-4 py-2 text-sm text-red-500 hover:text-red-700 transition-colors border border-red-300 rounded-lg"
              disabled={isUploading || isSubmitting}
            >
              Remove Image
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!image || isUploading || isSubmitting}
            className={`flex-1 px-4 py-2 text-sm rounded-lg ${
              image
                ? "bg-primary text-white hover:bg-primary-dark"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            } transition-colors`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <BeatLoader size={8} color="white" />
                Submitting...
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

export default Passport;
