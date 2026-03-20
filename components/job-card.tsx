"use client";
import IconBadge from "@/components/ui/icon-badge";
import Text from "@/components/ui/text";
import { formatDate } from "@/lib/utils";
import JobSchema from "@/schemas/Job";
import Image from "next/image";
import Link from "next/link";
import { GrLocation } from "react-icons/gr";
import { IoTimerOutline } from "react-icons/io5";
import { TbListDetails } from "react-icons/tb";
import AddJobWishlist from "./add-job-wishlist";
import IsApplyedBadge from "./is-applyed-badge";

interface Props {
  job: JobSchema;
}

export default function JobCard({ job }: Props) {
  return (
    <div className="space-y-3 border-b border-gray-200 py-6">
      <div className="flex items-center justify-between gap-3">
        <Text variant="gray" size="small">
          Posted {formatDate(job.createdAt)}
        </Text>
        <div className="flex items-center gap-2 shrink-0">
          {job.budgetAmount && (
            <Text size="small" className="font-semibold text-primary">
              Budget: ${job.budgetAmount}
            </Text>
          )}
          <AddJobWishlist jobId={job._id} />
        </div>
      </div>
      <div className="flex items-start gap-2 flex-wrap">
        <Link
          href={`/jobs/${job._id}`}
          className="cursor-pointer font-medium text-xl md:text-2xl hover:text-primary transition-colors"
        >
          {job.title}
        </Link>
        <IsApplyedBadge jobId={job._id} />
      </div>
      {job.author && (
        <div className="flex items-center gap-2">
          {job.author.image ? (
            <Image
              src={job.author.image}
              alt={`${job.author.firstName} ${job.author.lastName}`}
              width={24}
              height={24}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
              {job.author.firstName?.[0]}
            </div>
          )}
          <Text variant="gray" size="small">
            {job.author.firstName} {job.author.lastName}
          </Text>
        </div>
      )}
      <div className="flex items-center gap-3 md:gap-5 flex-wrap">
        <IconBadge text={job.location || "N/A"}>
          <GrLocation />
        </IconBadge>
        <IconBadge text={job.category?.name || "Not specified"}>
          <TbListDetails />
        </IconBadge>
        <IconBadge text={job.jobType}>
          <IoTimerOutline />
        </IconBadge>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
