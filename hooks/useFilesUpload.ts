"use client";
import { storage } from "@/firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { ChangeEvent, useCallback, useRef, useState } from "react";

type UploadResult = {
  name: string;
  url: string;
  type: string;
  size: number;
  storagePath: string;
};

export const useFilesUpload = (defaultPath: string = "uploads") => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const [isUploading, setIsUploading] = useState(false);
  const [attachments, setAttachments] = useState<UploadResult[]>([]);

  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) return;
      const selectedFiles = Array.from(e.target.files);
      await handleUpload(selectedFiles);
    },
    []
  );

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleUpload = useCallback(
    async (filesToUpload: File[], customPath?: string) => {
      if (!filesToUpload.length) return [];

      let uploadPath = customPath || defaultPath;
      if (!uploadPath) {
        console.error("Using fallback upload path");
        uploadPath = "uploads";
      }

      setIsUploading(true);
      try {
        const uploadPromises = filesToUpload.map((file) => {
          return new Promise<UploadResult>(async (resolve, reject) => {
            const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
            const storagePath = `${uploadPath}/${filename}`;
            const storageRef = ref(storage, storagePath);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress((prev) => ({
                  ...prev,
                  [file.name]: progress,
                }));
              },
              (error) => {
                console.error("Upload error:", error);
                reject(error);
              },
              async () => {
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );
                const result = {
                  name: file.name,
                  url: downloadURL,
                  type: file.type,
                  size: file.size,
                  storagePath,
                };
                setAttachments((prev) => [...prev, result]);
                resolve(result);
              }
            );
          });
        });

        await Promise.all(uploadPromises);
        return attachments;
      } catch (error) {
        console.error("Error uploading files:", error);
        return [];
      } finally {
        setIsUploading(false);
      }
    },
    [defaultPath]
  );

  const removeAttachment = useCallback(
    async (index: number) => {
      if (index < 0 || index >= attachments.length) return;

      const attachmentToRemove = attachments[index];
      try {
        const fileRef = ref(storage, attachmentToRemove.storagePath);
        await deleteObject(fileRef);
        setAttachments((prev) => prev.filter((_, i) => i !== index));
      } catch (error) {
        console.error("Error removing attachment:", error);
        setAttachments((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [attachments]
  );

  const resetAttachments = useCallback(() => {
    setAttachments([]);
    setUploadProgress({});
  }, []);

  return {
    fileInputRef,
    isUploading,
    uploadProgress,
    attachments,
    handleFileChange,
    triggerFileInput,
    handleUpload,
    removeAttachment,
    resetAttachments,
  };
};
