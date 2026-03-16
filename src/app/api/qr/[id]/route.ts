import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import QRCode from "@/models/QRCode";
import { buildQRString, generateQRDataURL } from "@/lib/qr-generate";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const qr = await QRCode.findOne({
    _id: params.id,
    userId: session.user.id,
  }).lean();

  if (!qr) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(qr);
}

export async function PUT(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const qr = await QRCode.findOne({ _id: params.id, userId: session.user.id });
  if (!qr) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json() as {
    title?: string;
    content?: string;
    design?: {
      fgColor?: string;
      bgColor?: string;
      dotStyle?: string;
      cornerStyle?: string;
    };
  };
  const { title, content, design } = body;

  if (title) qr.title = title;
  if (content) qr.content = content;
  if (design) {
    qr.design = {
      fgColor: design.fgColor ?? qr.design.fgColor,
      bgColor: design.bgColor ?? qr.design.bgColor,
      dotStyle: (design.dotStyle ?? qr.design.dotStyle) as typeof qr.design.dotStyle,
      cornerStyle: (design.cornerStyle ?? qr.design.cornerStyle) as typeof qr.design.cornerStyle,
    };
  }

  // Regenerate QR data URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const qrString = buildQRString(
    qr.type,
    qr.type === "url" ? `${appUrl}/api/scan/${qr.shortId}` : qr.content
  );
  qr.dataUrl = await generateQRDataURL(qrString, qr.design.fgColor, qr.design.bgColor);

  await qr.save();

  return NextResponse.json(qr);
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const result = await QRCode.deleteOne({
    _id: params.id,
    userId: session.user.id,
  });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
