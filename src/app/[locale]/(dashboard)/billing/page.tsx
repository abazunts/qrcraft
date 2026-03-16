import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import BillingClient from "@/components/BillingClient";

export default async function BillingPage() {
  const session = await auth();
  let plan: "free" | "pro" = "free";

  if (session?.user?.id) {
    await connectDB();
    const user = await User.findById(session.user.id).lean();
    if (user) plan = (user as { plan?: "free" | "pro" }).plan ?? "free";
  }

  return <BillingClient plan={plan} />;
}
