"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import Button from "@/components/ui/Button";
import { Check } from "lucide-react";

const LIQPAY_CHECKOUT_URL = "https://www.liqpay.ua/api/3/checkout";

const FREE_FEATURES = ["plan.freeF1", "plan.freeF2", "plan.freeF3", "plan.freeF4"] as const;
const PRO_FEATURES = ["plan.proF1", "plan.proF2", "plan.proF3", "plan.proF4", "plan.proF5", "plan.proF6"] as const;

interface BillingClientProps {
  plan: "free" | "pro";
}

export default function BillingClient({ plan }: BillingClientProps) {
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/billing/subscribe", { method: "POST" });
      const json = await res.json() as { data?: string; signature?: string; error?: string };
      if (!res.ok) { setError(json.error ?? "Error"); setLoading(false); return; }

      // Submit hidden form to LiqPay checkout
      const form = document.createElement("form");
      form.method = "POST";
      form.action = LIQPAY_CHECKOUT_URL;
      form.style.display = "none";
      const addField = (name: string, value: string) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };
      addField("data", json.data!);
      addField("signature", json.signature!);
      document.body.appendChild(form);
      form.submit();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm(t("billing.cancelConfirm"))) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/billing/cancel", { method: "POST" });
      const json = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) { setError(json.error ?? "Error"); setLoading(false); return; }
      router.refresh();
    } catch {
      setError("Network error");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2 tracking-[-0.5px]" style={{ color: "var(--text)" }}>
        {t("billing.title")}
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        {t("billing.currentPlan", { plan: plan === "pro" ? t("billing.proPlanName") : t("billing.freePlanName") })}
      </p>

      {error && (
        <p className="mb-4 text-sm" style={{ color: "#ef4444" }}>{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Free */}
        <div
          className="rounded-[20px] p-8"
          style={{
            background: "var(--surface)",
            border: plan === "free" ? "2px solid rgba(124,58,237,0.5)" : "1px solid var(--border)",
          }}
        >
          {plan === "free" && (
            <span className="inline-block mb-3 text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(124,58,237,0.15)", color: "var(--purple-light)" }}>
              {t("billing.activePlan")}
            </span>
          )}
          <div className="text-[15px] font-bold uppercase tracking-[1px] mb-4" style={{ color: "var(--muted)" }}>
            {t("billing.freePlanName")}
          </div>
          <div className="text-[48px] font-black tracking-[-2px] mb-1 leading-none">
            0 <sup className="text-xl font-bold align-super">€</sup>
          </div>
          <div className="text-sm mb-6" style={{ color: "var(--muted)" }}>{t("plan.freePeriod")}</div>
          <ul className="space-y-2">
            {FREE_FEATURES.map((k) => (
              <li key={k} className="flex items-center gap-2.5 text-sm" style={{ color: "var(--muted)" }}>
                <Check size={14} style={{ color: "var(--purple-light)", flexShrink: 0 }} />
                {t(k)}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro */}
        <div
          className="rounded-[20px] p-8 relative"
          style={{
            background: "linear-gradient(145deg, rgba(124,58,237,0.12), rgba(79,70,229,0.08))",
            border: plan === "pro" ? "2px solid rgba(124,58,237,0.8)" : "1px solid rgba(124,58,237,0.5)",
          }}
        >
          {plan !== "pro" && (
            <span className="absolute top-[-1px] right-6 text-xs font-bold px-3 py-1 rounded-b-[8px]"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff" }}>
              {t("plan.popular")}
            </span>
          )}
          {plan === "pro" && (
            <span className="inline-block mb-3 text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(124,58,237,0.2)", color: "var(--purple-light)" }}>
              {t("billing.activePlan")}
            </span>
          )}
          <div className="text-[15px] font-bold uppercase tracking-[1px] mb-4" style={{ color: "var(--muted)" }}>
            {t("billing.proPlanName")}
          </div>
          <div className="text-[48px] font-black tracking-[-2px] mb-1 leading-none">
            <sup className="text-xl font-bold align-super">€</sup>4.99
          </div>
          <div className="text-sm mb-6" style={{ color: "var(--muted)" }}>{t("plan.proPeriod")}</div>
          <ul className="space-y-2 mb-6">
            {PRO_FEATURES.map((k) => (
              <li key={k} className="flex items-center gap-2.5 text-sm" style={{ color: "var(--muted)" }}>
                <Check size={14} style={{ color: "var(--purple-light)", flexShrink: 0 }} />
                {t(k)}
              </li>
            ))}
          </ul>

          {plan === "free" ? (
            <Button variant="primary" className="w-full" onClick={handleSubscribe} disabled={loading}>
              {loading ? t("billing.loading") : t("billing.getProBtn")}
            </Button>
          ) : (
            <Button variant="ghost" className="w-full" onClick={handleCancel} disabled={loading}>
              {loading ? t("billing.loading") : t("billing.cancelBtn")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
