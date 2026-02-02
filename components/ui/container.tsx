import { cn } from "@/lib/utils";
import { ElementType, ReactNode } from "react";

interface ContainerProps {
  className?: string;
  children: ReactNode;
  as?: ElementType;
  maxWidth?: string;
}

export default function Container({
  className,
  children,
  as: Tag = "div",
  maxWidth = "1174px",
}: ContainerProps) {
  return (
    <Tag className={cn("w-full mx-auto !px-3", className)} style={{ maxWidth }}>
      {children}
    </Tag>
  );
}

// Default props (if needed)
Container.defaultProps = {
  className: "",
  as: "div",
  maxWidth: "1174px",
};
