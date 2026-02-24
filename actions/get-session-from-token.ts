"use server";

import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export type Session = {
  _id: string;
  role: "SELLER" | "CLIENT" | "ADMIN" | null;
  emailStatus: "UNVERIFIED" | "VERIFIED";
  identityStatus: "UNVERIFIED" | "VERIFIED" | "PENDING";
  exp?: number;
  iat?: number;
};

export type SessionResult = {
  session: Session;
  token: string;
} | null;

/**
 * Professional session token validator with proper JWT verification
 */
const getSessionFromToken = async (): Promise<SessionResult> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    // No token found
    if (!token?.value) {
      return null;
    }

    // Validate JWT_SECRET exists
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET environment variable is not configured");
      return null;
    }

    // Verify token signature and decode
    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify(token.value, secret);

    // Validate token structure
    if (!payload._id || !payload.emailStatus || !payload.identityStatus) {
      console.error("Invalid token payload structure");
      return null;
    }

    const session = payload as Session;

    // Check token expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (session.exp && session.exp < currentTime) {
      console.warn("Token expired, clearing cookie");
      cookieStore.delete("token");
      return null;
    }

    return {
      session,
      token: token.value,
    };
  } catch (error: any) {
    if (error.code === "ERR_JWT_EXPIRED") {
      console.warn("JWT token expired");
      try {
        const cookieStore = await cookies();
        cookieStore.delete("token");
      } catch {}
    } else if (error.code === "ERR_JWT_INVALID") {
      console.warn("Invalid JWT token");
    } else {
      console.error("JWT verification error:", error.message);
    }

    return null;
  }
};

export default getSessionFromToken;
