import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

interface Props {
  className?: string;
  isAllSecondary?: boolean;
}

export default function ActionButtons({ className, isAllSecondary }: Props) {
  return (
    <div
      className={cn(
        "w-full flex items-center gap-5 flex-col md:flex-row",
        className
      )}
    >
      <Link
        href="/sign-up/freelancer"
        className={cn("w-full md:w-auto", buttonVariants())}
      >
        Join as a Freelancer
      </Link>
      <Link
        href="/sign-up/client"
        className={cn(
          "w-full md:w-auto",
          buttonVariants({ variant: isAllSecondary ? "default" : "dark" })
        )}
      >
        Hire a Freelancer
      </Link>
    </div>
  );
}
