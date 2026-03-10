import ApiResponse from "@/schemas/ApiRespose";
import Portfolio from "@/schemas/Portfolio";
import apiClient from "@/services/api-client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PortfolioForm } from "../_components/portfolio-form";

interface Props {
  params: Promise<{ id: string }>;
}

async function EditPortfolio({ params }: Props) {
  const { id } = await params;
  const { data } = await apiClient.get<ApiResponse<Portfolio>>(
    `/portfolios/${id}`
  );
  return (
    <div className="pb-20 space-y-6">
      <div>
        <Link
          href="/profile/seller/portfolios"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to portfolios
        </Link>
        <h2 className="text-xl font-semibold text-gray-900">Edit Project</h2>
        <p className="text-sm text-gray-500 mt-1">
          Update your project details
        </p>
      </div>
      <PortfolioForm portfolio={data.data} mode="edit" />
    </div>
  );
}

export default EditPortfolio;
