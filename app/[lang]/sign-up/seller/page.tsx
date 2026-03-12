import getSessionFromToken from "@/actions/get-session-from-token";
import { redirect } from "next/navigation";
import SignupPageLayout from "../_components/signup-page-layout";

export default async function SignUpFreelancer({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const sessionData = await getSessionFromToken();
  if (sessionData) {
    redirect(`/${lang}/dashboard`);
  }

  return <SignupPageLayout role="SELLER" />;
}
