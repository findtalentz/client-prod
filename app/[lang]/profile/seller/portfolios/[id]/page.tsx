import ApiResponse from "@/schemas/ApiRespose";
import Portfolio from "@/schemas/Portfolio";
import apiClient from "@/services/api-client";
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
    <div>
      <h1>Edit Portfolio</h1>
      <PortfolioForm portfolio={data.data} mode="edit" />
    </div>
  );
}

export default EditPortfolio;
