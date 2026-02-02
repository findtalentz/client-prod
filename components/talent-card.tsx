"use client";
import IconBadge from "@/components/ui/icon-badge";
import Text from "@/components/ui/text";
import useCompletedJobCount from "@/hooks/useCompletedJobCount";
import useSession from "@/hooks/useSession";
import { Talent } from "@/schemas/Talent";
import { Avatar } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import AddTalentWishlist from "./add-talent-wishlist";
import MessageSentButton from "./message-sent-button";

interface Props {
  talent: Talent;
}

export default function TalentCard({ talent }: Props) {
  const { data: user } = useSession();
  const { data: completedjobs } = useCompletedJobCount(talent._id);
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow">
      <Image
        src="/card-1.png"
        width={560}
        height={220}
        alt="talent"
        className="w-full h-auto object-cover"
      />
      <div className="py-4 px-3 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1 md:gap-3 cursor-pointer">
            <Avatar
              className="w-8 h-8 md:w-10 md:h-10"
              src={talent.image ? talent.image : "/card-1.png"}
              fallback="me"
              radius="full"
            />
            <div>
              <Link href={`/hire/${talent._id}`} className="text-sm md:text-xl">
                {talent.firstName + " " + talent.lastName}
              </Link>
              <div className="flex items-center gap-1 md:gap-5">
                {talent.title && (
                  <Text variant="gray" size="small">
                    {talent.title}
                  </Text>
                )}
                {talent.location && (
                  <IconBadge text={talent.location}>
                    <GrLocation />
                  </IconBadge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-5">
            <AddTalentWishlist talentId={talent._id} />
            {user?.data._id === talent._id ? null : (
              <MessageSentButton seller={talent._id} />
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
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
              <Text> {completedjobs.data} </Text>
              <Text size="small" variant="gray">
                Total Job
              </Text>
            </div>
          )}
          {talent.skills && talent.skills.length > 0 && (
            <div className="flex items-center gap-1 md:gap-1">
              <Text> {talent.skills.length} </Text>
              <Text size="small" variant="gray">
                Skills
              </Text>
            </div>
          )}
        </div>
        <hr className="text-gray-300" />
        <Text size="small">
          {talent && talent.about && talent.about.slice(0, 200)} ...
        </Text>
      </div>
    </div>
  );
}
