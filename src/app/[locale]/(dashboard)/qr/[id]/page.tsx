import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import QRCodeModel from "@/models/QRCode";
import QREditor from "@/components/QREditor";
import { notFound } from "next/navigation";
import type { QRDesign, QRType } from "@/models/QRCode";

type Props = { params: { id: string } };

export default async function EditQRPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) notFound();

  await connectDB();
  const qr = await QRCodeModel.findOne({
    _id: params.id,
    userId: session.user.id,
  }).lean();

  if (!qr) notFound();

  return (
    <QREditor
      initialData={{
        _id: String(qr._id),
        title: qr.title,
        type: qr.type as QRType,
        content: qr.content,
        design: qr.design as QRDesign,
      }}
    />
  );
}
