import TalentActions from "@/components/talent-actions";
import TalentCard from "@/components/talent-card";
import Container from "@/components/ui/container";
import ApiResponse from "@/schemas/ApiRespose";
import { Talent } from "@/schemas/Talent";
import apiClient from "@/services/api-client";
import { Grid } from "@radix-ui/themes";

interface Props {
  searchParams: Promise<{
    search: string;
  }>;
}

const TalentsPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const search = params.search ? params.search : null;
  const { data } = await apiClient.get<ApiResponse<Talent[]>>("/talents", {
    params: {
      search,
    },
  });
  return (
    <Container className="py-6 mb-8 md:mb-3">
      <h2 className="text-primary mb-6">Talents</h2>
      <TalentActions />
      <Grid columns={{ initial: "1", md: "2" }} className="gap-8 md:gap-6">
        {data.data.map((talent) => (
          <TalentCard key={talent._id} talent={talent} />
        ))}
      </Grid>
    </Container>
  );
};

export default TalentsPage;

export const dynamic = "force-dynamic";
