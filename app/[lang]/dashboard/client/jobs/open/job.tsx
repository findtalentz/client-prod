import IconBadge from "@/components/ui/icon-badge";
import Text from "@/components/ui/text";
import { formatDate } from "@/lib/utils";
import JobSchema from "@/schemas/Job";
import { GrLocation } from "react-icons/gr";
import { IoTimerOutline } from "react-icons/io5";
import { PiBuildingApartmentDuotone } from "react-icons/pi";
import { TbListDetails } from "react-icons/tb";

interface Props {
  job: JobSchema;
}

export default function Job({ job }: Props) {
  return (
    <div className="space-y-2 border-b py-6 last:border-none">
      <div className="flex items-center gap-2">
        <Text variant="gray" size="small">
          Posted {formatDate(job.createdAt)}
        </Text>
      </div>
      <h3>
        <h3>{job.title}</h3>
      </h3>
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
        <IconBadge text={formatDate(job.createdAt)}>
          <IoTimerOutline />
        </IconBadge>
      </div>
    </div>
  );
}
