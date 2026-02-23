import { storage } from "@/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const handleUpload = async (dataUrl: string): Promise<string> => {
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    const filename = `profile-images/${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);

    const snapshot = await uploadBytes(storageRef, blob, {
      contentType: "image/jpeg",
    });

    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Upload failed");
  }
};
