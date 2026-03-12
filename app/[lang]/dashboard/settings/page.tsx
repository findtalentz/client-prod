import getSessionFromToken from "@/actions/get-session-from-token";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function Profile({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const sessionData = await getSessionFromToken();

  if (!sessionData) {
    redirect(`/${lang}/log-in`);
  }

  switch (sessionData.session.role) {
    case "CLIENT":
      redirect(`/${lang}/dashboard/client/settings`);
    case "SELLER":
      redirect(`/${lang}/dashboard/seller/settings`);
    default:
      return <div>Unauthorized access</div>;
  }
}

export default Profile;
