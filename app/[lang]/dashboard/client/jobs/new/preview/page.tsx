"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import useCategory from "@/hooks/useCategory";
import useSession from "@/hooks/useSession";
import { cn } from "@/lib/utils";
import apiClient from "@/services/api-client";
import {
  useJobOverviewStore,
  useJobScopeAndBudgetStore,
  useJobSkillsStore,
  useStepStore,
} from "@/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { handleApiError } from "@/lib/handle-api-error";
import toast from "react-hot-toast";

const JobPreview = () => {
  const overview = useJobOverviewStore((s) => s.overview);
  const clearOverview = useJobOverviewStore((s) => s.clear);
  const setStep = useStepStore((s) => s.setStep);
  const jobSkills = useJobSkillsStore((s) => s.jobSkills);
  const router = useRouter();
  const clearSkills = useJobSkillsStore((s) => s.clear);
  const jobScopeAndBudget = useJobScopeAndBudgetStore(
    (s) => s.jobScopeAndBudget
  );
  const clearJobScopeAndBudget = useJobScopeAndBudgetStore((s) => s.clear);

  const { data: session } = useSession();

  useEffect(() => {
    setStep(4);
  }, [setStep]);

  const handleSubmit = async (): Promise<void> => {
    if (!session) return;
    try {
      if (session.data.identityStatus !== "VERIFIED") {
        toast.error("Please verify your identity before posting jobs");
        return;
      }

      const payload = { ...overview, ...jobSkills, ...jobScopeAndBudget };
      await apiClient.post("/jobs", payload);
      toast.success("Job posted successfully");
      clearOverview();
      clearSkills();
      clearJobScopeAndBudget();
      router.refresh();
      router.push("/dashboard/client/jobs/open");
    } catch (error) {
      handleApiError(error);
    }
  };

  const { data } = useCategory(overview?.category as string);
  console.log(overview);

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Job Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Title</p>
            <p>{overview?.title || "Not specified"}</p>
          </div>
          <div>
            <p className="font-medium">Category</p>
            <p>{data?.data.name || "Not specified"}</p>
          </div>
          <div>
            <p className="font-medium">Company</p>
            <p>{overview?.company || "Not specified"}</p>
          </div>
          <div>
            <p className="font-medium">Location</p>
            <p>{overview?.location || "Not specified"}</p>
          </div>
          <div>
            <p className="font-medium">Job Type</p>
            <p>{overview?.jobType || "Not specified"}</p>
          </div>
          <div>
            <p className="font-medium">Experience Level</p>
            <p>{jobSkills?.requiredExperienceLevel || "Not specified"}</p>
          </div>
          <div>
            <p className="font-medium">Duration</p>
            <p>{jobScopeAndBudget?.duration || "Not specified"}</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Skills Required</h3>
        {jobSkills && jobSkills.requiredSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {jobSkills?.requiredSkills.map((skill) => (
              <span key={skill} className="bg-white px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p>No skills specified</p>
        )}
      </div>
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Budget Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Budget Type</p>
            <p>{jobScopeAndBudget?.budgetType || "Not specified"}</p>
          </div>
          <div>
            <p className="font-medium">Budget Amount</p>
            <p>{jobScopeAndBudget?.budgetAmount || "Not specified"}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Job Description</h3>
        <p className="whitespace-pre-line">
          {jobScopeAndBudget?.description || "No description provided"}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/buyer/jobs"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Save draft and exit
        </Link>
        <Button onClick={handleSubmit}>Submit Job</Button>
      </div>
    </div>
  );
};

export default JobPreview;
