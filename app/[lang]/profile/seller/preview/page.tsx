import getSession from "@/actions/get-session";
import PortfolioCard from "@/components/portfolio-card";
import ServiceCard from "@/components/service-card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import ApiResponse from "@/schemas/ApiRespose";
import Education from "@/schemas/Education";
import Portfolio from "@/schemas/Portfolio";
import Service from "@/schemas/Service";
import apiClient from "@/services/api-client";
import { Avatar } from "@radix-ui/themes";
import { Briefcase, Calendar, Eye, FolderOpen, Globe, GraduationCap, MapPin } from "lucide-react";
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
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-2 mb-2">
        <Eye className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">Profile Preview</h2>
      </div>
      <p className="text-sm text-gray-500 -mt-4">
        Review your profile before publishing
      </p>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex gap-5 items-start">
          <Avatar
            src={user.image}
            fallback={user.firstName}
            size="8"
            radius="full"
          />
          <div className="space-y-3 flex-1 min-w-0">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </h3>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                {user.title && (
                  <span className="text-sm text-gray-500">{user.title}</span>
                )}
                {user.location && (
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {user.location}
                  </span>
                )}
              </div>
            </div>
            {user.skills && user.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {user.skills.map((skill, i) => (
                  <Badge
                    className="bg-primary/10 text-primary border-0 rounded-full text-xs font-medium"
                    key={i}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Education & Languages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {educations && educations.count > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold text-gray-900">Education</h4>
            </div>
            <div className="space-y-3">
              {educations.data.map((education) => (
                <div
                  className="border-l-2 border-primary/20 pl-3 py-1"
                  key={education._id}
                >
                  <p className="text-sm font-medium text-gray-800">{education.degree}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{education.institution}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {formatDate(education.startDate)}
                      {education.endDate && ` - ${formatDate(education.endDate)}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {user.languages && user.languages.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold text-gray-900">Languages</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.languages.map((language, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* About */}
      {user.about && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">About</h4>
          <div className="prose prose-sm max-w-none text-gray-600 prose-headings:text-gray-800">
            <Markdown remarkPlugins={[remarkGfm]}>{user.about}</Markdown>
          </div>
        </div>
      )}

      {/* Services */}
      {services && services.count > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-semibold text-gray-900">Services</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.data.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        </div>
      )}

      {/* Portfolios */}
      {portfolios && portfolios.count > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FolderOpen className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-semibold text-gray-900">Portfolio</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolios.data.map((portfolio) => (
              <PortfolioCard key={portfolio._id} portfolio={portfolio} />
            ))}
          </div>
        </div>
      )}

      <SaveProfileButton />
    </div>
  );
}
