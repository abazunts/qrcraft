import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Plan, { IPlan } from "@/models/Plan";
import BillingClient from "@/components/BillingClient";

export default async function BillingPage() {
  const session = await auth();

  await connectDB();

  let userPlanSlug = "free";

  if (session?.user?.id) {
    const user = await User.findById(session.user.id).lean();
    if (user?.planId) {
      const plan = await Plan.findById(user.planId).lean() as unknown as IPlan | null;
      userPlanSlug = plan?.slug ?? "free";
    }
  }

  const plans = await Plan.find({ isActive: true }).sort({ price: 1 }).lean() as unknown as IPlan[];

  return (
    <BillingClient
      userPlanSlug={userPlanSlug}
      plans={plans.map((p) => ({
        id: p._id.toString(),
        slug: p.slug,
        price: p.price,
        currency: p.currency,
        interval: p.interval,
        featureKeys: p.featureKeys,
        isPopular: p.isPopular,
      }))}
    />
  );
}
