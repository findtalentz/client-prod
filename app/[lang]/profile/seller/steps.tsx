"use client";
import { cn } from "@/lib/utils";
import { useStepStore } from "@/store";
import Link from "next/link";
import { useEffect } from "react";

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

  useEffect(() => {
    setStep(1);
  }, [setStep]);

  return (
    <div className="flex flex-col">
      {steps.map((step) => (
        <div
          key={step.id}
          className={cn(
            "flex items-start gap-2 pb-12",
            steps.length !== step.id && "border-l-2 border-gray-300"
          )}
        >
          <div
            className={cn(
              "-ml-2.5 w-5 h-5 bg-primary/50 flex items-center justify-center rounded-full text-white text-xs font-semibold",
              currentStep >= step.id && "bg-primary"
            )}
          >
            {step.id}
          </div>
          <div onClick={() => setStep(step.id)} className="flex-1 -mt-1">
            <Link
              href={step.url}
              className={cn(
                "text-primary",
                steps.length > step.id && "text-primary-dark"
              )}
            >
              {step.label}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
