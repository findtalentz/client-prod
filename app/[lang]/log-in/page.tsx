import OauthButtons from "@/components/oauth-uttons";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./login-form";

export default function Login() {
  return (
    <div className="grid w-full !max-h-[calc(100dvh-65px)] grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center flex-col w-full md:px-6">
        <div className="w-full md:w-[500px] flex items-center justify-between flex-col gap-6 h-[calc(100dvh-70px)] py-10">
          <div />
          <div className="w-full space-y-6">
            <div className="w-full text-start">
              <h2 className="text-primary">Welcome back!</h2>
            </div>
            <LoginForm />
            <div className="text-center w-full">
              <Link
                href="/forgot"
                className="text-primary underline font-semibold"
              >
                Forgot Password?
              </Link>
            </div>
            <OauthButtons message="Or sign in with" />
          </div>

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-primary underline">
              Sign Up here
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden md:block">
        <Image
          src="/join_illustration.jpg"
          width={1200}
          height={1800}
          className="w-full !max-h-[calc(100dvh-65px)] object-cover"
          alt="Illustration"
        />
      </div>
    </div>
  );
}
