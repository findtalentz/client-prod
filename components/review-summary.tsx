"use client";

import useReviewSummary from "@/hooks/useReviewSummary";
import { Sparkles } from "lucide-react";

interface Props {
  sellerId: string;
}

export default function ReviewSummary({ sellerId }: Props) {
  const { data, isLoading } = useReviewSummary(sellerId);

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-muted/30 p-4 animate-pulse">
        <div className="h-4 w-32 bg-muted rounded mb-2" />
        <div className="h-3 w-full bg-muted rounded mb-1.5" />
        <div className="h-3 w-3/4 bg-muted rounded" />
      </div>
    );
  }

  if (!data?.data?.summary) return null;

  return (
    <div className="rounded-lg border bg-gradient-to-r from-violet-50/50 to-blue-50/50 dark:from-violet-950/20 dark:to-blue-950/20 p-4">
      <div className="flex items-center gap-1.5 mb-2">
        <Sparkles className="h-4 w-4 text-violet-500" />
        <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide">
          AI Review Summary
        </span>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed">
        {data.data.summary}
      </p>
    </div>
  );
}
