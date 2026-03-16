import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { authConfig } from "./auth.config";
import clientPromise from "./mongodb-client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.plan = (user as { plan?: "free" | "pro" }).plan ?? "free";
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      if (token?.plan) {
        session.user.plan = token.plan as "free" | "pro";
      } else {
        session.user.plan = "free";
      }
      return session;
    },
  },
});
