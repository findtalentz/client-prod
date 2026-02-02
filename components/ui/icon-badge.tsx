import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  text: string;
}

export default function IconBadge({ children, text }: Props) {
  return (
    <div className="flex items-center gap-1 text-[#818181]">
      {children} <span className="text-[13px]">{text}</span>
    </div>
  );
}
