import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createSubscribeParams } from "@/lib/liqpay";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.plan === "pro") {
    return NextResponse.json({ error: "Already subscribed" }, { status: 400 });
  }

  const orderId = `pro_${session.user.id}_${Date.now()}`;
  await User.findByIdAndUpdate(session.user.id, { liqpayOrderId: orderId });

  const { data, signature } = createSubscribeParams(orderId, user.email);
  return NextResponse.json({ data, signature });
}
