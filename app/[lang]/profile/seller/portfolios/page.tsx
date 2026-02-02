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
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-primary mb-5">Portfolio</h2>
        <Link
          className={buttonVariants()}
          href="/profile/seller/portfolios/new"
        >
          Add New Portfolio
        </Link>
      </div>
      {data && data.count > 0 && (
        <div>
          <h5 className="font-medium text-xl mb-3">Added Proects</h5>
          <Grid columns={{ initial: "1", md: "2" }} gap="5">
            {data.data.map((portfolio) => (
              <PortfolioCard key={portfolio._id} portfolio={portfolio} />
            ))}
          </Grid>
        </div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
