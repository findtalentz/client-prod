import PortfolioCard from "@/components/portfolio-card";
import { buttonVariants } from "@/components/ui/button";
import ApiResponse from "@/schemas/ApiRespose";
import Portfolio from "@/schemas/Portfolio";
import apiClient from "@/services/api-client";
import { Grid } from "@radix-ui/themes";
import Link from "next/link";

export default async function Projects() {
  const { data } = await apiClient.get<ApiResponse<Portfolio[]>>("/portfolios");
  return (
    <div className="pb-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-primary font-semibold">Portfolio</h2>
        <Link
          className={buttonVariants()}
          href="/profile/seller/portfolios/new"
        >
          Add New Portfolio
        </Link>
      </div>
      {data && data.count > 0 && (
        <div>
          <h5 className="font-medium text-lg mb-3 text-gray-700">
            Added Projects
          </h5>
          <Grid columns={{ initial: "1", md: "2" }} gap="4">
            {data.data.map((portfolio) => (
              <PortfolioCard key={portfolio._id} portfolio={portfolio} />
            ))}
          </Grid>
        </div>
      )}
      <div className="flex justify-end mt-8">
        <Link
          className={buttonVariants()}
          href="/profile/seller/services"
        >
          Next
        </Link>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
