import { buttonVariants } from "@/components/ui/button";
import ApiResponse from "@/schemas/ApiRespose";
import Education from "@/schemas/Education";
import apiClient from "@/services/api-client";
import Link from "next/link";
import { AddEducation } from "./add-education";
import Educations from "./educations";

export default async function EducationsPage() {
  const { data: educations } = await apiClient.get<ApiResponse<Education[]>>(
    "/educations"
  );
  return (
    <div className="pb-20">
      <h2 className="text-primary font-semibold mb-5">Educations</h2>
      {educations && educations.count > 0 && (
        <Educations educations={educations.data} />
      )}
      <AddEducation />
      <div className="flex justify-end mt-8">
        <Link
          className={buttonVariants()}
          href="/profile/seller/portfolios"
        >
          Next
        </Link>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
