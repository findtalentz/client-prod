// components/icons.tsx
import { IconType } from "react-icons";
import { BsPaperclip, BsX } from "react-icons/bs";
import { FaAngleLeft, FaCheckCircle } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { FiLoader } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import { LuMessagesSquare, LuPlus } from "react-icons/lu";

interface IconProps {
  name: keyof typeof icons;
  className?: string;
  size?: number;
}

const icons = {
  checkCircle: FaCheckCircle,
  angleLeft: FaAngleLeft,
  message: FaRegMessage,
  send: IoSend,
  messagesSquare: LuMessagesSquare,
  plus: LuPlus,
  loader: FiLoader,
  paperclip: BsPaperclip,
  close: BsX,
  // Add more icons as needed
} satisfies Record<string, IconType>;

export const Icons = ({ name, className, size = 20 }: IconProps) => {
  const IconComponent = icons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent className={className} size={size} />;
};
