"use client";

import Cookies from "js-cookie";
import { useSearchParams, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

function OauthProviders({ children }: PropsWithChildren) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      Cookies.set("token", token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
      // Remove token from URL to prevent exposure in browser history
      window.history.replaceState({}, "", window.location.pathname);
      window.location.href = "/dashboard";
    }
  }, [token, router]);

  return <>{children}</>;
}

export default OauthProviders;
