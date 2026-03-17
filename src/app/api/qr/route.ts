import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import QRCode from "@/models/QRCode";
import Plan from "@/models/Plan";
import { buildQRString, generateQRDataURL } from "@/lib/qr-generate";
import { nanoid } from "nanoid";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const qrs = await QRCode.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(qrs);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const planDoc = session.user.planId
    ? await Plan.findById(session.user.planId).lean()
    : await Plan.findOne({ slug: "free", isActive: true }).lean();
  const maxQRCodes = planDoc?.maxQRCodes ?? 5;
  if (maxQRCodes !== -1) {
    const count = await QRCode.countDocuments({ userId: session.user.id });
    if (count >= maxQRCodes) {
      return NextResponse.json(
        { error: "Plan limit reached. Upgrade to Pro for unlimited QR codes." },
        { status: 403 }
      );
    }
  }

  const body = await req.json() as {
    title?: string;
    type?: string;
    content?: string;
    design?: {
      fgColor?: string;
      bgColor?: string;
      dotStyle?: string;
      cornerStyle?: string;
    };
  };
  const { title, type = "url", content = "", design = {} } = body;

  if (!title || !content) {
    return NextResponse.json({ error: "title and content are required" }, { status: 400 });
  }

  const shortId = nanoid(8);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const qrString = buildQRString(
    type as Parameters<typeof buildQRString>[0],
    type === "url" ? `${appUrl}/api/scan/${shortId}` : content
  );

  const fgColor = design.fgColor ?? "#000000";
  const bgColor = design.bgColor ?? "#ffffff";
  const dataUrl = await generateQRDataURL(qrString, fgColor, bgColor);

  const qr = await QRCode.create({
    userId: session.user.id,
    title,
    type,
    content,
    design: {
      fgColor,
      bgColor,
      dotStyle: design.dotStyle ?? "square",
      cornerStyle: design.cornerStyle ?? "square",
    },
    shortId,
    dataUrl,
    scanCount: 0,
  });

  return NextResponse.json(qr, { status: 201 });
}
