import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import type { NextAuthRequest } from "next-auth";

const intlMiddleware = createMiddleware(routing);

const { auth } = NextAuth(authConfig);

export default auth((req: NextAuthRequest) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;

  const isDashboardRoute =
    nextUrl.pathname.includes("/dashboard") ||
    (/\/(en|ua)\/qr\//.test(nextUrl.pathname)) ||
    nextUrl.pathname.includes("/billing");

  if (isDashboardRoute && !isLoggedIn) {
    const parts = nextUrl.pathname.split("/");
    const locale = parts[1] && ["en", "ua"].includes(parts[1]) ? parts[1] : "en";
    return Response.redirect(new URL(`/${locale}/login`, nextUrl));
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
