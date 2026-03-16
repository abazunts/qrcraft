"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Pencil, Trash2, QrCode, Download, Link2, Check } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { IQRCode } from "@/models/QRCode";

interface QRCardProps {
  qr: {
    _id: string;
    title: string;
    type: IQRCode["type"];
    scanCount: number;
    shortId: string;
    dataUrl?: string;
    createdAt: string;
  };
  onDelete: (id: string) => void;
}

export default function QRCard({ qr, onDelete }: QRCardProps) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const handleDelete = () => {
    if (confirm(t("dashboard.deleteConfirm"))) {
      onDelete(qr._id);
    }
  };

  const handleDownload = () => {
    if (!qr.dataUrl) return;
    const a = document.createElement("a");
    a.href = qr.dataUrl;
    a.download = `${qr.title.replace(/\s+/g, "-")}.png`;
    a.click();
  };

  const handleCopyLink = async () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
    const link = `${appUrl}/api/scan/${qr.shortId}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-[16px] p-5 flex flex-col gap-4 card-hover"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      {/* QR preview */}
      <div
        className="w-full aspect-square max-w-[140px] mx-auto rounded-xl flex items-center justify-center overflow-hidden"
        style={{ background: "var(--surface2)" }}
      >
        {qr.dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qr.dataUrl} alt={qr.title} className="w-full h-full object-contain" />
        ) : (
          <QrCode size={48} style={{ color: "var(--muted)" }} />
        )}
      </div>

      {/* Info */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
            {qr.title}
          </h3>
          <Badge variant="gray">{qr.type.toUpperCase()}</Badge>
        </div>
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          {qr.scanCount} {t("dashboard.scans")}
        </p>
      </div>

      {/* Share actions */}
      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          disabled={!qr.dataUrl}
          title="Download PNG"
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200"
          style={{
            background: "transparent",
            color: "var(--muted)",
            border: "1px solid var(--border)",
            cursor: qr.dataUrl ? "pointer" : "not-allowed",
            opacity: qr.dataUrl ? 1 : 0.4,
          }}
        >
          <Download size={13} />
          PNG
        </button>
        <button
          onClick={handleCopyLink}
          disabled={qr.type !== "url"}
          title={qr.type !== "url" ? "Only available for URL type" : "Copy scan link"}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200"
          style={{
            background: copied ? "rgba(34,197,94,0.15)" : "transparent",
            color: copied ? "#4ade80" : "var(--muted)",
            border: `1px solid ${copied ? "rgba(34,197,94,0.4)" : "var(--border)"}`,
            cursor: qr.type === "url" ? "pointer" : "not-allowed",
            opacity: qr.type === "url" ? 1 : 0.4,
          }}
        >
          {copied ? <Check size={13} /> : <Link2 size={13} />}
          {copied ? "Copied!" : "Link"}
        </button>
      </div>

      {/* Edit / Delete */}
      <div className="flex flex-col gap-2">
        <Link
          href={`/qr/${qr._id}`}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold no-underline transition-all duration-200"
          style={{
            background: "transparent",
            color: "var(--muted)",
            border: "1px solid var(--border)",
          }}
        >
          <Pencil size={13} />
          {t("dashboard.edit")}
        </Link>
        <Button variant="danger" size="sm" onClick={handleDelete} className="w-full">
          <Trash2 size={13} />
          {t("dashboard.delete")}
        </Button>
      </div>
    </div>
  );
}
