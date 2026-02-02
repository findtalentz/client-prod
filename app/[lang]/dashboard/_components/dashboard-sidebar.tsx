"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useDashboardStepStore, useStepStore } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface Item {
  id: number;
  label: string;
  path: string;
  icon: ReactNode;
}

interface Props {
  items: Item[];
}

export default function DashboardSidebar({ items }: Props) {
  const stepStore = useDashboardStepStore();
  const mixSetStep = useStepStore((s) => s.setStep);
  return (
    <Sidebar>
      <SidebarHeader className="px-4 bg-primary-dark h-[65px] flex items-start justify-center">
        <Image src="/logo.svg" alt="logo" width={120} height={50} priority />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link
                      onClick={() => {
                        stepStore.setStep(item.id);
                        mixSetStep(1);
                      }}
                      key={item.id}
                      href={item.path}
                      className={cn(
                        "group flex items-center px-2 py-6 gap-2 text-sm font-medium text-primary-dark hover:bg-[#AAEBCA4D] hover:text-gray-900",
                        stepStore.step === item.id && "bg-[#AAEBCA4D]"
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
