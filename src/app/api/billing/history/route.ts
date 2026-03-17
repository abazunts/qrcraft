import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { fetchPaymentHistory } from "@/lib/liqpay";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.user.id).lean();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const dateTo = new Date();
  const dateFrom = new Date();
  dateFrom.setFullYear(dateFrom.getFullYear() - 2);

  const result = await fetchPaymentHistory(dateFrom, dateTo);

  const userEmail = (user as { email: string }).email;
  const payments = (result.data ?? []).filter((p) => p.customer === userEmail);

  return NextResponse.json(payments);
}
