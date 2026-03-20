import getSessionFromToken from "@/actions/get-session-from-token";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SignUpPage({
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
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative z-10 w-full max-w-3xl space-y-8">
        <h3 className="text-center text-primary font-bold italic text-2xl md:text-3xl">
          Please Select Your Role
        </h3>

        <div className="flex items-center justify-center flex-col md:flex-row gap-26 md:gap-6">
          <RoleCard
            title="Job Seeker"
            imageSrc="/signup_client.png"
            altText="Freelancer"
            href={`/${lang}/sign-up/seller`}
          />
          <RoleCard
            title="Employer"
            imageSrc="/signup_seller.png"
            altText="Client"
            href={`/${lang}/sign-up/client`}
          />
        </div>
      </div>
    </div>
  );
}

interface RoleCardProps {
  title: string;
  imageSrc: string;
  altText: string;
  href: string;
}

function RoleCard({ title, imageSrc, altText, href }: RoleCardProps) {
  return (
    <Link href={href} passHref>
      <div className="relative md:w-[350px] md:h-[350px] w-[250px] h-[230px] flex flex-col items-center ! justify-end rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
        <Image
          src={imageSrc}
          width={300}
          height={300}
          alt={altText}
          className="w-[200px] md:w-[300px] h-auto transition-all group-hover:scale-105 absolute -top-10"
        />

        <div className="w-full py-4 px-6 text-center">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            {title}
          </h2>
        </div>
      </div>
    </Link>
  );
}
