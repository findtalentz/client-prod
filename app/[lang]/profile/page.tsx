import getSession from "@/actions/get-session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function Profile() {
  const session = await getSession();
  if (!session) {
    redirect("/log-in");
  }

  switch (session.role) {
    case "CLIENT":
      redirect("/profile/client");
    case "SELLER":
      redirect("/profile/seller");
    default:
      return <div>Unauthorized access</div>;
  }
}

export default Profile;
