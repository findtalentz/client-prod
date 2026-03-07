import { PortfolioForm } from "../_components/portfolio-form";

const AddPortfolio = () => {
  return (
    <div className="pb-20">
      <h2 className="text-primary font-semibold mb-6">Add Portfolio</h2>
      <PortfolioForm mode="create" />
    </div>
  );
};

export default AddPortfolio;
