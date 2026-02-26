import { PropsWithChildren } from "react";
import { FaBell, FaGear } from "react-icons/fa6";
import { IoBriefcaseOutline } from "react-icons/io5";
import { LuCalendarDays, LuSearchCode } from "react-icons/lu";
import { MdOutlineMessage, MdOutlinePayment } from "react-icons/md";
import { RiDashboardLine, RiVerifiedBadgeLine } from "react-icons/ri";
import DashboardLayout from "../_components/dashboard-layout";

const items = [
  {
    id: 1,
    label: "Dashboard",
    path: "/dashboard/client",
    icon: <RiDashboardLine />,
  },
  {
    id: 2,
    label: "Job Management",
    path: "/dashboard/client/jobs",
    icon: <IoBriefcaseOutline />,
  },
  {
    id: 3,
    label: "Talents",
    path: "/dashboard/client/talents",
    icon: <LuSearchCode />,
  },
  {
    id: 4,
    label: "Messages",
    path: "/dashboard/client/messages",
    icon: <MdOutlineMessage />,
  },
  {
    id: 5,
    label: "Payment Methods",
    path: "/dashboard/client/payment-methods",
    icon: <MdOutlinePayment />,
  },
  {
    id: 6,
    label: "Settings",
    path: "/dashboard/client/settings",
    icon: <FaGear />,
  },
  {
    id: 7,
    label: "Notifications",
    path: "/dashboard/client/notifications",
    icon: <FaBell />,
  },
  {
    id: 8,
    label: "Royalty Program",
    path: "/dashboard/client/royalty-program",
    icon: <RiVerifiedBadgeLine />,
  },
  {
    id: 9,
    label: "Calendar",
    path: "/dashboard/client/calendar",
    icon: <LuCalendarDays />,
  },
];

export const dynamic = "force-dynamic";

export default function BuyerLayout({ children }: PropsWithChildren) {
  return <DashboardLayout navItems={items}>{children}</DashboardLayout>;
}
