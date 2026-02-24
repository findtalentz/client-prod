import getSessionFromToken from "@/actions/get-session-from-token";
import { redirect } from "next/navigation";
import SignupPageLayout from "../_components/signup-page-layout";

export default async function SignUpFreelancer() {
  const sessionData = await getSessionFromToken();
  if (sessionData) {
    redirect("/dashboard");
  }

  return <SignupPageLayout role="SELLER" />;
}
