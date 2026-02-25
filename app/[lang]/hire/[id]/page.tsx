import getSession from "@/actions/get-session";
import MessageSentButton from "@/components/message-sent-button";
import PortfolioCard from "@/components/portfolio-card";
import Reviews from "@/components/reviews";
import ServiceCard from "@/components/service-card";
import { Badge } from "@/components/ui/badge";
import Container from "@/components/ui/container";
import Text from "@/components/ui/text";
import { formatDate } from "@/lib/utils";
import ApiResponse from "@/schemas/ApiRespose";
import Education from "@/schemas/Education";
import Portfolio from "@/schemas/Portfolio";
import Review from "@/schemas/Reviews";
import Service from "@/schemas/Service";
import User from "@/schemas/User";
import apiClient from "@/services/api-client";
import { Avatar, Flex, Grid } from "@radix-ui/themes";
import { headers } from "next/headers";
import { SlLocationPin } from "react-icons/sl";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    id: string;
  }>;
}
export default async function PreviewPage({ params: searchParams }: Props) {
  const { id } = await searchParams;

  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const ipAddress =
    forwardedFor?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "Unknown";

  const [
    ,
    { data: user },
    { data: educations },
    { data: portfolios },
    { data: services },
    { data: reviews },
    session,
  ] = await Promise.all([
    apiClient.post("/views", {
      type: "Profile",
      ip: ipAddress,
      subjectId: id,
    }),
    apiClient.get<ApiResponse<User>>("/users/public", {
      params: { userId: id },
    }),
    apiClient.get<ApiResponse<Education[]>>("/educations/public", {
      params: { userId: id },
    }),
    apiClient.get<ApiResponse<Portfolio[]>>("/portfolios/public", {
      params: { userId: id },
    }),
    apiClient.get<ApiResponse<Service[]>>("/services/public", {
      params: { userId: id },
    }),
    apiClient.get<ApiResponse<Review[]>>(`/reviews/seller/${id}`),
    getSession(),
  ]);

  return (
    <Container className="py-10">
      <div className="space-y-10 pb-20">
        <div className="flex items-start justify-between mb-5 flex-col md:flex-row">
          <div className="flex gap-5 flex-col md:flex w-full items-center md:items-start md:flex-row mb-6">
            <Avatar
              src={user.data.image ?? undefined}
              fallback={user.data.firstName?.[0] ?? "U"}
              size="9"
              radius="full"
            />
            <div className="space-y-5">
              <div>
                <h2>
                  {`${user.data.firstName ?? ""} ${user.data.lastName ?? ""}`}
                </h2>
                <Flex align="center" gap="6">
                  <Text className="text-gray-500">{user.data.title ?? ""}</Text>
                  {user.data.location && (
                    <Text className="text-gray-500 flex items-center gap-1">
                      <SlLocationPin /> {user.data.location}
                    </Text>
                  )}
                </Flex>
              </div>
              {user.data.skills && (
                <Flex wrap="wrap" gap="2">
                  {user.data.skills.map((skill, i) => (
                    <Badge className="bg-primary/60 rounded-full" key={i}>
                      {skill}
                    </Badge>
                  ))}
                </Flex>
              )}
            </div>
            {session && session.role === "CLIENT" && (
              <div className="block md:hidden">
                <MessageSentButton seller={user.data._id} />
              </div>
            )}
          </div>
          {session && session.role === "CLIENT" && (
            <div className="hidden md:block">
              <MessageSentButton seller={user.data._id} />
            </div>
          )}
        </div>

        <Grid columns={{ initial: "1", md: "2" }} align="center" gap="5">
          {educations?.data?.map((education) => (
            <div
              className="rounded-xl border p-5 space-y-3"
              key={education._id}
            >
              <p className="font-bold mb-3">Education</p>
              <div>
                <p> {education.degree} </p>
                <p> {education.institution} </p>
              </div>
              <Flex align="center" justify="between">
                <p className="text-[12px]">{formatDate(education.startDate)}</p>
                <p className="text-[12px]">{formatDate(education.endDate)}</p>
              </Flex>
            </div>
          ))}
          <div className="rounded-xl border p-5 h-full">
            <p className="font-bold mb-3">Languages</p>
            <ul>
              {user.data.languages?.map((language, i) => (
                <li key={i}> {language} </li>
              ))}
            </ul>
          </div>
        </Grid>

        {user.data.about && (
          <div>
            <p className="font-bold mb-3">About</p>
            <Markdown remarkPlugins={[remarkGfm]}>
              {user.data.about ?? ""}
            </Markdown>
          </div>
        )}
      </div>
      <div className="space-y-10">
        {portfolios.count > 0 && (
          <div className="space-y-6">
            <h3>Portfolios</h3>
            <Flex gap="6" wrap="wrap" direction="row" className="w-full">
              {portfolios.data.map((portfolio) => (
                <div key={portfolio._id} className="w-[420px]">
                  <PortfolioCard portfolio={portfolio} />
                </div>
              ))}
            </Flex>
          </div>
        )}
        {services.count > 0 && (
          <div className="space-y-6">
            <h3>Services</h3>
            <Flex gap="6" wrap="wrap" direction="row" className="w-full">
              {services.data.map((service) => (
                <div key={service._id} className="w-[420px]">
                  <ServiceCard service={service} />
                </div>
              ))}
            </Flex>
          </div>
        )}

        {reviews.count > 0 && <Reviews reviews={reviews.data} />}
      </div>
    </Container>
  );
}
