"use client";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import ApplicationSchema from "@/schemas/Application";
import apiClient from "@/services/api-client";
import { Flex } from "@radix-ui/themes";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Porps {
  application: ApplicationSchema;
}

function Application({ application }: Porps) {
  const router = useRouter();
  return (
    <div
      className="border-b pb-2 last:border-none cursor-pointer"
      onClick={async () => {
        try {
          await apiClient.put(`/applications/${application._id}`, {
            isViewed: true,
          });
          router.refresh();
          router.push(`/dashboard/client/jobs/open/${application.job._id || application.job}`);
        } catch (error) {
          if (error instanceof AxiosError) {
            toast.error(error.message);
          }
        }
      }}
    >
      <Flex align="start" direction="column">
        <Flex align="center" mb="1" gap="2">
          <p className="text-[13px] text-gray-500">
            {formatDate(application.createdAt)}
          </p>
          <Badge
            variant="secondary"
            className="bg-primary-light text-primary-dark mb-1"
          >
            New Application
          </Badge>
        </Flex>
      </Flex>
      <p className="text-sm text-gray-700 line-clamp-2">
        {application.message.slice(0, 50)}
        {application.message.length > 50 && "..."}
      </p>
    </div>
  );
}

export default Application;
