"use client";

import useDictionary from "@/hooks/useDictionary";
import { useStepStore } from "@/store";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const JobPostSteps = () => {
  const dict = useDictionary();
  const currentStep = useStepStore((s) => s.step);

  const steps = [
    { id: 1, name: dict.jobPost?.overview || "Overview", description: dict.jobPost?.titleCategoryLocation || "Title, category & location" },
    { id: 2, name: dict.jobPost?.skills?.replace(" *", "") || "Skills", description: dict.jobPost?.experienceAndSkills || "Experience & required skills" },
    { id: 3, name: dict.jobPost?.scopeAndBudget || "Scope & Budget", description: dict.jobPost?.durationBudgetDescription || "Duration, budget & description" },
    { id: 4, name: dict.jobPost?.preview || "Preview", description: dict.jobPost?.reviewAndSubmit || "Review & submit" },
  ];

  return (
    <div className="py-4 pr-6">
      {/* Progress header */}
      <div className="mb-6">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          {dict.jobPost?.step || "Step"} {currentStep} {dict.jobPost?.of || "of"} {steps.length}
        </p>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={false}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Steps list */}
      <div className="relative flex flex-col gap-0">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative flex gap-4">
              {/* Vertical connector line */}
              {!isLast && (
                <div className="absolute left-[15px] top-8 w-0.5 h-full -z-0">
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
                      : "#d1d5db",
                  }}
                  transition={{ duration: 0.2 }}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-sm"
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                  ) : (
                    <span
                      className={`text-sm font-semibold ${
                        isActive ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {step.id}
                    </span>
                  )}
                </motion.div>
              </div>

              {/* Step text */}
              <div className="pb-8">
                <p
                  className={`text-sm font-semibold leading-tight transition-colors duration-200 ${
                    isActive
                      ? "text-primary"
                      : isCompleted
                      ? "text-gray-800"
                      : "text-gray-400"
                  }`}
                >
                  {step.name}
                </p>
                <p
                  className={`text-xs mt-0.5 transition-colors duration-200 ${
                    isActive
                      ? "text-gray-600"
                      : isCompleted
                      ? "text-gray-500"
                      : "text-gray-300"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobPostSteps;
