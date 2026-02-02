import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type TextProps = {
  children: ReactNode;
  variant?: "gray" | "light" | "primary";
  size?: "small" | "very-small";
  className?: string;
};

export default function Text({
  children,
  variant,
  size,
  className,
}: TextProps) {
  return (
    <p
      className={cn(
        "text-dark", // Base style
        {
          "!text-[13px]": size === "small",
          "!text-[11px]": size === "very-small",
        },
        {
          "text-gray": variant === "gray",
          "text-white": variant === "light",
          "text-primary": variant === "primary",
        },
        className // Custom classes
      )}
    >
      {children}
    </p>
  );
}
