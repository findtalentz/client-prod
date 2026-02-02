import AddJobWishlist from "@/components/add-job-wishlist";
import { CreateJobApplication } from "@/components/create-job-application";
import Container from "@/components/ui/container";
import ApiResponse from "@/schemas/ApiRespose";
import Job from "@/schemas/Job";
import apiClient from "@/services/api-client";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import Applications from "./applications";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

async function JobDetails({ params }: Props) {
  const { id } = await params;
  const { data: job } = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);

  return (
    <Container>
      <div className="py-5 px-4 flex items-center justify-between">
        <Link href="/jobs">
          <FaArrowLeft />
        </Link>
        <div className="flex items-center gap-2">
          <div className="relative">
            <AddJobWishlist
              jobId={job.data._id}
              className="top-0 left-0 relative"
            />
          </div>
          <CreateJobApplication job={job.data} />
        </div>
      </div>

      <div>
        <div className="px-4 pb-10 overflow-y-auto">
          <div className="space-y-5">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4"> {job.data.title} </h3>
              <p className="whitespace-pre-line">
                {job.data.description || "No description provided"}
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Job Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-mediu text-black">Category</p>
                  <p>{job.data.category.name || "Not specified"}</p>
                </div>
                <div>
                  <p className="font-mediu text-black">Company</p>
                  <p>{job.data.company || "Not specified"}</p>
                </div>
                <div>
                  <p className="font-mediu text-black">Location</p>
                  <p>{job.data.location || "Not specified"}</p>
                </div>
                <div>
                  <p className="font-mediu text-black">Job Type</p>
                  <p>{job.data.jobType || "Not specified"}</p>
                </div>
                <div>
                  <p className="font-mediu text-black">Experience Level</p>
                  <p>{job.data.requiredExperienceLevel || "Not specified"}</p>
                </div>
                <div>
                  <p className="font-mediu text-black">Duration</p>
                  <p>{job.data.duration || "Not specified"}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Skills Required</h3>
              {job.data.requiredSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {job.data.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-white px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p>No skills specified</p>
              )}
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Budget Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-mediu text-black">Budget Type</p>
                  <p>{job.data.budgetType || "Not specified"}</p>
                </div>
                <div>
                  <p className="font-mediu text-black">Budget Amount</p>
                  <p>${job.data.budgetAmount || "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3 px-4">
        <Applications jobId={job.data._id} />
      </div>
    </Container>
  );
}

export default JobDetails;
