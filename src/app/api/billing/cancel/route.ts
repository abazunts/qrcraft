import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createUnsubscribeParams } from "@/lib/liqpay";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Plan from "@/models/Plan";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const proPlan = await Plan.findOne({ slug: "pro", isActive: true }).lean();
  const user = await User.findById(session.user.id);

  if (!user || !user.liqpayOrderId || user.planId?.toString() !== proPlan?._id.toString()) {
    return NextResponse.json({ error: "No active subscription" }, { status: 400 });
  }

  const { data, signature } = createUnsubscribeParams(user.liqpayOrderId);

  const res = await fetch("https://www.liqpay.ua/api/request", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ data, signature }),
  });

  const result = await res.json() as { status?: string; err_description?: string };

  if (result.status === "unsubscribed" || result.status === "ok") {
    const freePlan = await Plan.findOne({ slug: "free", isActive: true }).lean();
    await User.findByIdAndUpdate(session.user.id, {
      planId: freePlan?._id,
      liqpayOrderId: null,
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    { error: result.err_description ?? "Failed to cancel subscription" },
    { status: 400 }
  );
}
