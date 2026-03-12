import { CardContent, CardHeader } from "@/components/ui/card";
import ApiResponse from "@/schemas/ApiRespose";
import ApplicationSchema from "@/schemas/Application";
import apiClient from "@/services/api-client";
import { Flex } from "@radix-ui/themes";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Application from "./application";
import { getDictionary } from "../../../dictionaries";

export const dynamic = "force-dynamic";

interface Props {
  lang: "en" | "ch";
}

async function NewApplications({ lang }: Props) {
  const dict = await getDictionary(lang);
  const t = dict.dashboard;

  const { data } = await apiClient.get<ApiResponse<ApplicationSchema[]>>(
    "/applications/"
  );

  if (!data.data)
    return (
      <div className="flex flex-col items-center justify-center py-4 text-center text-gray-500">
        {t.client.noNewApplications}
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
            {t.client.newApplications}
          </span>
          {data.count > 6 && (
            <Link
              href={`/${lang}/dashboard/client/jobs/open`}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {t.common.viewAll} <ArrowRight className="h-4 w-4" />
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
