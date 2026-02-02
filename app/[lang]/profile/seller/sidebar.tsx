import Steps from "./steps";

const stepsFreelancer = [
  {
    id: 1,
    label: "Set Up Profile",
    url: "/profile/seller",
  },
  {
    id: 2,
    label: "Skills & Languages",
    url: "/profile/seller/skills",
  },
  {
    id: 3,
    label: "Educations",
    url: "/profile/seller/educations",
  },
  {
    id: 4,
    label: "Portfolios",
    url: "/profile/seller/portfolios",
  },
  {
    id: 5,
    label: "Services",
    url: "/profile/seller/services",
  },
  {
    id: 6,
    label: "Preview",
    url: "/profile/seller/preview",
  },
];

export default function SellerProfileSidebar() {
  return (
    <div className="p-4">
      <Steps steps={stepsFreelancer} />
    </div>
  );
}
