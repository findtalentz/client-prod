import getSessionFromToken from "@/actions/get-session-from-token";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function Profile() {
  const sessionData = await getSessionFromToken();

  if (!sessionData) {
    redirect("/log-in");
  }

  switch (sessionData.session.role) {
    case "CLIENT":
      redirect("/dashboard/client/settings");
    case "SELLER":
      redirect("/dashboard/seller/settings");
    case "ADMIN":
      redirect("/dashboard/admin/settings");
    default:
      return <div>Unauthorized access</div>;
  }
}

export default Profile;
