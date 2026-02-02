"use client";
import useJobCategorys from "@/hooks/useCategorys";
import BudgetFilter from "./job-filters/budget-filter";
import JobCategoryFilter from "./job-filters/categoy-filter";
import ExperinceLavel from "./job-filters/experince-level";
import JobTypeFilter from "./job-filters/job-type";
import JobSize from "./job-filters/project-size";

export default function JobFilters() {
  const { data: categorys } = useJobCategorys();
  return (
    <div className="w-full px-2 space-y-6">
      <BudgetFilter />
      {categorys && <JobCategoryFilter categorys={categorys.data} />}
      <JobTypeFilter />
      <ExperinceLavel />
      <JobSize />
    </div>
  );
}
