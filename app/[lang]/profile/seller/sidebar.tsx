"use client";
import { useParams } from "next/navigation";
import Steps from "./steps";

export default function SellerProfileSidebar() {
  const { lang } = useParams();

  const stepsFreelancer = [
    {
      id: 1,
      label: "Set Up Profile",
      url: `/${lang}/profile/seller`,
    },
    {
      id: 2,
      label: "Skills & Languages",
      url: `/${lang}/profile/seller/skills`,
    },
    {
      id: 3,
      label: "Educations",
      url: `/${lang}/profile/seller/educations`,
    },
    {
      id: 4,
      label: "Portfolios",
      url: `/${lang}/profile/seller/portfolios`,
    },
    {
      id: 5,
      label: "Services",
      url: `/${lang}/profile/seller/services`,
    },
    {
      id: 6,
      label: "Preview",
      url: `/${lang}/profile/seller/preview`,
    },
  ];
  return (
    <div className="sticky top-0 p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-6">
        Setup Progress
      </p>
      <Steps steps={stepsFreelancer} />
    </div>
  );
}
