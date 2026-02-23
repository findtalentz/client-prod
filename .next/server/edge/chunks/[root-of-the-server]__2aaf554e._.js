(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__2aaf554e._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/actions/get-session-from-token.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/jwt/verify.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$headers$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/headers.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/request/cookies.js [middleware-edge] (ecmascript)");
"use server";
;
;
/**
 * Professional session token validator with proper JWT verification
 */ const getSessionFromToken = async ()=>{
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["cookies"])();
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
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["jwtVerify"])(token.value, secret);
        // Validate token structure
        if (!payload._id || !payload.emailStatus || !payload.identityStatus) {
            console.error("Invalid token payload structure");
            return null;
        }
        const session = payload;
        // Check token expiration
        const currentTime = Math.floor(Date.now() / 1000);
        if (session.exp && session.exp < currentTime) {
            console.warn("Token expired, clearing cookie");
            cookieStore.delete("token");
            return null;
        }
        return {
            session,
            token: token.value
        };
    } catch (error) {
        // Handle specific JWT errors
        if (error.code === "ERR_JWT_EXPIRED") {
            console.warn("JWT token expired");
        } else if (error.code === "ERR_JWT_INVALID") {
            console.warn("Invalid JWT token");
        } else {
            console.error("JWT verification error:", error.message);
        }
        // Clear invalid token
        try {
            const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["cookies"])();
            cookieStore.delete("token");
        } catch (deleteError) {
            console.error("Failed to clear invalid token:", deleteError);
        }
        return null;
    }
};
const __TURBOPACK__default__export__ = getSessionFromToken;
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$get$2d$session$2d$from$2d$token$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/get-session-from-token.ts [middleware-edge] (ecmascript)");
;
;
// Constants
const PUBLIC_FILE = /\.(.*)$/;
const LOCALES = [
    "en",
    "ch"
];
/**
 * Get user locale from request
 */ function getLocale(req) {
    const acceptLanguage = req.headers.get("accept-language");
    const primaryLang = acceptLanguage?.split(",")[0]?.split("-")[0] || "en";
    return LOCALES.includes(primaryLang) ? primaryLang : "en";
}
/**
 * Create localized redirect response
 */ function redirectTo(req, path) {
    const locale = getLocale(req);
    const url = new URL(`/${locale}${path}`, req.url);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
}
/**
 * Check if redirect is needed to avoid unnecessary redirects
 */ function shouldRedirect(req, targetPath) {
    const { pathname } = req.nextUrl;
    const locale = getLocale(req);
    const fullTargetPath = `/${locale}${targetPath}`;
    return pathname !== fullTargetPath;
}
/**
 * Extract path without locale prefix
 */ function getPathWithoutLocale(pathname) {
    const localeSegment = pathname.split("/")[1];
    const hasLocale = LOCALES.includes(localeSegment);
    return hasLocale ? pathname.replace(`/${localeSegment}`, "") || "/" : pathname;
}
/**
 * Check if path matches any pattern
 */ function pathMatches(path, patterns) {
    return patterns.some((pattern)=>pattern.test(path));
}
async function middleware(req) {
    try {
        const { pathname } = req.nextUrl;
        // Skip public files
        if (PUBLIC_FILE.test(pathname)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
        }
        // Handle locale redirection
        const hasLocale = LOCALES.some((locale)=>pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);
        if (!hasLocale) {
            const locale = getLocale(req);
            const url = req.nextUrl.clone();
            url.pathname = `/${locale}${pathname}`;
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
        }
        const currentLocale = pathname.split("/")[1];
        const pathWithoutLocale = getPathWithoutLocale(pathname);
        // Get session data
        const sessionData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$get$2d$session$2d$from$2d$token$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"])();
        // Handle unauthenticated users
        if (!sessionData) {
            const isProtectedPath = pathMatches(pathWithoutLocale, [
                /^\/dashboard/,
                /^\/verify/,
                /^\/refer/,
                /^\/deposit-success/,
                /^\/profile/,
                /^\/role/
            ]);
            if (isProtectedPath) {
                if (shouldRedirect(req, "/log-in")) {
                    return redirectTo(req, "/log-in");
                }
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
        }
        // User is authenticated - extract session data
        const { session } = sessionData;
        const { role, emailStatus, identityStatus } = session;
        // Email verification flow
        if (emailStatus === "UNVERIFIED" && !pathWithoutLocale.startsWith("/email-verify")) {
            if (shouldRedirect(req, "/email-verify")) {
                return redirectTo(req, "/email-verify");
            }
        }
        if (emailStatus === "VERIFIED" && pathWithoutLocale.startsWith("/email-verify")) {
            if (shouldRedirect(req, "/dashboard")) {
                return redirectTo(req, "/dashboard");
            }
        }
        // Identity verification flow
        if (identityStatus === "VERIFIED" && pathWithoutLocale.startsWith("/identity-verify")) {
            if (shouldRedirect(req, "/dashboard")) {
                return redirectTo(req, "/dashboard");
            }
        }
        // Role selection flow
        if (!role && pathMatches(pathWithoutLocale, [
            /^\/dashboard/,
            /^\/profile/
        ])) {
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
        if (pathMatches(pathWithoutLocale, [
            /^\/log-in/,
            /^\/sign-up/
        ])) {
            if (shouldRedirect(req, "/dashboard")) {
                return redirectTo(req, "/dashboard");
            }
        }
        // Add security headers for authenticated routes
        if (pathWithoutLocale.startsWith("/dashboard")) {
            const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
            response.headers.set("X-Frame-Options", "DENY");
            response.headers.set("X-Content-Type-Options", "nosniff");
            return response;
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    } catch (error) {
        console.error("Middleware execution error:", error);
        // Don't redirect to error page if we're already there
        if (!req.nextUrl.pathname.includes("/error")) {
            return redirectTo(req, "/error");
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
}
const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|sw.js|site.webmanifest).*)"
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__2aaf554e._.js.map