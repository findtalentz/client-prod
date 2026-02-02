"use client";
import { cn } from "@/lib/utils";
import { useStepStore } from "@/store";
import { Flex } from "@radix-ui/themes";
import Link from "next/link";
import { CgNotes } from "react-icons/cg";
import { FaRegCheckCircle } from "react-icons/fa";
import { IoBriefcaseOutline } from "react-icons/io5";

const items = [
  {
    id: 1,
    label: "In Progress Jobs",
    path: "/dashboard/client/jobs",
    icon: <IoBriefcaseOutline />,
  },
  {
    id: 2,
    label: "Open Jobs",
    path: "/dashboard/client/jobs/open",
    icon: <CgNotes />,
  },
  {
    id: 3,
    label: "Completed Jobs",
    path: "/dashboard/client/jobs/completed",
    icon: <FaRegCheckCircle />,
  },
];

export default function JobBar() {
  const stepStore = useStepStore();
  return (
    <Flex align="center" gap="6" className="border-b-2 pb-2">
      {items.map((i) => (
        <Link
          href={i.path}
          onClick={() => stepStore.setStep(i.id)}
          key={i.id}
          className={cn(
            "relative",
            stepStore.step === i.id && "text-primary-dark font-semibold"
          )}
        >
          <Flex align="center" gap="2">
            {i.icon} <p> {i.label} </p>
          </Flex>
          {stepStore.step === i.id && (
            <div className="absolute -bottom-2.5 start-0 w-full h-1 bg-primary-dark" />
          )}
        </Link>
      ))}
    </Flex>
  );
}
