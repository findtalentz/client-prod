import { storage } from "@/firebase";
import { clsx, type ClassValue } from "clsx";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(isoString: Date, sort?: boolean) {
  if (sort)
    return new Date(isoString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
    });
  return new Date(isoString).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const pageSize = 10;

export const handleUpload = async (dataUrl: string): Promise<string> => {
  try {
    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // Create a unique filename with timestamp
    const filename = `profile-images/${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);

    // Upload the blob to Firebase Storage
    const snapshot = await uploadBytes(storageRef, blob, {
      contentType: "image/jpeg", // Set content type
    });

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Upload failed");
  }
};

export function capitalizeFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function calculateTimeLeft(deliveryDate: Date) {
  const now = new Date().getTime();
  const delivery = new Date(deliveryDate).getTime();
  const diffMs = delivery - now;

  if (diffMs <= 0) {
    return "Time expired";
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}
