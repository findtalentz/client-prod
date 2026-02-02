"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function VerificationSubmitted() {
  return (
    <main className="flex items-center justify-center min-h-[calc(100dvh-70px)] p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full mb-6">
          <Image src="/icons/pending.png" width={200} height={200} alt="icon" />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          VIdentity Verification Pending
        </h3>

        <p className="text-gray-600 mb-8 !text-sm">
          Your identity has been pending approval. We&apos;ll get back to you
          soon. Let&apos;s set up your profile next.
        </p>

        <div className="space-y-4">
          <Link
            href="/profile"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "w-full py-6 text-base font-medium"
            )}
          >
            Complete Your Profile
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full py-6 text-base font-medium"
            )}
          >
            Back To Dashboard
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Need help?{" "}
          <Link
            href="/contact"
            className="text-primary hover:underline font-medium"
          >
            Contact support
          </Link>
        </p>
      </div>
    </main>
  );
}
