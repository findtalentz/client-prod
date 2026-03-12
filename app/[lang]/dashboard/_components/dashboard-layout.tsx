import { ReactNode } from "react";
import DashboardNav from "./dashboard-nav";
import DashboardSidebar from "./dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DictionaryProvider } from "@/hooks/useDictionary";

interface NavItem {
  id: number;
  label: string;
  path: string;
  icon: ReactNode;
}

interface Props {
  children: ReactNode;
  navItems: NavItem[];
  dictionary: Record<string, unknown>;
}

function DashboardLayout({ children, navItems, dictionary }: Props) {
  return (
    <DictionaryProvider dictionary={dictionary}>
      <SidebarProvider>
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar items={navItems} />
          <main className="w-full">
            <DashboardNav />
            <div className="p-4 h-[calc(100vh-65px)] overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </DictionaryProvider>
  );
}

export default DashboardLayout;
