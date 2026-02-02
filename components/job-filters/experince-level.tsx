"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import JobFilterBox from "../job-filter-box";
import { Checkbox } from "../ui/checkbox";

const experiences = [
  { label: "Entry Level", value: "entry" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Expert", value: "expert" },
];

function ExperinceLavel() {
  const [isVisible, setVisible] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onFilterExperince = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get("requiredExperienceLevel");

    if (current === value) {
      params.delete("requiredExperienceLevel");
    } else {
      params.set("requiredExperienceLevel", value);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const selectedType = searchParams.get("requiredExperienceLevel");

  return (
    <>
      {isVisible && (
        <JobFilterBox
          title="Experience Level"
          onVisibleChange={() => setVisible(false)}
        >
          <div className="space-y-2">
            {experiences.map((item) => (
              <div key={item.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${item.value}`}
                  checked={selectedType === item.value}
                  onCheckedChange={() => onFilterExperince(item.value)}
                />
                <label
                  htmlFor={`type-${item.value}`}
                  className="text-sm font-medium leading-none"
                >
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </JobFilterBox>
      )}
    </>
  );
}

export default ExperinceLavel;
