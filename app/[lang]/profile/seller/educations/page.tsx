import ApiResponse from "@/schemas/ApiRespose";
import Education from "@/schemas/Education";
import apiClient from "@/services/api-client";
import { AddEducation } from "./add-education";
import Educations from "./educations";

export default async function EducationsPage() {
  const { data: educations } = await apiClient.get<ApiResponse<Education[]>>(
    "/educations"
  );
  return (
    <div>
      <h1 className="text-primary mb-5">Educations</h1>
      {educations && educations.count > 0 && (
        <Educations educations={educations.data} />
      )}
      <AddEducation />
    </div>
  );
}

export const dynamic = "force-dynamic";
