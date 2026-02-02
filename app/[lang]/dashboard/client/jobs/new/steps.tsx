"use client";

import { useStepStore } from "@/store";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";

const steps = [
  { id: 1, name: "Overview", link: "/dashboard/client/jobs/new" },
  { id: 2, name: "Skills", link: "/dashboard/client/jobs/new/skills" },
  {
    id: 3,
    name: "Scope & Budget",
    link: "/dashboard/client/jobs/new/scope-budget",
  },
  { id: 4, name: "Preview", link: "/dashboard/client/jobs/new/preview" },
];

const JobPostSteps = () => {
  const setStep = useStepStore((s) => s.setStep);
  const currentStep = useStepStore((s) => s.step);

  useEffect(() => {
    setStep(1);
  }, [setStep]);

  return (
    <div className="relative flex flex-col space-y-6 border-l-2 border-gray-200 pl-6">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <Link
            href={step.link}
            key={step.id}
            className="group relative flex items-center gap-4"
          >
            {/* Step Indicator */}
            <motion.div
              initial={false}
              animate={{
                scale: isActive ? 1.1 : 1,
              }}
              className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-300 
                ${
                  isCompleted
                    ? "bg-primary border-primary text-white shadow-md"
                    : isActive
                    ? "bg-primary border-primary text-white shadow-md"
                    : "bg-white border-gray-300 text-gray-400 group-hover:border-primary/50"
                }`}
            >
              {isCompleted ? "✓" : step.id}
            </motion.div>

            {/* Step Details */}
            <div className="flex flex-col">
              <p
                className={`text-sm font-semibold transition-colors duration-300 
                  ${
                    isActive
                      ? "text-primary"
                      : isCompleted
                      ? "text-gray-800"
                      : "text-gray-500"
                  }`}
              >
                {step.name}
              </p>
              {isActive && (
                <motion.span
                  layoutId="active-step"
                  className="h-0.5 w-6 bg-primary mt-1 rounded-full"
                />
              )}
            </div>

            {/* Connecting Line (vertical) */}
            {index < steps.length - 1 && (
              <div
                className={`absolute left-3 top-6 h-6 w-0.5 ${
                  isCompleted ? "bg-primary" : "bg-gray-200"
                }`}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default JobPostSteps;
