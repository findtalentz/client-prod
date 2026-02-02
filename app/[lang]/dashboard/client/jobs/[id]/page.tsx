import MessageSentButton from "@/components/message-sent-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { calculateTimeLeft, cn, formatDate } from "@/lib/utils";
import ApiResponse from "@/schemas/ApiRespose";
import Job from "@/schemas/Job";
import User from "@/schemas/User";
import apiClient from "@/services/api-client";
import { Avatar, Flex } from "@radix-ui/themes";
import { CalendarDays, Clock } from "lucide-react";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";
import { SlLocationPin } from "react-icons/sl";
import Actions from "./actions";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

async function JobDetails({ params }: Props) {
  const { id } = await params;
  const { data: job } = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);
  const { data: user } = await apiClient.get<ApiResponse<User>>(
    "/users/public",
    {
      params: {
        userId: job.data.seller,
      },
    }
  );

  return (
    <div>
      <Flex justify="between" align="center" className="px-1" mb="6">
        <Link
          href="/dashboard/client/jobs"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "gap-2 text-gray-600 hover:text-gray-900"
          )}
        >
          <FaAngleLeft className="h-4 w-4" />
          Back
        </Link>
        <MessageSentButton seller={job.data.seller._id} />
      </Flex>
      <div className="grid grid-cols-1 md:grid-cols-6">
        <div className="mb-6 col-span-1 md:col-span-4">
          <Actions job={job.data} />
        </div>
        <div className="space-y-6 col-span-2">
          <Accordion
            type="single"
            collapsible
            className="border px-2 rounded-xl"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>Job Details</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-5">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-4">
                      {" "}
                      {job.data.title}{" "}
                    </h3>
                    <p className="whitespace-pre-line">
                      {job.data.description || "No description provided"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-4">Job Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-black">Category</p>
                        <p>{job.data.category.name || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="font-medium text-black">Company</p>
                        <p>{job.data.company || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="font-medium text-black">Location</p>
                        <p>{job.data.location || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="font-medium text-black">Job Type</p>
                        <p>{job.data.jobType || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="font-medium text-black">
                          Experience Level
                        </p>
                        <p>
                          {job.data.requiredExperienceLevel || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-black">Duration</p>
                        <p>{job.data.duration || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-4">Skills Required</h3>
                    {job.data.requiredSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {job.data.requiredSkills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-white px-3 py-1 rounded-full"
                          >
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
                        <p className="font-medium text-black">Budget Type</p>
                        <p>{job.data.budgetType || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="font-medium text-black">Budget Amount</p>
                        <p>{job.data.budgetAmount || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion
            type="single"
            collapsible
            className="border px-2 rounded-xl"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>Freelancer Details</AccordionTrigger>
              <AccordionContent>
                <div className="flex gap-5 flex-col w-full items-center mb-6">
                  <Avatar
                    src={user.data.image ?? undefined}
                    fallback={user.data.firstName?.[0] ?? "U"}
                    size="9"
                    radius="full"
                  />
                  <div className="space-y-5">
                    <div>
                      <h2>
                        {`${user.data.firstName ?? ""} ${
                          user.data.lastName ?? ""
                        }`}
                      </h2>
                      <Flex align="center" gap="6">
                        <p className="text-gray-500">{user.data.title ?? ""}</p>
                        {user.data.location && (
                          <p className="text-gray-500 flex items-center gap-1">
                            <SlLocationPin /> {user.data.location}
                          </p>
                        )}
                      </Flex>
                    </div>
                    {user.data.skills && (
                      <Flex wrap="wrap" gap="2">
                        {user.data.skills.map((skill, i) => (
                          <Badge className="bg-primary/60 rounded-full" key={i}>
                            {skill}
                          </Badge>
                        ))}
                      </Flex>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="p-3 rounded-xl flex items-center border gap-10">
            <div className="flex flex-col">
              <p className="flex items-center gap-1">
                <CalendarDays size={16} /> Due Date
              </p>
              <span className="font-semibold text-primary">
                {formatDate(job.data.deliveryDate)}
              </span>
            </div>
            <div className="flex flex-col">
              <p className="flex items-center gap-1">
                <Clock size={16} /> Time Left
              </p>
              <span className="font-semibold text-primary">
                {calculateTimeLeft(job.data.deliveryDate)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
