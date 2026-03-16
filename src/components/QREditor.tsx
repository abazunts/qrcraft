"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import QRPreview from "@/components/QRPreview";
import type { IQRCode, QRDesign, QRType } from "@/models/QRCode";

interface QREditorProps {
  initialData?: {
    _id: string;
    title: string;
    type: QRType;
    content: string;
    design: QRDesign;
  };
}

const defaultDesign: QRDesign = {
  fgColor: "#000000",
  bgColor: "#ffffff",
  dotStyle: "square",
  cornerStyle: "square",
};

const DOT_STYLES: QRDesign["dotStyle"][] = [
  "square", "rounded", "dots", "classy", "classy-rounded", "extra-rounded",
];
const CORNER_STYLES: QRDesign["cornerStyle"][] = ["square", "rounded", "dot"];

type Tab = "content" | "design";

export default function QREditor({ initialData }: QREditorProps) {
  const t = useTranslations();
  const router = useRouter();
  const isEditing = !!initialData;

  const [tab, setTab] = useState<Tab>("content");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [type, setType] = useState<QRType>(initialData?.type ?? "url");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [design, setDesign] = useState<QRDesign>(initialData?.design ?? defaultDesign);

  const qrValue = type === "url"
    ? (content || "https://example.com")
    : (content || "Hello World");

  // Generic helper for JSON-based fields (vcard/wifi/event)
  const getField = (field: string) => {
    try { return (JSON.parse(content || "{}") as Record<string, string>)[field] ?? ""; }
    catch { return ""; }
  };
  const setField = (field: string, value: string) => {
    let cur: Record<string, string> = {};
    try { cur = JSON.parse(content || "{}") as Record<string, string>; } catch { /* */ }
    setContent(JSON.stringify({ ...cur, [field]: value }));
  };

  const handleSave = async () => {
    if (!title || !content) { setError("Name and content are required"); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(isEditing ? `/api/qr/${initialData._id}` : "/api/qr", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, type, content, design }),
      });
      if (res.status === 403) {
        setError("Free plan limit reached (5 QR codes). Upgrade to Pro.");
        setSaving(false); return;
      }
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        setError(d.error ?? "An error occurred");
        setSaving(false); return;
      }
      router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold mb-6 tracking-[-0.5px]" style={{ color: "var(--text)" }}>
        {isEditing ? t("qrEditor.editTitle") : t("qrEditor.title")}
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
        {/* ── LEFT: form ── */}
        <div className="flex-1 min-w-0">
          {/* Tabs */}
          <div
            className="flex mb-5 rounded-xl overflow-hidden"
            style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
          >
            {([["content", t("qrEditor.step1")], ["design", t("qrEditor.step2")]] as [Tab, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="flex-1 py-2.5 text-sm font-semibold transition-all duration-200"
                style={
                  tab === key
                    ? { background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", border: "none", cursor: "pointer" }
                    : { background: "transparent", color: "var(--muted)", border: "none", cursor: "pointer" }
                }
              >
                {label}
              </button>
            ))}
          </div>

          <div
            className="rounded-[20px] p-6"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            {/* ── Tab: Content ── */}
            {tab === "content" && (
              <div className="flex flex-col gap-5">
                <Input
                  label={t("qrEditor.nameLabel")}
                  placeholder={t("qrEditor.namePlaceholder")}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" style={{ color: "var(--text)" }}>
                    {t("qrEditor.typeLabel")}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {([
                      ["url", t("qrEditor.typeUrl")],
                      ["text", t("qrEditor.typeText")],
                      ["vcard", t("qrEditor.typeVcard")],
                      ["wifi", t("qrEditor.typeWifi")],
                      ["event", t("qrEditor.typeEvent")],
                    ] as [QRType, string][]).map(([v, label]) => (
                      <button
                        key={v}
                        onClick={() => { setType(v); setContent(""); }}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                        style={
                          type === v
                            ? { background: "rgba(124,58,237,0.2)", color: "var(--purple-light)", border: "1px solid rgba(124,58,237,0.5)" }
                            : { background: "var(--surface2)", color: "var(--muted)", border: "1px solid var(--border)" }
                        }
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {(type === "url" || type === "text") && (
                  <Input
                    label={type === "url" ? t("qrEditor.urlLabel") : t("qrEditor.textLabel")}
                    placeholder={type === "url" ? t("qrEditor.urlPlaceholder") : t("qrEditor.textPlaceholder")}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                )}

                {type === "vcard" && (
                  <div className="flex flex-col gap-3">
                    {["name", "phone", "email", "org"].map((f) => (
                      <Input key={f} label={f.charAt(0).toUpperCase() + f.slice(1)}
                        placeholder={`Enter ${f}`} value={getField(f)}
                        onChange={(e) => setField(f, e.target.value)} />
                    ))}
                  </div>
                )}

                {type === "wifi" && (
                  <div className="flex flex-col gap-3">
                    <Input label="Network Name (SSID)" placeholder="MyWiFi"
                      value={getField("ssid")} onChange={(e) => setField("ssid", e.target.value)} />
                    <Input label="Password" placeholder="password123" type="password"
                      value={getField("password")} onChange={(e) => setField("password", e.target.value)} />
                  </div>
                )}

                {type === "event" && (
                  <div className="flex flex-col gap-3">
                    {["title", "start", "end", "location"].map((f) => (
                      <Input key={f} label={f.charAt(0).toUpperCase() + f.slice(1)}
                        placeholder={f === "start" || f === "end" ? "20260316T100000Z" : `Enter ${f}`}
                        value={getField(f)} onChange={(e) => setField(f, e.target.value)} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Tab: Design ── */}
            {tab === "design" && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: t("qrEditor.fgColor"), key: "fgColor" as const },
                    { label: t("qrEditor.bgColor"), key: "bgColor" as const },
                  ].map(({ label, key }) => (
                    <div key={key} className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium" style={{ color: "var(--text)" }}>{label}</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={design[key]}
                          onChange={(e) => setDesign((d) => ({ ...d, [key]: e.target.value }))}
                          className="w-10 h-10 rounded-lg cursor-pointer flex-shrink-0"
                          style={{ border: "1px solid var(--border)", background: "none", padding: 2 }}
                        />
                        <input
                          type="text"
                          value={design[key]}
                          onChange={(e) => {
                            const v = e.target.value;
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setDesign((d) => ({ ...d, [key]: v }));
                          }}
                          className="flex-1 px-3 py-2 rounded-lg text-sm font-mono"
                          style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
                          maxLength={7}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium" style={{ color: "var(--text)" }}>{t("qrEditor.dotStyle")}</label>
                  <div className="flex flex-wrap gap-2">
                    {DOT_STYLES.map((s) => (
                      <button key={s} onClick={() => setDesign((d) => ({ ...d, dotStyle: s }))}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200"
                        style={
                          design.dotStyle === s
                            ? { background: "rgba(124,58,237,0.2)", color: "var(--purple-light)", border: "1px solid rgba(124,58,237,0.5)" }
                            : { background: "var(--surface2)", color: "var(--muted)", border: "1px solid var(--border)" }
                        }
                      >{s}</button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium" style={{ color: "var(--text)" }}>{t("qrEditor.cornerStyle")}</label>
                  <div className="flex gap-2">
                    {CORNER_STYLES.map((s) => (
                      <button key={s} onClick={() => setDesign((d) => ({ ...d, cornerStyle: s }))}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200"
                        style={
                          design.cornerStyle === s
                            ? { background: "rgba(124,58,237,0.2)", color: "var(--purple-light)", border: "1px solid rgba(124,58,237,0.5)" }
                            : { background: "var(--surface2)", color: "var(--muted)", border: "1px solid var(--border)" }
                        }
                      >{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {error && (
              <p className="text-sm mt-4" style={{ color: "#ef4444" }}>{error}</p>
            )}
            <div className="flex justify-between mt-6">
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                {t("qrEditor.cancel")}
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={saving || !title || !content}>
                {saving ? t("qrEditor.saving") : t("qrEditor.save")}
              </Button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: live preview ── */}
        <div className="w-full lg:w-64 lg:flex-shrink-0 lg:sticky lg:top-8">
          <div
            className="rounded-[20px] p-6 flex flex-col items-center gap-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Live Preview
            </p>

            <div
              className="rounded-2xl overflow-hidden flex items-center justify-center"
              style={{ background: design.bgColor, padding: 8 }}
            >
              <QRPreview value={qrValue} design={design} size={200} />
            </div>

            <div className="w-full text-center">
              <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
                {title || "—"}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                {type.toUpperCase()}
              </p>
            </div>

            {/* Color swatches */}
            <div className="flex items-center gap-2 w-full justify-center">
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted)" }}>
                <span className="w-3.5 h-3.5 rounded-full border" style={{ background: design.fgColor, borderColor: "var(--border)" }} />
                {design.fgColor}
              </div>
              <span style={{ color: "var(--border)" }}>·</span>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted)" }}>
                <span className="w-3.5 h-3.5 rounded-full border" style={{ background: design.bgColor, borderColor: "var(--border)" }} />
                {design.bgColor}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
