import { PropsWithChildren } from "react";
import { FaBell } from "react-icons/fa";
import { FaGear, FaMoneyCheckDollar } from "react-icons/fa6";
import { IoBriefcaseOutline } from "react-icons/io5";
import { LuCalendarDays } from "react-icons/lu";
import { MdOutlineMessage } from "react-icons/md";
import { RiDashboardLine, RiVerifiedBadgeLine } from "react-icons/ri";
import DashboardLayout from "../_components/dashboard-layout";

const items = [
  {
    id: 1,
    label: "Dashboard",
    path: "/dashboard/seller",
    icon: <RiDashboardLine />,
  },
  {
    id: 2,
    label: "Job Management",
    path: "/dashboard/seller/jobs",
    icon: <IoBriefcaseOutline />,
  },
  {
    id: 4,
    label: "Messages",
    path: "/dashboard/seller/messages",
    icon: <MdOutlineMessage />,
  },
  {
    id: 6,
    label: "Earnings",
    path: "/dashboard/seller/earnings",
    icon: <FaMoneyCheckDollar />,
  },
  {
    id: 7,
    label: "Notifications",
    path: "/dashboard/seller/notifications",
    icon: <FaBell />,
  },
  {
    id: 8,
    label: "Settings",
    path: "/dashboard/seller/settings",
    icon: <FaGear />,
  },
  {
    id: 9,
    label: "Royalty Program",
    path: "/dashboard/seller/royalty-program",
    icon: <RiVerifiedBadgeLine />,
  },
  {
    id: 10,
    label: "Calendar",
    path: "/dashboard/seller/calendar",
    icon: <LuCalendarDays />,
  },
];

export const dynamic = "force-dynamic";

export default function BuyerLayout({ children }: PropsWithChildren) {
  return <DashboardLayout navItems={items}>{children}</DashboardLayout>;
}
