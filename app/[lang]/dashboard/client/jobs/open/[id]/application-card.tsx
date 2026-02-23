"use client";
import AddTalentWishlist from "@/components/add-talent-wishlist";
import FileAttachmentGrid from "@/components/file-attachment-grid";
import MessageSentButton from "@/components/message-sent-button";
import { Badge } from "@/components/ui/badge";
import IconBadge from "@/components/ui/icon-badge";
import Text from "@/components/ui/text";
import useCompletedJobCount from "@/hooks/useCompletedJobCount";
import useSession from "@/hooks/useSession";
import Application from "@/schemas/Application";
import Job from "@/schemas/Job";
import { Avatar, Flex } from "@radix-ui/themes";
import Link from "next/link";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import { Hire } from "../../../_components/hire";

interface Props {
  application: Application;
  job: Job;
}

const ApplicationCard = ({ application, job }: Props) => {
  const { data: user } = useSession();
  const [messageLength, setMessageLength] = useState(100);
  const { data: completedjobs } = useCompletedJobCount(application.seller._id);
  return (
    <div className="flex-1 p-3 border rounded-2xl">
      <div>
        {!application.isViewed && (
          <Badge className="bg-yellow text-primary mb-2">New Application</Badge>
        )}
        <Flex align="center" justify="between" className="py-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-1 md:gap-3 cursor-pointer">
              <Avatar
                className="w-8 h-8 md:w-10 md:h-10"
                src={
                  application.seller.image
                    ? application.seller.image
                    : "/card-1.png"
                }
                fallback="me"
                radius="full"
              />
              <div>
                <Link
                  href={`/dashboard/buyer/talents/${application.seller._id}`}
                  className="text-sm md:text-xl"
                >
                  {application.seller.firstName +
                    " " +
                    application.seller.lastName}
                </Link>
                <div className="flex items-center gap-1 md:gap-5">
                  <Text variant="gray" size="small">
                    {application.seller.title}
                  </Text>
                  {application.seller.location && (
                    <IconBadge text={application.seller.location}>
                      <GrLocation />
                    </IconBadge>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-5">
            <AddTalentWishlist talentId={application.seller._id} />
            {user?.data._id === application.seller._id ? null : (
              <MessageSentButton seller={application.seller._id} />
            )}
            <Hire
              sellerId={application.seller._id}
              amount={job.budgetAmount}
              jobId={job._id}
            />
          </div>
        </Flex>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-4">
          <div className="flex items-center gap-1 md:gap-3">
            <Text>93%</Text>
            <Text size="small" variant="gray">
              Job Success
            </Text>
          </div>
          <div className="flex items-center gap-1 md:gap-3">
            <Text>4.4</Text>
            <div className="flex items-center text-sm text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
          </div>
          {completedjobs && completedjobs.data > 0 && (
            <div className="flex items-center gap-1 md:gap-3">
              <Text> {completedjobs?.data} </Text>
              <Text size="small" variant="gray">
                Total Job
              </Text>
            </div>
          )}
          {application.seller.skills &&
            application.seller.skills.length > 0 && (
              <div className="flex items-center gap-1 md:gap-3">
                <p> {application.seller.skills.length} </p>
                <Text size="small" variant="gray">
                  Skills
                </Text>
              </div>
            )}
        </div>
        <hr className="pt-4" />
      </div>
      <div className="relative">
        <div className="pb-5 pt-2">
          <p className="inline-block">
            {application.message.slice(0, messageLength)}{" "}
            {application.message.length > 100 && messageLength === 100 && (
              <p
                onClick={() => setMessageLength(application.message.length)}
                className="inline-block text-primary font-semibold cursor-pointer"
              >
                Show More
              </p>
            )}
            {application.message.length > 100 &&
              messageLength === application.message.length && (
                <p
                  onClick={() => setMessageLength(100)}
                  className="inline-block text-primary font-semibold cursor-pointer"
                >
                  Show Less
                </p>
              )}
          </p>
        </div>

        <FileAttachmentGrid files={application.attachments} />
      </div>
    </div>
  );
};

export default ApplicationCard;
