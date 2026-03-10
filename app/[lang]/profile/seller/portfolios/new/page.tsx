import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PortfolioForm } from "../_components/portfolio-form";

const AddPortfolio = () => {
  return (
    <div className="pb-20 space-y-6">
      <div>
        <Link
          href="/profile/seller/portfolios"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to portfolios
        </Link>
        <h2 className="text-xl font-semibold text-gray-900">Add New Project</h2>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the details below to showcase your project
        </p>
      </div>
      <PortfolioForm mode="create" />
    </div>
  );
};

export default AddPortfolio;
