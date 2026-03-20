import { Role } from "@/schemas/Role";
import Image from "next/image";
import SignupForm from "../signup-form";

interface Props {
  role: Role;
}

function SignupPageLayout({ role }: Props) {
  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Form card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 space-y-6">
          <div>
            <h2 className="text-primary text-2xl md:text-3xl font-bold italic">
              Create Your Account
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Enter the details below to get started
            </p>
          </div>
          <SignupForm role={role} />
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

export default SignupPageLayout;
