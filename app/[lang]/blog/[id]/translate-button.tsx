"use client";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { MdOutlineTranslate } from "react-icons/md";
import React, { useTransition } from "react";

function TranslateButton() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const onTranslate = () => {
    const params = new URLSearchParams(searchParams.toString());
    const currentLang = params.get("language");

    params.set("language", currentLang === "en" ? "ch" : "en");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <Button
      onClick={onTranslate}
      aria-label="Toggle translation"
      disabled={isPending}
    >
      <MdOutlineTranslate className="mr-2" />
      {isPending ? "Translating..." : "Translate"}
    </Button>
  );
}

export default TranslateButton;
