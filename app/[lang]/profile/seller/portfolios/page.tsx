import PortfolioCard from "@/components/portfolio-card";
import { buttonVariants } from "@/components/ui/button";
import ApiResponse from "@/schemas/ApiRespose";
import Portfolio from "@/schemas/Portfolio";
import apiClient from "@/services/api-client";
import Link from "next/link";
import { ArrowRight, FolderOpen, Plus } from "lucide-react";

export default async function Projects() {
  const { data } = await apiClient.get<ApiResponse<Portfolio[]>>("/portfolios");
  return (
    <div className="pb-20 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderOpen className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900">Portfolio</h2>
          </div>
          <p className="text-sm text-gray-500">
            Showcase your best work to attract clients
          </p>
        </div>
        <Link
          className={buttonVariants({ variant: "outline" }) + " gap-2"}
          href="/profile/seller/portfolios/new"
        >
          <Plus className="w-4 h-4" /> Add Project
        </Link>
      </div>

      {data && data.count > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.data.map((portfolio) => (
            <PortfolioCard key={portfolio._id} portfolio={portfolio} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
            <FolderOpen className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-sm text-gray-500 mb-1">No projects yet</p>
          <p className="text-xs text-gray-400 mb-4">Add your best work to stand out</p>
          <Link
            className={buttonVariants({ variant: "outline", size: "sm" }) + " gap-2"}
            href="/profile/seller/portfolios/new"
          >
            <Plus className="w-4 h-4" /> Add Your First Project
          </Link>
        </div>
      )}

      <div className="flex justify-end">
        <Link
          className={buttonVariants({ size: "lg" }) + " gap-2"}
          href="/profile/seller/services"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
