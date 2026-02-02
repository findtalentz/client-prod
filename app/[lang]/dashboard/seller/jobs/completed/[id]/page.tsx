import ApiResponse from "@/schemas/ApiRespose";
import CommentType from "@/schemas/Comment";
import Job from "@/schemas/Job";
import Review from "@/schemas/Reviews";
import apiClient from "@/services/api-client";
import { Grid } from "@radix-ui/themes";
import Comment from "./comment";
import ReviewDetails from "./review";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const JobDetails = async ({ params }: Props) => {
  const { id } = await params;
  const { data: job } = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);
  const { data: review } = await apiClient.get<ApiResponse<Review>>(
    `/reviews/job/${id}`
  );

  const { data: comments } = await apiClient.get<ApiResponse<CommentType[]>>(
    `/comments/job/${job.data._id}`
  );

  return (
    <Grid columns={{ initial: "1", md: "3fr 2fr" }} gap="6">
      <div className="px-4 pb-10 overflow-y-scroll">
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
                <p className="font-medium text-black">Category</p>
                <p>{job.data.category.name || "Not specified"}</p>
              </div>
              <div>
                <p className="font-medium text-black">Company</p>
                <p>{job.data.company || "Not specified"}</p>
              </div>
              <div>
                <p className="font-medium text-black">Location</p>
                <p>{job.data.location || "Not specified"}</p>
              </div>
              <div>
                <p className="font-medium text-black">Job Type</p>
                <p>{job.data.jobType || "Not specified"}</p>
              </div>
              <div>
                <p className="font-medium text-black">Experience Level</p>
                <p>{job.data.requiredExperienceLevel || "Not specified"}</p>
              </div>
              <div>
                <p className="font-medium text-black">Duration</p>
                <p>{job.data.duration || "Not specified"}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Skills Required</h3>
            {job.data.requiredSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {job.data.requiredSkills.map((skill) => (
                  <span key={skill} className="bg-white px-3 py-1 rounded-full">
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
                <p className="font-medium text-black">Budget Type</p>
                <p>{job.data.budgetType || "Not specified"}</p>
              </div>
              <div>
                <p className="font-medium text-black">Budget Amount</p>
                <p>{job.data.budgetAmount || "Not specified"}</p>
              </div>
            </div>
          </div>

          {review.data && <ReviewDetails review={review.data} />}
        </div>
      </div>

      <section className="px-6 py-4">
        <h3 className="text-lg font-semibold mb-4">Activity</h3>

        <ul className="space-y-6">
          {comments.data.map((comment) => (
            <li key={comment._id}>
              <Comment comment={comment} />
            </li>
          ))}
        </ul>
      </section>
    </Grid>
  );
};

export default JobDetails;
