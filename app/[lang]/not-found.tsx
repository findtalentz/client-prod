import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-primary-dark flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Circular dark vignette behind logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-black/20 blur-3xl" />
      </div>

      {/* Watermark logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/logo_icon_lg.png"
          alt=""
          width={500}
          height={500}
          className="w-[350px] md:w-[500px] h-auto opacity-20"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-3">
        <h1 className="text-8xl md:text-[12rem] !font-black leading-none text-white">
          404 error
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-white">
          Oops! Page Not Found
        </h2>
        <p className="text-sm md:text-base text-white/60 max-w-md mx-auto">
          We&apos;re sorry, the page you requested could not be found
          <br />
          Please go back to the home page
        </p>
        <div className="pt-4">
          <Button variant="light" size="lg" asChild>
            <Link href="/">
              Go Back To Home &rarr;
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
