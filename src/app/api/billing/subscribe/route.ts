import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createSubscribeParams } from "@/lib/liqpay";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Plan from "@/models/Plan";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { planId } = await req.json() as { planId?: string };
  if (!planId) {
    return NextResponse.json({ error: "planId is required" }, { status: 400 });
  }

  await connectDB();

  const plan = await Plan.findOne({ _id: planId, isActive: true }).lean();
  if (!plan || plan.price === 0) {
    return NextResponse.json({ error: "Plan not found or is free" }, { status: 400 });
  }

  const user = await User.findById(session.user.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.planId?.toString() === plan._id.toString()) {
    return NextResponse.json({ error: "Already on this plan" }, { status: 400 });
  }

  const orderId = `${plan.slug}_${session.user.id}_${Date.now()}`;
  await User.findByIdAndUpdate(session.user.id, { liqpayOrderId: orderId });

  const { data, signature } = createSubscribeParams(orderId, user.email, plan.price, plan.currency);
  return NextResponse.json({ data, signature });
}
