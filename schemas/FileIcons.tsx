"use client";
import { JSX } from "react";
import {
  FiCode,
  FiFile,
  FiFileText,
  FiImage,
  FiMusic,
  FiVideo,
} from "react-icons/fi";
import { GoFileZip } from "react-icons/go";

const FILE_ICONS: { [key: string]: JSX.Element } = {
  pdf: <FiFile className="text-red-500" />,
  txt: <FiFileText className="text-blue-500" />,
  doc: <FiFileText className="text-blue-600" />,
  docx: <FiFileText className="text-blue-600" />,
  xls: <FiFileText className="text-green-600" />,
  xlsx: <FiFileText className="text-green-600" />,
  ppt: <FiFileText className="text-orange-600" />,
  pptx: <FiFileText className="text-orange-600" />,
  jpg: <FiImage className="text-purple-500" />,
  jpeg: <FiImage className="text-purple-500" />,
  png: <FiImage className="text-purple-500" />,
  gif: <FiImage className="text-purple-500" />,
  mp3: <FiMusic className="text-yellow-500" />,
  wav: <FiMusic className="text-yellow-500" />,
  mp4: <FiVideo className="text-red-600" />,
  mov: <FiVideo className="text-red-600" />,
  avi: <FiVideo className="text-red-600" />,
  zip: <GoFileZip className="text-gray-500" />,
  rar: <GoFileZip className="text-gray-500" />,
  js: <FiCode className="text-yellow-400" />,
  ts: <FiCode className="text-blue-400" />,
  json: <FiCode className="text-gray-400" />,
  html: <FiCode className="text-orange-500" />,
  css: <FiCode className="text-blue-500" />,
};

export default FILE_ICONS;
