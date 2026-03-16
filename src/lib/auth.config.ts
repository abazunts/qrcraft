import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/en/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      const isDashboard =
        pathname.includes("/dashboard") ||
        pathname.includes("/qr/") ||
        pathname.includes("/billing");

      if (isDashboard && !isLoggedIn) {
        return false; // redirect to signIn page
      }

      return true;
    },
  },
};
