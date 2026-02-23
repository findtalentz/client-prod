import { PropsWithChildren } from "react";
import { FaGavel, FaGear } from "react-icons/fa6";
import { IoBriefcaseOutline } from "react-icons/io5";
import { LuArrowLeftRight, LuUsers, LuWallet } from "react-icons/lu";
import { RiDashboardLine } from "react-icons/ri";
import DashboardLayout from "../_components/dashboard-layout";

const items = [
  {
    id: 1,
    label: "Overview",
    path: "/dashboard/admin",
    icon: <RiDashboardLine />,
  },
  {
    id: 2,
    label: "Users",
    path: "/dashboard/admin/users",
    icon: <LuUsers />,
  },
  {
    id: 3,
    label: "Transactions",
    path: "/dashboard/admin/transactions",
    icon: <LuArrowLeftRight />,
  },
  {
    id: 4,
    label: "Withdrawals",
    path: "/dashboard/admin/withdrawals",
    icon: <LuWallet />,
  },
  {
    id: 5,
    label: "Disputes",
    path: "/dashboard/admin/disputes",
    icon: <FaGavel />,
  },
  {
    id: 6,
    label: "Jobs",
    path: "/dashboard/admin/jobs",
    icon: <IoBriefcaseOutline />,
  },
  {
    id: 7,
    label: "Settings",
    path: "/dashboard/admin/settings",
    icon: <FaGear />,
  },
];

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: PropsWithChildren) {
  return <DashboardLayout navItems={items}>{children}</DashboardLayout>;
}
