"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
  value: string;
}

export default function JobFilterBox({ title, children, value }: Props) {
  return (
    <Accordion type="single" collapsible defaultValue={value}>
      <AccordionItem value={value} className="rounded-xl border border-gray-400 px-3">
        <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
          {title}
        </AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
