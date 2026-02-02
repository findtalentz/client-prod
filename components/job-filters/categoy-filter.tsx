"use client";

import Category from "@/schemas/Category";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import JobFilterBox from "../job-filter-box";
import { Checkbox } from "../ui/checkbox";

interface Props {
  categorys: Category[];
}

function JobCategoryFilter({ categorys }: Props) {
  const [isVisible, setVisible] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onFilterCategory = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get("category");

    if (current === value) {
      params.delete("category");
    } else {
      params.set("category", value);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const selectedCategory = searchParams.get("category");

  return (
    <>
      {isVisible && (
        <JobFilterBox
          title="Job Category"
          onVisibleChange={() => setVisible(false)}
        >
          <div className="space-y-2">
            {categorys.map((category) => (
              <div key={category._id} className="flex items-center space-x-2">
                <Checkbox
                  id={category._id}
                  checked={selectedCategory === category._id}
                  onCheckedChange={() => onFilterCategory(category._id)}
                />
                <label
                  htmlFor={`budget-${category._id}`}
                  className="text-sm font-medium leading-none"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </JobFilterBox>
      )}
    </>
  );
}

export default JobCategoryFilter;
