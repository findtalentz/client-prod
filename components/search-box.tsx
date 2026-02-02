"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { IoSearchSharp } from "react-icons/io5";

export default function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("search") || ""
  );

  // Update URL instantly when searchText changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchText) {
      params.set("search", searchText);
    } else {
      params.delete("search");
    }

    const query = params.toString();
    router.replace("?" + query);
  }, [searchText, router, searchParams]);

  return (
    <div className="w-full md:max-w-[450px] flex items-center justify-between shadow-xs border border-gray-200 px-2 rounded-4xl">
      <input
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="py-1.5 border-none focus:outline-none flex-1 w-full text-sm"
        type="text"
        placeholder="Search for..."
      />
      <IoSearchSharp className="text-xl mr-1 text-primary" />
    </div>
  );
}
