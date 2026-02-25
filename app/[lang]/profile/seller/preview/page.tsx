import getSession from "@/actions/get-session";
import PortfolioCard from "@/components/portfolio-card";
import ServiceCard from "@/components/service-card";
import { Badge } from "@/components/ui/badge";
import Text from "@/components/ui/text";
import { formatDate } from "@/lib/utils";
import ApiResponse from "@/schemas/ApiRespose";
import Education from "@/schemas/Education";
import Portfolio from "@/schemas/Portfolio";
import Service from "@/schemas/Service";
import apiClient from "@/services/api-client";
import { Avatar, Flex, Grid } from "@radix-ui/themes";
import { SlLocationPin } from "react-icons/sl";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function PreviewPage() {
  const [user, { data: educations }, { data: portfolios }, { data: services }] =
    await Promise.all([
      getSession(),
      apiClient.get<ApiResponse<Education[]>>("/educations"),
      apiClient.get<ApiResponse<Portfolio[]>>("/portfolios"),
      apiClient.get<ApiResponse<Service[]>>("/services"),
    ]);

  if (!user) return null;

  return (
    <div className="space-y-10 h-[80dvh] overflow-y-auto pb-20 px-10">
      <Flex gap="5">
        <Avatar
          src={user.image}
          fallback={user.firstName}
          size="9"
          radius="full"
        />
        <div className="space-y-5">
          <div>
            <h2> {user.firstName + " " + user.lastName} </h2>
            <Flex align="center" gap="6">
              <Text className="text-gray-500"> {user.title} </Text>
              <Text className="text-gray-500 flex items-center gap-1">
                <SlLocationPin /> {user.location}
              </Text>
            </Flex>
          </div>
          <Flex wrap="wrap" gap="2">
            {user.skills?.map((skill, i) => (
              <Badge className="bg-primary/60 rounded-full" key={i}>
                {skill}
              </Badge>
            ))}
          </Flex>
        </div>
      </Flex>

      <Grid columns={{ initial: "1", md: "2" }} gap="5">
        <div className="flex items-center justify-center gap-6 flex-col">
          {educations &&
            educations.count > 0 &&
            educations.data.map((education) => (
              <div
                className="rounded-3xl border p-5 space-y-3 flex-1 w-full"
                key={education._id}
              >
                <h4>Education</h4>
                <div>
                  <p> {education.degree} </p>
                  <p> {education.institution} </p>
                </div>
                <Flex align="center" justify="between">
                  <p className="text-[12px]">
                    {formatDate(education.startDate)}
                  </p>
                  <p className="text-[12px]">{formatDate(education.endDate)}</p>
                </Flex>
              </div>
            ))}
        </div>
        <div>
          <div className="rounded-3xl border p-5 space-y-3 w-full h-full">
            <h4>Languages</h4>
            <ul>
              {user.languages?.map((language, i) => (
                <li key={i}> {language} </li>
              ))}
            </ul>
          </div>
        </div>
      </Grid>

      <div>
        <p className="font-bold mb-3">About</p>
        <Markdown remarkPlugins={[remarkGfm]}>{user.about}</Markdown>
      </div>
      {services.count > 0 && (
        <div>
          <h3 className="mb-4">Services</h3>
          <Grid columns={{ initial: "1", md: "2" }} gap="5">
            {services &&
              services.count > 0 &&
              services.data.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
          </Grid>
        </div>
      )}

      {portfolios.count > 0 && (
        <div>
          <h3 className="mb-4">Portfolios</h3>
          <Grid columns={{ initial: "1", md: "2" }} gap="5">
            {portfolios.data.map((portfolio) => (
              <PortfolioCard key={portfolio._id} portfolio={portfolio} />
            ))}
          </Grid>
        </div>
      )}
    </div>
  );
}
