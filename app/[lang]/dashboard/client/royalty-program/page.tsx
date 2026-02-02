import apiClient from "@/services/api-client";
import RoyaltyCard from "./_components/royalty-card";
import ApiResponse from "@/schemas/ApiRespose";
import Royalty from "@/schemas/Royalty";

const RoyaltyProgram = async () => {
  const { data } = await apiClient.get<ApiResponse<Royalty>>("/royalty/client");
  return (
    <div>
      <h2 className="mb-6 text-primary-dark">Royalty Program</h2>
      <div className="space-y-6">
        <RoyaltyCard type="Welcome" step={data.data.step1} />
        <RoyaltyCard type="Task" step={data.data.step2} />
        <RoyaltyCard type="Pro" step={data.data.step3} />
        <RoyaltyCard type="Expert" step={data.data.step4} />
        <RoyaltyCard type="Master" step={data.data.step5} />
      </div>
    </div>
  );
};

export default RoyaltyProgram;
