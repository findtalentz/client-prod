import { NextRequest, NextResponse } from "next/server";
import getSessionFromToken, {
  SessionResult,
} from "./actions/get-session-from-token";

// Constants
const PUBLIC_FILE = /\.(.*)$/;
const LOCALES = ["en", "ch"] as const;
/**
 * Get user locale from request
 */
function getLocale(req: NextRequest): string {
  const acceptLanguage = req.headers.get("accept-language");
  const primaryLang = acceptLanguage?.split(",")[0]?.split("-")[0] || "en";
  return LOCALES.includes(primaryLang as any) ? primaryLang : "en";
}

/**
 * Create localized redirect response
 */
function redirectTo(req: NextRequest, path: string): NextResponse {
  const locale = getLocale(req);
  const url = new URL(`/${locale}${path}`, req.url);
  return NextResponse.redirect(url);
}

/**
 * Check if redirect is needed to avoid unnecessary redirects
 */
function shouldRedirect(req: NextRequest, targetPath: string): boolean {
  const { pathname } = req.nextUrl;
  const locale = getLocale(req);
  const fullTargetPath = `/${locale}${targetPath}`;
  return pathname !== fullTargetPath;
}

/**
 * Extract path without locale prefix
 */
function getPathWithoutLocale(pathname: string): string {
  const localeSegment = pathname.split("/")[1];
  const hasLocale = LOCALES.includes(localeSegment as any);
  return hasLocale
    ? pathname.replace(`/${localeSegment}`, "") || "/"
    : pathname;
}

/**
 * Check if path matches any pattern
 */
function pathMatches(path: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(path));
}

export async function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;

    // Skip public files
    if (PUBLIC_FILE.test(pathname)) {
      return NextResponse.next();
    }

    // Handle locale redirection
    const hasLocale = LOCALES.some(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!hasLocale) {
      const locale = getLocale(req);
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}${pathname}`;
      return NextResponse.redirect(url);
    }

    const currentLocale = pathname.split("/")[1];
    const pathWithoutLocale = getPathWithoutLocale(pathname);

    // Get session data
    const sessionData: SessionResult = await getSessionFromToken();

    // Handle unauthenticated users
    if (!sessionData) {
      const isProtectedPath = pathMatches(pathWithoutLocale, [
        /^\/dashboard/,
        /^\/email-verify/,
        /^\/refer/,
        /^\/profile/,
        /^\/role/,
      ]);

      if (isProtectedPath) {
        if (shouldRedirect(req, "/log-in")) {
          return redirectTo(req, "/log-in");
        }
      }
      return NextResponse.next();
    }

    // User is authenticated - extract session data
    const { session } = sessionData;
    const { role, emailStatus, identityStatus } = session;

    // Email verification flow
    if (
      emailStatus === "UNVERIFIED" &&
      !pathWithoutLocale.startsWith("/email-verify")
    ) {
      if (shouldRedirect(req, "/email-verify")) {
        return redirectTo(req, "/email-verify");
      }
    }

    if (
      emailStatus === "VERIFIED" &&
      pathWithoutLocale.startsWith("/email-verify")
    ) {
      if (shouldRedirect(req, "/dashboard")) {
        return redirectTo(req, "/dashboard");
      }
    }

    // Identity verification flow
    if (
      identityStatus === "VERIFIED" &&
      pathWithoutLocale.startsWith("/identity-verify")
    ) {
      if (shouldRedirect(req, "/dashboard")) {
        return redirectTo(req, "/dashboard");
      }
    }

    // Role selection flow
    if (
      !role &&
      pathMatches(pathWithoutLocale, [/^\/dashboard/, /^\/profile/])
    ) {
      if (shouldRedirect(req, "/role")) {
        return redirectTo(req, "/role");
      }
    }

    if (role && pathWithoutLocale.startsWith("/role")) {
      if (shouldRedirect(req, "/dashboard")) {
        return redirectTo(req, "/dashboard");
      }
    }

    // Role-based access control
    if (role === "CLIENT" && pathWithoutLocale.startsWith("/seller")) {
      if (shouldRedirect(req, "/dashboard/client")) {
        return redirectTo(req, "/dashboard/client");
      }
    }

    if (role === "SELLER" && pathWithoutLocale.startsWith("/client")) {
      if (shouldRedirect(req, "/dashboard/seller")) {
        return redirectTo(req, "/dashboard/seller");
      }
    }

    // Prevent authenticated users from accessing auth pages
    if (pathMatches(pathWithoutLocale, [/^\/log-in/, /^\/sign-up/])) {
      if (shouldRedirect(req, "/dashboard")) {
        return redirectTo(req, "/dashboard");
      }
    }

    // Add security headers for authenticated routes
    if (pathWithoutLocale.startsWith("/dashboard")) {
      const response = NextResponse.next();
      response.headers.set("X-Frame-Options", "DENY");
      response.headers.set("X-Content-Type-Options", "nosniff");
      return response;
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware execution error:", error);

    // Don't redirect to error page if we're already there
    if (!req.nextUrl.pathname.includes("/error")) {
      return redirectTo(req, "/error");
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sw.js|site.webmanifest).*)",
  ],
};
