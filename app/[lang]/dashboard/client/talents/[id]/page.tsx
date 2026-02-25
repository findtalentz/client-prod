import AddTalentWishlist from "@/components/add-talent-wishlist";
import MessageSentButton from "@/components/message-sent-button";
import PortfolioCard from "@/components/portfolio-card";
import Reviews from "@/components/reviews";
import ServiceCard from "@/components/service-card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import ApiResponse from "@/schemas/ApiRespose";
import Education from "@/schemas/Education";
import Portfolio from "@/schemas/Portfolio";
import Review from "@/schemas/Reviews";
import Service from "@/schemas/Service";
import User from "@/schemas/User";
import apiClient from "@/services/api-client";
import { Avatar, Flex, Grid } from "@radix-ui/themes";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const TalentDetails = async ({ params }: Props) => {
  const { id } = await params;
  const [
    { data },
    { data: completedjobs },
    { data: educations },
    { data: portfolios },
    { data: services },
    { data: reviews },
  ] = await Promise.all([
    apiClient.get<ApiResponse<User>>(`/users/${id}`),
    apiClient.get<ApiResponse<number>>("/jobs/count", {
      params: { sellerId: id, status: "COMPLETED" },
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
  ]);
  const user = data.data;

  return (
    <Grid columns={{ initial: "1", md: "1fr 440px" }} gap="6">
      <div className="space-y-6 px-4">
        <Link
          href="/dashboard/client/talents"
          className="flex items-center mb-8!"
        >
          <FaAngleLeft className="mr-2" /> Back
        </Link>

        <div className="flex gap-4">
          <Avatar
            size="9"
            radius="full"
            src={user.image}
            fallback="User Avatar"
          />
          <div>
            <h2> {user.firstName + " " + user.lastName} </h2>
            <div className="flex items-center gap-4">
              <p> {user.title} </p>
              <p className="flex items-center">
                <GrLocation className="mr-2" /> {user.location}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-center mt-4">
              {user.skills?.map((skill, index) => (
                <Badge variant="secondary" key={index}>
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h3 className="mb-1">About</h3>
          <Markdown remarkPlugins={[remarkGfm]}>{user.about}</Markdown>
        </div>
        {services.count > 0 && (
          <div>
            <h3 className="mb-2">Services</h3>
            <Grid columns={{ initial: "1", md: "3" }} gap="5">
              {services.data.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </Grid>
          </div>
        )}
        <div className="space-y-10">
          {portfolios.count > 0 && (
            <div className="space-y-6">
              <h3>Portfolios</h3>
              <Grid columns={{ initial: "1", md: "3" }} gap="5">
                {portfolios.data.map((portfolio) => (
                  <PortfolioCard key={portfolio._id} portfolio={portfolio} />
                ))}
              </Grid>
            </div>
          )}
        </div>
        {reviews.count > 0 && <Reviews reviews={reviews.data} />}
      </div>
      <div className="space-y-6 p-4">
        <div className="flex p-3 gap-3 w-full justify-end">
          <AddTalentWishlist talentId={user._id} />
          <MessageSentButton
            seller={user._id}
            className="bg-primary text-white hover:bg-primary/90 hover:text-white"
          />
        </div>
        <div className="p-3 border rounded-xl shadow">
          <p className="font-semibold text-xl">Work History</p>
          <div className="py-2 text-gray-500">
            <p>
              <strong> {completedjobs.data} </strong> Completed Job
            </p>
          </div>
        </div>
        <div className="p-3 border rounded-xl shadow">
          <p className="font-semibold text-xl">Educations</p>

          {educations &&
            educations.count > 0 &&
            educations.data.map((education) => (
              <div key={education._id} className="py-2">
                <div>
                  <p className="font-medium text-gray-600">
                    {education.degree}
                  </p>
                  <p className="text-gray-400"> {education.institution} </p>
                </div>
                <Flex align="center" justify="between">
                  <p className="text-[12px] text-gray-400">
                    Finished At {formatDate(education.endDate)}
                  </p>
                </Flex>
              </div>
            ))}
        </div>

        <div className="p-3 border rounded-xl shadow">
          <p className="font-semibold text-xl">Languages</p>
          <ul className="py-2 text-gray-500">
            {user.languages?.map((language, i) => (
              <li className="text-gray-500" key={i}>
                {language}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Grid>
  );
};

export default TalentDetails;
