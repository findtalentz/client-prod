import { Role } from "@/schemas/Role";
import Image from "next/image";
import SignupForm from "../signup-form";

interface Props {
  role: Role;
}

function SignupPageLayout({ role }: Props) {
  return (
    <div className="grid w-full max-h-[calc(100dvh-65px)] grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center">
        <div className="space-y-10 w-full md:w-[500px] pt-10 md:pt-0">
          <div>
            <h2 className="text-primary">Sign Up</h2>
            <p>Enter the details below to create an account for you</p>
          </div>
          <SignupForm role={role} />
        </div>
      </div>
      <div className="hidden md:block">
        <Image
          src="/join_illustration.jpg"
          width={1200}
          height={1800}
          className="w-full max-h-[calc(100dvh-65px)] object-cover"
          alt="Illustration"
        />
      </div>
    </div>
  );
}

export default SignupPageLayout;
