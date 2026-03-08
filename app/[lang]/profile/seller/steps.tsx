"use client";
import { cn } from "@/lib/utils";
import { useStepStore } from "@/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { FaCheck } from "react-icons/fa";

interface Step {
  id: number;
  label: string;
  url: string;
}

interface Props {
  steps: Step[];
}

export default function Steps({ steps }: Props) {
  const setStep = useStepStore((s) => s.setStep);
  const currentStep = useStepStore((s) => s.step);
  const pathname = usePathname();

  useEffect(() => {
    // Find the matching step based on current URL
    const pathWithoutLang = pathname.replace(/^\/[a-z]{2}/, "");

    let matchedStep = 1;
    for (const step of steps) {
      if (pathWithoutLang === step.url || pathWithoutLang.startsWith(step.url + "/")) {
        matchedStep = step.id;
      }
    }
    setStep(matchedStep);
  }, [pathname, steps, setStep]);

  return (
    <div className="flex flex-col">
      {steps.map((step) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <div
            key={step.id}
            className={cn(
              "flex items-start gap-3 pb-8",
              steps.length !== step.id && "border-l-2 ml-[9px]",
              isCompleted ? "border-primary" : "border-gray-200"
            )}
          >
            <div
              className={cn(
                "-ml-[19px] w-5 h-5 flex items-center justify-center rounded-full text-xs font-semibold shrink-0 transition-colors",
                isCompleted && "bg-primary text-white",
                isActive && "bg-primary text-white ring-2 ring-primary/30",
                !isCompleted && !isActive && "bg-gray-200 text-gray-500"
              )}
            >
              {isCompleted ? <FaCheck className="text-[9px]" /> : step.id}
            </div>
            <Link
              href={step.url}
              onClick={() => setStep(step.id)}
              className={cn(
                "text-sm -mt-0.5 transition-colors",
                isActive && "text-primary font-semibold",
                isCompleted && "text-primary",
                !isCompleted && !isActive && "text-gray-400"
              )}
            >
              {step.label}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
