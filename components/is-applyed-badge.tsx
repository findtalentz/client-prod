"use client";

import useIsApplyed from "@/hooks/useIsApplyed";
import useSession from "@/hooks/useSession";
import { Badge } from "./ui/badge";

interface Props {
  jobId: string;
}

export default function IsApplyedBadge({ jobId }: Props) {
  const { data: isApplyed } = useIsApplyed(jobId);
  const { data: session } = useSession();
  if (!session) return null;
  if (session.data.role === "CLIENT") return null;
  if (!isApplyed) return null;
  if (!isApplyed.data) return null;

  return <Badge>Applyed</Badge>;
}
