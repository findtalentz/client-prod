import ApiResponse from "@/schemas/ApiRespose";
import Service from "@/schemas/Service";
import apiClient from "@/services/api-client";
import { Grid } from "@radix-ui/themes";
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
    <Grid columns={{ initial: "1", md: "1fr 300px" }} gap="10">
      <div className="pr-6">
        <ServiceFormPage service={service.data} />
      </div>
      <div className="space-y-4 mb-8">
        <h3>Pricing</h3>
        <PricingForm serviceId={id} />
      </div>
    </Grid>
  );
}

export default ServiceDetails;
