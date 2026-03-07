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
import SaveProfileButton from "./save-profile-button";

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
    <div className="space-y-8 pb-20">
      <h2 className="text-primary font-semibold">Profile Preview</h2>

      {/* Header */}
      <div className="border rounded-2xl p-6 shadow-sm">
        <Flex gap="5" align="start">
          <Avatar
            src={user.image}
            fallback={user.firstName}
            size="8"
            radius="full"
          />
          <div className="space-y-3">
            <div>
              <h3>{user.firstName} {user.lastName}</h3>
              <Flex align="center" gap="4">
                <Text className="text-gray-500">{user.title}</Text>
                <Text className="text-gray-500 flex items-center gap-1">
                  <SlLocationPin className="text-xs" /> {user.location}
                </Text>
              </Flex>
            </div>
            {user.skills && user.skills.length > 0 && (
              <Flex wrap="wrap" gap="2">
                {user.skills.map((skill, i) => (
                  <Badge className="bg-primary/60 rounded-full text-xs" key={i}>
                    {skill}
                  </Badge>
                ))}
              </Flex>
            )}
          </div>
        </Flex>
      </div>

      {/* Education & Languages */}
      <Grid columns={{ initial: "1", md: "2" }} gap="4">
        {educations && educations.count > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">Education</h4>
            {educations.data.map((education) => (
              <div
                className="rounded-2xl border p-4 space-y-2"
                key={education._id}
              >
                <p className="font-medium">{education.degree}</p>
                <p className="text-sm text-gray-500">{education.institution}</p>
                <Flex align="center" justify="between">
                  <p className="text-xs text-gray-400">
                    {formatDate(education.startDate)}
                  </p>
                  {education.endDate && (
                    <p className="text-xs text-gray-400">
                      {formatDate(education.endDate)}
                    </p>
                  )}
                </Flex>
              </div>
            ))}
          </div>
        )}
        {user.languages && user.languages.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Languages</h4>
            <div className="rounded-2xl border p-4">
              <ul className="space-y-1">
                {user.languages.map((language, i) => (
                  <li key={i} className="text-sm text-gray-600">
                    {language}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Grid>

      {/* About */}
      {user.about && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">About</h4>
          <div className="prose prose-sm max-w-none text-gray-600">
            <Markdown remarkPlugins={[remarkGfm]}>{user.about}</Markdown>
          </div>
        </div>
      )}

      {/* Services */}
      {services && services.count > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Services</h4>
          <Grid columns={{ initial: "1", md: "2" }} gap="4">
            {services.data.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </Grid>
        </div>
      )}

      {/* Portfolios */}
      {portfolios && portfolios.count > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Portfolios</h4>
          <Grid columns={{ initial: "1", md: "2" }} gap="4">
            {portfolios.data.map((portfolio) => (
              <PortfolioCard key={portfolio._id} portfolio={portfolio} />
            ))}
          </Grid>
        </div>
      )}

      <SaveProfileButton />
    </div>
  );
}
