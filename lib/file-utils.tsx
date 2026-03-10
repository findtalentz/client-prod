"use client";
import FILE_ICONS from "@/schemas/FileIcons";
import { FiFilePlus } from "react-icons/fi";

export function getFileIcon(url: string) {
  const extension = url.split(".").pop()?.toLowerCase() || "";
  return FILE_ICONS[extension] || <FiFilePlus className="text-gray-500" />;
}

export function getFileNameFromUrl(url: string) {
  try {
    const urlObj = new URL(url);
    const pathname = decodeURIComponent(urlObj.pathname);
    // Extract just the filename (last segment after the last /)
    const fullName = pathname.substring(pathname.lastIndexOf("/") + 1);
    // Strip the timestamp prefix (e.g. "1234567890-filename.jpg" -> "filename.jpg")
    return fullName.replace(/^\d{10,}-/, "");
  } catch {
    const decoded = decodeURIComponent(url);
    const fullName = decoded.substring(decoded.lastIndexOf("/") + 1);
    return fullName.replace(/^\d{10,}-/, "");
  }
}
