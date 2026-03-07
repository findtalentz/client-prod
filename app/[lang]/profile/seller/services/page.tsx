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
    <div className="pb-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-primary font-semibold">Services</h2>
        <Link className={buttonVariants()} href="/profile/seller/services/new">
          Add New Service
        </Link>
      </div>
      {services.data.length > 0 && (
        <Grid columns={{ initial: "1", md: "2" }} gap="4">
          {services.data.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </Grid>
      )}
      <div className="flex justify-end mt-8">
        <Link
          className={buttonVariants()}
          href="/profile/seller/preview"
        >
          Next
        </Link>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
