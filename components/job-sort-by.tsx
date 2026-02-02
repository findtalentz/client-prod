"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

export default function JobSortBy() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Select
      onValueChange={(value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const isExist = params.get("orderBy");

        if (isExist && value === "1") {
          params.delete("orderBy");
        } else {
          params.set("orderBy", value);
        }

        const query = params.toString();
        router.push("?" + query);
      }}
    >
      <SelectTrigger className="w-[120px] rounded-full">
        <SelectValue placeholder="Order By" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="title">Title</SelectItem>
        <SelectItem value="createdAt">Date Created</SelectItem>
      </SelectContent>
    </Select>
  );
}
