"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { useEffect, useState } from "react";
import { handleApiError } from "@/lib/handle-api-error";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  BarChart2,
  Tag,
  FileText,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

const durationLabels: Record<string, string> = {
  large: "More than 6 months",
  medium: "3 – 6 months",
  small: "1 – 3 months",
};

const experienceLabels: Record<string, string> = {
  entry: "Entry Level",
  intermediate: "Intermediate",
  expert: "Expert",
};

const experienceColors: Record<string, string> = {
  entry: "bg-blue-50 text-blue-700 border-blue-200",
  intermediate: "bg-amber-50 text-amber-700 border-amber-200",
  expert: "bg-purple-50 text-purple-700 border-purple-200",
};

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      setIsSubmitting(true);
      const payload = { ...overview, ...jobSkills, ...jobScopeAndBudget };
      await apiClient.post("/jobs", payload);
      toast.success("Job posted successfully");
      clearOverview();
      clearSkills();
      clearJobScopeAndBudget();
      router.push("/dashboard/client/jobs/open");
    } catch (error) {
      handleApiError(error);
      setIsSubmitting(false);
    }
  };

  const { data: categoryData } = useCategory(overview?.category as string);
  const expLevel = jobSkills?.requiredExperienceLevel ?? "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold">Preview Your Job Post</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Review all details before publishing. You can go back to edit any
          section.
        </p>
      </div>

      {/* Job title hero */}
      <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Job Title
            </p>
            <h3 className="text-2xl font-bold text-foreground">
              {overview?.title || "Untitled Job"}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {categoryData?.data.name && (
                <Badge variant="secondary" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {categoryData.data.name}
                </Badge>
              )}
              {overview?.jobType && (
                <Badge variant="outline" className="text-xs capitalize">
                  <Briefcase className="w-3 h-3 mr-1" />
                  {overview.jobType}
                </Badge>
              )}
              {expLevel && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md border",
                    experienceColors[expLevel] ??
                      "bg-gray-50 text-gray-700 border-gray-200"
                  )}
                >
                  <BarChart2 className="w-3 h-3" />
                  {experienceLabels[expLevel] ?? expLevel}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Budget
            </p>
            <p className="text-3xl font-bold text-primary">
              ${jobScopeAndBudget?.budgetAmount ?? "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="rounded-xl border p-6">
        <h4 className="text-sm font-semibold mb-4">Job Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InfoRow
            icon={<MapPin className="w-4 h-4" />}
            label="Location"
            value={overview?.location || "Not specified"}
          />
          <InfoRow
            icon={<Briefcase className="w-4 h-4" />}
            label="Job Type"
            value={overview?.jobType || "Not specified"}
          />
          <InfoRow
            icon={<Clock className="w-4 h-4" />}
            label="Duration"
            value={
              durationLabels[jobScopeAndBudget?.duration ?? ""] ||
              "Not specified"
            }
          />
          <InfoRow
            icon={<DollarSign className="w-4 h-4" />}
            label="Budget Amount"
            value={
              jobScopeAndBudget?.budgetAmount
                ? `$${jobScopeAndBudget.budgetAmount}`
                : "Not specified"
            }
          />
        </div>
      </div>

      {/* Skills */}
      <div className="rounded-xl border p-6">
        <h4 className="text-sm font-semibold mb-4">Required Skills</h4>
        {jobSkills && jobSkills.requiredSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {jobSkills.requiredSkills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="px-3 py-1 text-sm font-medium"
              >
                {skill}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No skills specified</p>
        )}
      </div>

      {/* Description */}
      <div className="rounded-xl border p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm font-semibold">Job Description</h4>
        </div>
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
          {jobScopeAndBudget?.description || "No description provided"}
        </p>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/client/jobs"
          className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
        >
          <ArrowLeft className="w-4 h-4" />
          Save draft and exit
        </Link>
        <Button
          size="lg"
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="gap-2 px-8"
        >
          {isSubmitting ? (
            <BeatLoader size={8} color="white" />
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Post Job
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default JobPreview;
