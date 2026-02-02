import ServiceCard from "@/components/service-card";
import { buttonVariants } from "@/components/ui/button";
import ApiResponse from "@/schemas/ApiRespose";
import Service from "@/schemas/Service";
import apiClient from "@/services/api-client";
import { Grid } from "@radix-ui/themes/components/index";
import Link from "next/link";

export default async function ServicesPage() {
  const { data: services } = await apiClient.get<ApiResponse<Service[]>>(
    "/services"
  );
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-primary mb-5">Services</h3>
        <Link className={buttonVariants()} href="/profile/seller/services/new">
          Add New Service
        </Link>
      </div>
      <Grid columns={{ initial: "1", md: "2" }} gap="5">
        {services.data.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </Grid>
    </div>
  );
}
export const dynamic = "force-dynamic";
