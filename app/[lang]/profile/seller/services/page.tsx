import ServiceCard from "@/components/service-card";
import { buttonVariants } from "@/components/ui/button";
import ApiResponse from "@/schemas/ApiRespose";
import Service from "@/schemas/Service";
import apiClient from "@/services/api-client";
import Link from "next/link";
import { ArrowRight, Briefcase, Plus } from "lucide-react";

export default async function ServicesPage() {
  const { data: services } = await apiClient.get<ApiResponse<Service[]>>(
    "/services"
  );
  return (
    <div className="pb-20 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900">Services</h2>
          </div>
          <p className="text-sm text-gray-500">
            Define the services you offer with pricing packages
          </p>
        </div>
        <Link
          className={buttonVariants({ variant: "outline" }) + " gap-2"}
          href="/profile/seller/services/new"
        >
          <Plus className="w-4 h-4" /> Add Service
        </Link>
      </div>

      {services.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.data.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
            <Briefcase className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-sm text-gray-500 mb-1">No services yet</p>
          <p className="text-xs text-gray-400 mb-4">
            Create services that clients can purchase
          </p>
          <Link
            className={buttonVariants({ variant: "outline", size: "sm" }) + " gap-2"}
            href="/profile/seller/services/new"
          >
            <Plus className="w-4 h-4" /> Create Your First Service
          </Link>
        </div>
      )}

      <div className="flex justify-end">
        <Link
          className={buttonVariants({ size: "lg" }) + " gap-2"}
          href="/profile/seller/preview"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
