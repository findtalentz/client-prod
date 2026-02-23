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
      redirect("/dashboard/client");
    case "SELLER":
      redirect("/dashboard/seller");
    case "ADMIN":
      redirect("/dashboard/admin");
    default:
      return <div>Unauthorized access</div>;
  }
}

export default Profile;
