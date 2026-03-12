import { CardContent, CardHeader } from "@/components/ui/card";
import ApiResponse from "@/schemas/ApiRespose";
import CommentSchema from "@/schemas/Comment";
import apiClient from "@/services/api-client";
import { Flex } from "@radix-ui/themes";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Comment from "./comment";
import { getDictionary } from "../../../dictionaries";

export const dynamic = "force-dynamic";

interface Props {
  lang: "en" | "ch";
}

async function NewActions({ lang }: Props) {
  const dict = await getDictionary(lang);
  const t = dict.dashboard;

  const { data } = await apiClient.get<ApiResponse<CommentSchema[]>>(
    "/comments/client"
  );
  if (!data) return null;

  return (
    <div className="shadow py-4 rounded-3xl! overflow-hidden! border">
      <CardHeader>
        <Flex align="center" justify="between" mb="3">
          <span className="text-primary font-semibold text-[18px]">
            {t.client.requiredActions}
          </span>
          {data.count > 5 && (
            <Link
              href={`/${lang}/dashboard/client/jobs`}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {t.common.viewAll} <ArrowRight className="h-4 w-4" />
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
