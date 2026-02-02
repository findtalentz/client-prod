"use client";
import { EditJobApplication } from "@/components/edit-job-application";
import Text from "@/components/ui/text";
import { formatDate } from "@/lib/utils";
import Application from "@/schemas/Application";

import { Avatar, Flex } from "@radix-ui/themes";
import { useState } from "react";

interface Props {
  application: Application;
}

const ApplicationCard = ({ application }: Props) => {
  const [messageLength, setMessageLength] = useState(100);
  return (
    <div>
      <div className="flex-1 p-3 pt-0 border rounded-2xl">
        <Flex align="center" justify="between" className="border-b py-2">
          <div className="flex items-center gap-3">
            <Avatar
              src={application.seller.image}
              fallback="User"
              radius="full"
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                objectFit: "cover",
              }}
            />
            <span>
              {`${application.seller.firstName} ${application.seller.lastName}`}
            </span>
            <Text className="text-gray-500" size="small">
              {formatDate(application.createdAt)}
            </Text>
          </div>

          <EditJobApplication application={application} />
        </Flex>
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
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
