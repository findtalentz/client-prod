import { buttonVariants } from "@/components/ui/button";
import ApiResponse from "@/schemas/ApiRespose";
import Education from "@/schemas/Education";
import apiClient from "@/services/api-client";
import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { AddEducation } from "./add-education";
import Educations from "./educations";

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function EducationsPage({ params }: Props) {
  const { lang } = await params;
  const { data: educations } = await apiClient.get<ApiResponse<Education[]>>(
    "/educations"
  );
  return (
    <div className="pb-20 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-gray-900">Education</h2>
        </div>
        <p className="text-sm text-gray-500">
          Add your educational background to build credibility
        </p>
      </div>

      {educations && educations.count > 0 && (
        <Educations educations={educations.data} />
      )}

      {(!educations || educations.count === 0) && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-sm text-gray-500 mb-4">No education added yet</p>
          <AddEducation />
        </div>
      )}

      {educations && educations.count > 0 && (
        <AddEducation />
      )}

      <div className="flex justify-end">
        <Link
          className={buttonVariants({ size: "lg" }) + " gap-2"}
          href={`/${lang}/profile/seller/portfolios`}
        >
          Continue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
