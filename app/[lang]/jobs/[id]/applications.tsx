"use client";

import useJobApplications from "@/hooks/useJobApplications";
import useSession from "@/hooks/useSession";
import ApplicationCard from "./application-card";
import useSellerApplication from "@/hooks/useSellerApplication";

interface Props {
  jobId: string;
}

const Applications = ({ jobId }: Props) => {
  const { data: session } = useSession();
  const { data: application } = useSellerApplication(jobId);
  const { data: applications } = useJobApplications(jobId);
  if (!session) return null;

  return (
    <div>
      {session &&
        session.data.role === "SELLER" &&
        application &&
        application.data && (
          <div>
            <h3 className="mb-3">My Application</h3>
            {application && <ApplicationCard application={application.data} />}
          </div>
        )}
      {session &&
        session.data.role === "CLIENT" &&
        applications &&
        applications.count > 0 && (
          <div className="space-y-5">
            <h3 className="mb-3">Applications</h3>
            {applications.data.map((application) => (
              <ApplicationCard
                key={application._id}
                application={application}
              />
            ))}
          </div>
        )}
    </div>
  );
};

export default Applications;
