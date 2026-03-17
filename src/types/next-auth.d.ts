import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      planId: string;
    } & DefaultSession["user"];
  }

  interface User {
    planId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    planId?: string | null;
  }
}
