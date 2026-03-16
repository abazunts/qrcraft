import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import QRCode from "@/models/QRCode";
import { buildQRString } from "@/lib/qr-generate";

export async function GET(
  _req: Request,
  { params }: { params: { shortId: string } }
) {
  await connectDB();

  const qr = await QRCode.findOne({ shortId: params.shortId });

  if (!qr) {
    return NextResponse.json({ error: "QR code not found" }, { status: 404 });
  }

  // Increment scan count
  qr.scanCount += 1;
  await qr.save();

  // Redirect to real content
  const destination = buildQRString(qr.type, qr.content);

  return NextResponse.redirect(destination, { status: 302 });
}
