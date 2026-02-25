import { CardContent, CardHeader } from "@/components/ui/card";
import ApiResponse from "@/schemas/ApiRespose";
import ApplicationSchema from "@/schemas/Application";
import apiClient from "@/services/api-client";
import { Flex } from "@radix-ui/themes";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Application from "./application";

export const dynamic = "force-dynamic";

async function NewApplications() {
  const { data } = await apiClient.get<ApiResponse<ApplicationSchema[]>>(
    "/applications/"
  );

  if (!data.data)
    return (
      <div className="flex flex-col items-center justify-center py-4 text-center text-gray-500">
        No new applications
      </div>
    );

  const applications = data.data.filter(
    (application) => application.job.status === "OPEN"
  );

  return (
    <div className="shadow py-4 rounded-3xl! overflow-hidden! border">
      <CardHeader>
        <Flex align="center" justify="between" mb="3">
          <span className="text-primary font-semibold text-[18px]">
            New Applications
          </span>
          {data.count > 6 && (
            <Link
              href="/dashboard/client/jobs/open"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </Flex>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {applications.map((application) => (
            <Application key={application._id} application={application} />
          ))}
        </div>
      </CardContent>
    </div>
  );
}

export default NewApplications;
