"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Plus, QrCode } from "lucide-react";
import QRCard from "@/components/QRCard";
import Button from "@/components/ui/Button";

interface QRData {
  _id: string;
  title: string;
  type: "url" | "text" | "vcard" | "wifi" | "event";
  scanCount: number;
  shortId: string;
  dataUrl?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const t = useTranslations();
  const [qrs, setQrs] = useState<QRData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/qr")
      .then((r) => r.json())
      .then((data: QRData[] | { error: string }) => {
        if (Array.isArray(data)) setQrs(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/qr/${id}`, { method: "DELETE" });
    if (res.ok) {
      setQrs((prev) => prev.filter((q) => q._id !== id));
    }
  };

  return (
    <div className="max-w-[1100px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-[-0.5px]" style={{ color: "var(--text)" }}>
          {t("dashboard.title")}
        </h1>
        <Link href="/qr/new">
          <Button variant="primary" size="md">
            <Plus size={16} />
            {t("dashboard.create")}
          </Button>
        </Link>
      </div>

      {/* Plan info for free users */}
      {qrs.length > 0 && (
        <div
          className="mb-6 px-4 py-3 rounded-xl text-sm flex items-center justify-between"
          style={{
            background: "rgba(124,58,237,0.1)",
            border: "1px solid rgba(124,58,237,0.2)",
            color: "var(--purple-light)",
          }}
        >
          <span>{t("dashboard.freePlan", { count: qrs.length })}</span>
          {qrs.length >= 5 && (
            <Link
              href="/billing"
              className="text-xs font-semibold no-underline"
              style={{ color: "var(--purple-light)" }}
            >
              {t("dashboard.upgradeToPro")} →
            </Link>
          )}
        </div>
      )}

      {loading ? (
        <div
          className="flex items-center justify-center h-48 text-sm"
          style={{ color: "var(--muted)" }}
        >
          Loading...
        </div>
      ) : qrs.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center h-64 rounded-[20px] gap-4"
          style={{
            background: "var(--surface)",
            border: "2px dashed var(--border)",
          }}
        >
          <QrCode size={48} style={{ color: "var(--muted)" }} />
          <div className="text-center">
            <p className="font-semibold mb-1" style={{ color: "var(--text)" }}>
              {t("dashboard.empty")}
            </p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              {t("dashboard.emptyDesc")}
            </p>
          </div>
          <Link href="/qr/new">
            <Button variant="primary">
              <Plus size={16} />
              {t("dashboard.create")}
            </Button>
          </Link>
        </div>
      ) : (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          }}
        >
          {qrs.map((qr) => (
            <QRCard key={qr._id} qr={qr} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
