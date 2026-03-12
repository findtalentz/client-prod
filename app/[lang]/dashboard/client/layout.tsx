import { PropsWithChildren } from "react";
import { FaBell, FaGear } from "react-icons/fa6";
import { IoBriefcaseOutline } from "react-icons/io5";
import { LuCalendarDays, LuSearchCode } from "react-icons/lu";
import { MdOutlineMessage, MdOutlinePayment } from "react-icons/md";
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
      path: "/dashboard/client",
      icon: <RiDashboardLine />,
    },
    {
      id: 2,
      label: t.jobManagement,
      path: "/dashboard/client/jobs",
      icon: <IoBriefcaseOutline />,
    },
    {
      id: 3,
      label: t.talents,
      path: "/dashboard/client/talents",
      icon: <LuSearchCode />,
    },
    {
      id: 4,
      label: t.messages,
      path: "/dashboard/client/messages",
      icon: <MdOutlineMessage />,
    },
    {
      id: 5,
      label: t.paymentMethods,
      path: "/dashboard/client/payment-methods",
      icon: <MdOutlinePayment />,
    },
    {
      id: 6,
      label: t.settings,
      path: "/dashboard/client/settings",
      icon: <FaGear />,
    },
    {
      id: 7,
      label: t.notifications,
      path: "/dashboard/client/notifications",
      icon: <FaBell />,
    },
    {
      id: 8,
      label: t.royaltyProgram,
      path: "/dashboard/client/royalty-program",
      icon: <RiVerifiedBadgeLine />,
    },
    {
      id: 9,
      label: t.calendar,
      path: "/dashboard/client/calendar",
      icon: <LuCalendarDays />,
    },
  ];

  return <DashboardLayout navItems={items} dictionary={dict.dashboard}>{children}</DashboardLayout>;
}
