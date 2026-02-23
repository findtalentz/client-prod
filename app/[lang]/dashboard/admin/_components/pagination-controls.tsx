"use client";

import { Button } from "@/components/ui/button";

interface Props {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  pageCount,
  onPageChange,
}: Props) {
  if (pageCount <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 pt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {pageCount}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= pageCount}
      >
        Next
      </Button>
    </div>
  );
}
