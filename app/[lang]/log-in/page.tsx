import getSessionFromToken from "@/actions/get-session-from-token";
import OauthButtons from "@/components/oauth-uttons";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";

export default async function Login({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const sessionData = await getSessionFromToken();
  if (sessionData) {
    redirect(`/${lang}/dashboard`);
  }
  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Form card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 space-y-6">
          <h2 className="text-primary text-2xl md:text-3xl font-bold italic">
            Please Login to Continue
          </h2>

          <LoginForm />

          <div className="text-center w-full">
            <Link
              href={`/${lang}/forgot`}
              className="text-gray-700 font-semibold text-sm"
            >
              Forgot Password ?
            </Link>
          </div>

          <OauthButtons message="or Sign In with" />

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href={`/${lang}/sign-up`} className="text-primary underline font-medium">
              Sign Up here
            </Link>
          </p>
        </div>

        {/* Right side - logo with glow */}
        <div className="hidden md:flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl scale-125" />
            <Image
              src="/logo_icon_lg.png"
              alt="Talentz logo"
              width={300}
              height={300}
              className="w-[300px] h-auto drop-shadow-[0_0_80px_rgba(255,255,255,0.3)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
