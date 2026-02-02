"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";

function BlogSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchText, setSearchText] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.key === "Enter") {
      const isExist = params.get("search");
      if (isExist && !searchText) {
        params.delete("search");
      } else {
        params.set("search", searchText);
      }
      const query = params.toString();
      return router.push("?" + query);
    }
  };
  return (
    <div className="flex items-center justify-center flex-col gap-2 py-10">
      <div className="px-3 py-2 rounded-4xl bg-white border shadow overflow-hidden gap-2 w-full md:min-w-[400px] flex items-center justify-between">
        <IoSearch />
        <input
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Search articles..."
          className="flex-1 border-none outline-none focus:outline-none"
        />
      </div>
      <p>Enter keywords to discover relevant content.</p>
    </div>
  );
}

export default BlogSearch;
