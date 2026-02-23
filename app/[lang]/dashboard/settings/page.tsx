import getSession from "@/actions/get-session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function Profile() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  switch (session.role) {
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
