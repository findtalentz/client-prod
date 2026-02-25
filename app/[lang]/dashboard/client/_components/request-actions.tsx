import { CardContent, CardHeader } from "@/components/ui/card";
import ApiResponse from "@/schemas/ApiRespose";
import CommentSchema from "@/schemas/Comment";
import apiClient from "@/services/api-client";
import { Flex } from "@radix-ui/themes";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Comment from "./comment";

export const dynamic = "force-dynamic";

async function NewActions() {
  const { data } = await apiClient.get<ApiResponse<CommentSchema[]>>(
    "/comments/client"
  );
  if (!data) return null;

  return (
    <div className="shadow py-4 rounded-3xl! overflow-hidden! border">
      <CardHeader>
        <Flex align="center" justify="between" mb="3">
          <span className="text-primary font-semibold text-[18px]">
            Required Actions
          </span>
          {data.count > 5 && (
            <Link
              href="/dashboard/client/jobs"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </Flex>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {data.data.map((item) => (
            <Comment key={item._id} comment={item} />
          ))}
        </div>
      </CardContent>
    </div>
  );
}

export default NewActions;
