import ApiResponse from "@/schemas/ApiRespose";
import Service from "@/schemas/Service";
import apiClient from "@/services/api-client";
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
    <div className="space-y-8">
      <ServiceFormPage service={service.data} />
      <div className="space-y-4 border-t pt-8 pb-8">
        <h3 className="text-primary font-semibold">Pricing Packages</h3>
        <PricingForm serviceId={id} />
      </div>
    </div>
  );
}

export default ServiceDetails;
