"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function VerificationSuccess() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100dvh-70px)] p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex items-center justify-center h-30 w-30 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Verification Successful!
        </h1>

        <p className="text-gray-600 mb-8">
          Your identity verification has been completed successfully. You can
          now access all features of your account.
        </p>

        <div className="space-y-4 flex items-center justify-center flex-col">
          <Link
            href="/profile"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "!py-5 w-full"
            )}
          >
            Set Up Profile
          </Link>
          <Link
            href="/dashboard"
            className={cn(buttonVariants(), "!py-5 w-full")}
          >
            Back To Dashboard
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-500">
          Need help?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}
