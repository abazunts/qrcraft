import { NextRequest, NextResponse } from "next/server";
import { verifySignature, decodeData } from "@/lib/liqpay";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

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
    await User.findOneAndUpdate(
      { liqpayOrderId: order_id },
      { plan: "pro" }
    );
  } else if (status === "unsubscribed" || status === "error" || status === "failure") {
    await User.findOneAndUpdate(
      { liqpayOrderId: order_id },
      { plan: "free", liqpayOrderId: null }
    );
  }

  return NextResponse.json({ ok: true });
}
