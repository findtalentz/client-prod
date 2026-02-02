import Container from "@/components/ui/container";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <Container className="md:min-h-[calc(100dvh-65px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl space-y-8 md:space-y-16">
        <h3 className="text-center text-primary-dark font-medium text-[18px] md:text-[24px] mb-20">
          Please Select Your Role
        </h3>

        <div className="flex items-center justify-center flex-col md:flex-row gap-26 md:gap-6">
          <RoleCard
            title="Job Seeker"
            imageSrc="/signup_client.png"
            altText="Freelancer"
            href="/sign-up/seller"
          />
          <RoleCard
            title="Employer"
            imageSrc="/signup_seller.png"
            altText="Client"
            href="/sign-up/client"
          />
        </div>
      </div>
    </Container>
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
