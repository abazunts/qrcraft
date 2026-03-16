import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createUnsubscribeParams } from "@/lib/liqpay";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user || user.plan !== "pro" || !user.liqpayOrderId) {
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
    await User.findByIdAndUpdate(session.user.id, { plan: "free", liqpayOrderId: null });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    { error: result.err_description ?? "Failed to cancel subscription" },
    { status: 400 }
  );
}
