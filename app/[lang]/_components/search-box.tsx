"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoSearchSharp } from "react-icons/io5";

type SearchOption = {
  id: string;
  option: string;
  value: string;
};

const searchOptions: SearchOption[] = [
  { id: "1", option: "Jobs", value: "jobs" },
  { id: "2", option: "Talents", value: "hire" },
];

export default function SearchBox() {
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang || "en";
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("jobs");

  const handleSearch = () => {
    if (!searchText.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    router.push(`/${lang}/${searchType}?search=${encodeURIComponent(searchText)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="w-full flex items-center justify-between border bg-white px-4 rounded-full hover:border-gray-400 transition-colors duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
      {/* Search Input */}
      <div className="flex items-center flex-1">
        <IoSearchSharp className="text-xl mr-2 text-gray-500" />
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="py-3 border-none focus:outline-none flex-1 w-full text-gray-700 placeholder-gray-400"
          type="text"
          placeholder="Search for jobs or talents..."
          aria-label="Search input"
        />
      </div>

      <div className="h-5 w-px bg-gray-300 mx-2" />

      {/* Select Type */}
      <Select
        value={searchType}
        onValueChange={(value) => setSearchType(value)}
      >
        <SelectTrigger className="max-w-[120px] border-none !font-[500]">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {searchOptions.map((option) => (
              <SelectItem key={option.id} value={option.value}>
                {option.option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
