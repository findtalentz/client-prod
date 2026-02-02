"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SwitcherProps<T extends string> {
  options: readonly T[];
  selected: T;
  onChange: (value: T) => void;
  className?: string;
}

export default function Switcher<T extends string>({
  options,
  selected,
  onChange,
  className,
}: SwitcherProps<T>) {
  return (
    <div
      className={cn(
        "border border-gray-300 rounded-4xl p-0.5 flex w-fit",
        className
      )}
    >
      {options.map((option) => (
        <Button
          key={option}
          onClick={() => onChange(option)}
          className={cn(
            "py-1 px-8 md:px-12 transition-all",
            selected === option ? "bg-primary" : "bg-transparent text-dark"
          )}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
