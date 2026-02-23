"use client";
import { cn } from "@/lib/utils";

interface TimeRangeOption {
  label: string;
  value: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  options?: TimeRangeOption[];
}

const defaultOptions: TimeRangeOption[] = [
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
];

export default function TimeRangeToggle({
  value,
  onChange,
  options = defaultOptions,
}: Props) {
  return (
    <div className="flex items-center border rounded-full p-[2px]">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "text-[10px] rounded-full py-1 px-3 cursor-pointer",
            option.value === value && "bg-primary text-white"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
