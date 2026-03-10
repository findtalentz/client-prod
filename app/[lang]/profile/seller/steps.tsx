"use client";

import { useStepStore } from "@/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

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
    const pathWithoutLang = pathname.replace(/^\/[a-z]{2}/, "");

    let matchedStep = 1;
    let longestMatch = 0;
    for (const step of steps) {
      if (pathWithoutLang === step.url) {
        matchedStep = step.id;
        break;
      }
      if (
        pathWithoutLang.startsWith(step.url + "/") &&
        step.url.length > longestMatch
      ) {
        longestMatch = step.url.length;
        matchedStep = step.id;
      }
    }
    setStep(matchedStep);
  }, [pathname, steps, setStep]);

  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="relative flex gap-3.5">
            {/* Vertical connector line */}
            {!isLast && (
              <div className="absolute left-[13px] top-7 w-0.5 h-[calc(100%-4px)] -z-0">
                <motion.div
                  className="w-full bg-primary origin-top"
                  initial={false}
                  animate={{ scaleY: isCompleted ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ height: "100%" }}
                />
                <div className="absolute inset-0 bg-gray-200 -z-10" />
              </div>
            )}

            {/* Step circle */}
            <div className="flex-shrink-0 z-10">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isCompleted
                    ? "var(--primary)"
                    : isActive
                      ? "var(--primary)"
                      : "#ffffff",
                  borderColor: isCompleted
                    ? "var(--primary)"
                    : isActive
                      ? "var(--primary)"
                      : "#e5e7eb",
                }}
                transition={{ duration: 0.2 }}
                className="w-7 h-7 rounded-full border-2 flex items-center justify-center"
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                ) : (
                  <span
                    className={`text-xs font-semibold ${
                      isActive ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {step.id}
                  </span>
                )}
              </motion.div>
            </div>

            {/* Step label */}
            <div className="pb-8 pt-0.5">
              <Link
                href={step.url}
                onClick={() => setStep(step.id)}
                className={`text-[13px] font-medium leading-tight transition-colors duration-200 ${
                  isActive
                    ? "text-primary font-semibold"
                    : isCompleted
                      ? "text-gray-700"
                      : "text-gray-400"
                }`}
              >
                {step.label}
              </Link>
              {isActive && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] text-gray-400 mt-0.5"
                >
                  Step {step.id} of {steps.length}
                </motion.p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
