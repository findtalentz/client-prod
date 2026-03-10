import ApiResponse from "@/schemas/ApiRespose";
import Service from "@/schemas/Service";
import apiClient from "@/services/api-client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import PricingForm from "../_components/pricing-from";
import ServiceFormPage from "../_components/service-form";

interface Props {
  params: Promise<{ id: string }>;
}

async function ServiceDetails({ params }: Props) {
  const { id } = await params;

  const { data: service } = await apiClient.get<ApiResponse<Service>>(
    `/services/${id}`
  );

  return (
    <div className="pb-20 space-y-8">
      <div>
        <Link
          href="/profile/seller/services"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to services
        </Link>
        <h2 className="text-xl font-semibold text-gray-900">Edit Service</h2>
        <p className="text-sm text-gray-500 mt-1">
          Update your service details and pricing
        </p>
      </div>

      <ServiceFormPage service={service.data} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h3 className="text-sm font-semibold text-gray-900">Pricing Packages</h3>
        <PricingForm serviceId={id} />
      </div>
    </div>
  );
}

export default ServiceDetails;
