import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa6";

function IdentityVerificationPage() {
  return (
    <div className="flex items-center justify-center h-[calc(100dvh-70px)]">
      <div className="flex items-center justify-center flex-col gap-6 w-[300px] md:w-[400px]">
        <div className="text-center">
          <h2 className="text-primary-dark">Verify Your Identity</h2>
          <p>Select type of document you would like to upload</p>
        </div>
        <Card className="w-full">
          <Link
            href="/identity-verify/passport"
            className="px-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="w-15 h-15 rounded-full flex items-center justify-center bg-[#AAEBCA4D]">
                <Image
                  width={30}
                  height={30}
                  src="/icons/passport.png"
                  alt="passport"
                />
              </div>
              <span className="text-2xl">Passport</span>
            </div>
            <FaChevronRight />
          </Link>
        </Card>
        <Card className="w-full">
          <Link
            href="/identity-verify/id"
            className="px-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="w-15 h-15 rounded-full flex items-center justify-center bg-[#AAEBCA4D]">
                <Image
                  width={30}
                  height={30}
                  src="/icons/id.png"
                  alt="passport"
                />
              </div>
              <span className="text-2xl">Id Card</span>
            </div>
            <FaChevronRight />
          </Link>
        </Card>
        <Link className={buttonVariants({ variant: "link" })} href="/dashboard">
          Skip For Now
        </Link>
      </div>
    </div>
  );
}

export default IdentityVerificationPage;
