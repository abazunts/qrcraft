import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { authConfig } from "./auth.config";
import clientPromise from "./mongodb-client";
import { connectDB } from "./db";
import User from "@/models/User";
import Plan from "@/models/Plan";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        const planId = (user as { planId?: string }).planId;
        if (planId) {
          token.planId = planId.toString();
        } else {
          // New user — assign free plan
          await connectDB();
          const freePlan = await Plan.findOne({ slug: "free", isActive: true }).lean();
          if (freePlan && user.id) {
            await User.findByIdAndUpdate(user.id, { planId: freePlan._id });
            token.planId = freePlan._id.toString();
          } else {
            token.planId = null;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      session.user.planId = (token.planId as string | undefined) ?? "";
      return session;
    },
  },
});
