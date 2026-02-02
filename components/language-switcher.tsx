"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  // Detect current locale from pathname
  const currentLocale = useMemo(() => {
    const segments = pathname.split("/");
    return ["en", "ch"].includes(segments[1]) ? segments[1] : "en"; // fallback to "en"
  }, [pathname]);

  const handleLocaleChange = (locale: string) => {
    const segments = pathname.split("/");
    if (["en", "ch"].includes(segments[1])) {
      segments[1] = locale; // replace locale
    } else {
      segments.splice(1, 0, locale); // insert locale
    }
    const newPath = segments.join("/") || "/";
    router.push(newPath);
  };

  return (
    <Select value={currentLocale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="max-w-[70px] rounded-full bg-white/50 border-none text-primary-dark font-medium!">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="en">EN</SelectItem>
          <SelectItem value="ch">CH</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default LanguageSwitcher;
