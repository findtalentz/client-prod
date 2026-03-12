import { PropsWithChildren } from "react";
import { FaBell } from "react-icons/fa";
import { FaGear, FaMoneyCheckDollar } from "react-icons/fa6";
import { IoBriefcaseOutline } from "react-icons/io5";
import { LuCalendarDays } from "react-icons/lu";
import { MdOutlineMessage } from "react-icons/md";
import { RiDashboardLine, RiVerifiedBadgeLine } from "react-icons/ri";
import DashboardLayout from "../_components/dashboard-layout";
import { getDictionary } from "../../dictionaries";

interface Props extends PropsWithChildren {
  params: Promise<{ lang: string }>;
}

export const dynamic = "force-dynamic";

export default async function BuyerLayout({ children, params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.dashboard.sidebar;

  const items = [
    {
      id: 1,
      label: t.dashboard,
      path: "/dashboard/seller",
      icon: <RiDashboardLine />,
    },
    {
      id: 2,
      label: t.jobManagement,
      path: "/dashboard/seller/jobs",
      icon: <IoBriefcaseOutline />,
    },
    {
      id: 4,
      label: t.messages,
      path: "/dashboard/seller/messages",
      icon: <MdOutlineMessage />,
    },
    {
      id: 6,
      label: t.earnings,
      path: "/dashboard/seller/earnings",
      icon: <FaMoneyCheckDollar />,
    },
    {
      id: 7,
      label: t.notifications,
      path: "/dashboard/seller/notifications",
      icon: <FaBell />,
    },
    {
      id: 8,
      label: t.settings,
      path: "/dashboard/seller/settings",
      icon: <FaGear />,
    },
    {
      id: 9,
      label: t.royaltyProgram,
      path: "/dashboard/seller/royalty-program",
      icon: <RiVerifiedBadgeLine />,
    },
    {
      id: 10,
      label: t.calendar,
      path: "/dashboard/seller/calendar",
      icon: <LuCalendarDays />,
    },
  ];

  return <DashboardLayout navItems={items} dictionary={dict.dashboard}>{children}</DashboardLayout>;
}
