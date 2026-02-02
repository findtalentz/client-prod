import Text from "@/components/ui/text";
import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
  onVisibleChange?: () => void;
}

export default function JobFilterBox({
  title,
  children,
  onVisibleChange,
}: Props) {
  return (
    <div className="rounded-xl p-3 border border-gray-400 relative">
      <div
        onClick={onVisibleChange}
        className="absolute top-3 right-3 w-3 h-0.5 bg-black cursor-pointer"
      ></div>
      <Text className="mb-2 font-semibold"> {title} </Text>
      {children}
    </div>
  );
}
