"use client";
import IconBadge from "@/components/ui/icon-badge";
import Text from "@/components/ui/text";
import { formatDate } from "@/lib/utils";
import JobSchema from "@/schemas/Job";
import Link from "next/link";
import { GrLocation } from "react-icons/gr";
import { IoTimerOutline } from "react-icons/io5";
import { PiBuildingApartmentDuotone } from "react-icons/pi";
import { TbListDetails } from "react-icons/tb";
import AddJobWishlist from "./add-job-wishlist";
import IsApplyedBadge from "./is-applyed-badge";

interface Props {
  job: JobSchema;
}

export default function JobCard({ job }: Props) {
  return (
    <div className="space-y-2 border-b border-gray py-6 relative">
      <AddJobWishlist jobId={job._id} />
      <div className="flex items-center gap-2">
        <Text variant="gray" size="small">
          Posted {formatDate(job.createdAt)}
        </Text>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={`/jobs/${job._id}`}
          className="cursor-pointer font-medium text-2xl"
        >
          {job.title}
        </Link>
        <IsApplyedBadge jobId={job._id} />
      </div>
      <div className="flex items-center gap-5">
        <IconBadge text="LA, US">
          <GrLocation />
        </IconBadge>
        <IconBadge text="ABC, Tech">
          <PiBuildingApartmentDuotone />
        </IconBadge>
        <IconBadge text={job.category.name}>
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
