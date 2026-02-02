"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import JobFilterBox from "../job-filter-box";
import { Checkbox } from "../ui/checkbox";

const jobSizes = [
  { label: "Large", value: "large" },
  { label: "Medium", value: "medium" },
  { label: "Small", value: "small" },
];

function JobSize() {
  const [isVisible, setVisible] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onFilterJobJize = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get("duration");

    if (current === value) {
      params.delete("duration");
    } else {
      params.set("duration", value);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const selectedType = searchParams.get("duration");

  return (
    <>
      {isVisible && (
        <JobFilterBox
          title="Project Size"
          onVisibleChange={() => setVisible(false)}
        >
          <div className="space-y-2">
            {jobSizes.map((item) => (
              <div key={item.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${item.value}`}
                  checked={selectedType === item.value}
                  onCheckedChange={() => onFilterJobJize(item.value)}
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

export default JobSize;
