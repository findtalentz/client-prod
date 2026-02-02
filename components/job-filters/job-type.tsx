"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import JobFilterBox from "../job-filter-box";
import { Checkbox } from "../ui/checkbox";

const jobTypes = [
  { label: "Fixed", value: "fixed" },
  { label: "Hourly", value: "hourly" },
  { label: "Full Time", value: "full-time" },
];

function JobTypeFilter() {
  const [isVisible, setVisible] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onFilterBudget = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get("jobType");

    if (current === value) {
      params.delete("jobType");
    } else {
      params.set("jobType", value);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const selectedType = searchParams.get("jobType");

  return (
    <>
      {isVisible && (
        <JobFilterBox
          title="Job Types"
          onVisibleChange={() => setVisible(false)}
        >
          <div className="space-y-2">
            {jobTypes.map((item) => (
              <div key={item.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${item.value}`}
                  checked={selectedType === item.value}
                  onCheckedChange={() => onFilterBudget(item.value)}
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

export default JobTypeFilter;
