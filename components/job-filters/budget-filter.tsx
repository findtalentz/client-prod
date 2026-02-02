"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import JobFilterBox from "../job-filter-box";
import { Checkbox } from "../ui/checkbox";

const budgetTypes = [
  { label: "Fixed Price", value: "fixed" },
  { label: "Custom Offer", value: "custom" },
];

function BudgetFilter() {
  const [isVisible, setVisible] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onFilterBudget = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get("budgetType");

    if (current === value) {
      params.delete("budgetType"); // remove if same selected again
    } else {
      params.set("budgetType", value);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const selectedBudget = searchParams.get("budgetType");

  return (
    <>
      {isVisible && (
        <JobFilterBox title="Budget" onVisibleChange={() => setVisible(false)}>
          <div className="space-y-2">
            {budgetTypes.map((item) => (
              <div key={item.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`budget-${item.value}`}
                  checked={selectedBudget === item.value}
                  onCheckedChange={() => onFilterBudget(item.value)}
                />
                <label
                  htmlFor={`budget-${item.value}`}
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

export default BudgetFilter;
