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
    const pathname = urlObj.pathname;
    return pathname.substring(pathname.lastIndexOf("/") + 1);
  } catch {
    return url.substring(url.lastIndexOf("/") + 1);
  }
}
