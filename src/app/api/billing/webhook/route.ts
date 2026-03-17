import { NextRequest, NextResponse } from "next/server";
import { verifySignature, decodeData } from "@/lib/liqpay";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Plan from "@/models/Plan";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const data = formData.get("data") as string;
  const signature = formData.get("signature") as string;

  if (!data || !signature || !verifySignature(data, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payload = decodeData(data);
  const { status, order_id } = payload;

  if (!order_id) {
    return NextResponse.json({ ok: true });
  }

  await connectDB();

  if (status === "subscribed" || status === "success") {
    const proPlan = await Plan.findOne({ slug: "pro", isActive: true }).lean();
    if (proPlan) {
      await User.findOneAndUpdate(
        { liqpayOrderId: order_id },
        { planId: proPlan._id }
      );
    }
  } else if (status === "unsubscribed" || status === "error" || status === "failure") {
    const freePlan = await Plan.findOne({ slug: "free", isActive: true }).lean();
    await User.findOneAndUpdate(
      { liqpayOrderId: order_id },
      { planId: freePlan?._id, liqpayOrderId: null }
    );
  }

  return NextResponse.json({ ok: true });
}
