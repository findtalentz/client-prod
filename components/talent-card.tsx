"use client";
import useCompletedJobCount from "@/hooks/useCompletedJobCount";
import useSellerRating from "@/hooks/useSellerRating";
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
  const { data: reviewsData } = useSellerRating(talent._id);

  const reviews = reviewsData?.data || [];
  const avgRating = reviews.length > 0
    ? parseFloat((reviews.reduce((sum, r) => sum + r.averageRating, 0) / reviews.length).toFixed(1))
    : 0;
  const totalReviews = reviews.length;
  const completedCount = completedjobs?.data || 0;
  const jobSuccess = completedCount > 0 && totalReviews > 0
    ? Math.round((totalReviews / completedCount) * 100)
    : 0;
  return (
    <Link href={`/hire/${talent._id}`} className="block">
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow hover:shadow-md transition-shadow cursor-pointer">
      <div className="relative w-full h-40 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5">
        <Image
          src={talent.coverPhoto || "/card-1.png"}
          fill
          alt="talent"
          className="object-cover"
        />
      </div>
      <div className="p-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar
              className="w-7 h-7"
              src={talent.image ? talent.image : "/card-1.png"}
              fallback="me"
              radius="full"
            />
            <div>
              <Link href={`/hire/${talent._id}`} className="text-sm font-medium leading-tight">
                {talent.firstName + " " + talent.lastName}
              </Link>
              <div className="flex items-center gap-2">
                {talent.title && (
                  <span className="text-[11px] text-gray-500 truncate max-w-[120px]">
                    {talent.title}
                  </span>
                )}
                {talent.location && (
                  <span className="flex items-center gap-0.5 text-[11px] text-gray-400">
                    <GrLocation className="w-2.5 h-2.5" />
                    {talent.location}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <AddTalentWishlist talentId={talent._id} />
            {user?.data._id === talent._id ? null : (
              <MessageSentButton seller={talent._id} className="h-6 px-2 text-[11px]" />
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {jobSuccess > 0 && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">{jobSuccess}%</span>
              <span className="text-gray-400">Success</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-900">{avgRating > 0 ? avgRating : "N/A"}</span>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar key={i} className={`w-2.5 h-2.5 ${i < Math.round(avgRating) ? "text-yellow-500" : "text-gray-200"}`} />
              ))}
            </div>
          </div>
          {completedCount > 0 && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">{completedCount}</span>
              <span className="text-gray-400">Jobs</span>
            </div>
          )}
          {talent.skills && talent.skills.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">{talent.skills.length}</span>
              <span className="text-gray-400">Skills</span>
            </div>
          )}
        </div>
        <hr className="text-gray-200" />
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {talent?.about?.slice(0, 150)}
        </p>
      </div>
    </div>
    </Link>
  );
}
