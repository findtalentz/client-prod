"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import JobFilterBox from "../job-filter-box";

function LocationFilter() {
  const [isVisible, setVisible] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [locationText, setLocationText] = useState(
    searchParams.get("location") || ""
  );
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (locationText) {
        params.set("location", locationText);
      } else {
        params.delete("location");
      }

      router.push(`${pathname}?${params.toString()}`);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [locationText, router, pathname, searchParams]);

  return (
    <>
      {isVisible && (
        <JobFilterBox
          title="Location"
          onVisibleChange={() => setVisible(false)}
        >
          <input
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
            className="w-full py-1.5 px-2 border border-gray-300 rounded-md focus:outline-none text-sm"
            type="text"
            placeholder="Filter by location..."
          />
        </JobFilterBox>
      )}
    </>
  );
}

export default LocationFilter;
