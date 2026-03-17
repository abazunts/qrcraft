"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import Button from "@/components/ui/Button";
import { Check } from "lucide-react";

const LIQPAY_CHECKOUT_URL = "https://www.liqpay.ua/api/3/checkout";

interface PlanData {
  id: string;
  slug: string;
  price: number;
  currency: string;
  interval: string | null;
  featureKeys: string[];
  isPopular: boolean;
}

interface BillingClientProps {
  userPlanSlug: string;
  plans: PlanData[];
}

export default function BillingClient({ userPlanSlug, plans }: BillingClientProps) {
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

  const formatPrice = (plan: PlanData) => {
    const symbol = plan.currency === "EUR" ? "€" : plan.currency;
    return plan.price === 0 ? `0 ${symbol}` : `${symbol}${plan.price}`;
  };

  const getPlanName = (slug: string) => {
    const key = `billing.${slug}PlanName` as Parameters<typeof t>[0];
    try { return t(key); } catch { return slug; }
  };

  const getPeriod = (slug: string) => {
    const key = `plan.${slug}Period` as Parameters<typeof t>[0];
    try { return t(key); } catch { return ""; }
  };

  const isActive = (slug: string) => userPlanSlug === slug;
  const isFree = (plan: PlanData) => plan.price === 0;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-2 tracking-[-0.5px]" style={{ color: "var(--text)" }}>
        {t("billing.title")}
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        {t("billing.currentPlan", { plan: getPlanName(userPlanSlug) })}
      </p>

      {error && (
        <p className="mb-4 text-sm" style={{ color: "#ef4444" }}>{error}</p>
      )}

      <div className={`grid grid-cols-1 gap-4 ${plans.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="rounded-[20px] p-8 relative flex flex-col"
            style={{
              background: isFree(plan)
                ? "var(--surface)"
                : "linear-gradient(145deg, rgba(124,58,237,0.12), rgba(79,70,229,0.08))",
              border: isActive(plan.slug)
                ? `2px solid rgba(124,58,237,${isFree(plan) ? "0.5" : "0.8"})`
                : `1px solid ${isFree(plan) ? "var(--border)" : "rgba(124,58,237,0.5)"}`,
            }}
          >
            {plan.isPopular && !isActive(plan.slug) && (
              <span
                className="absolute top-[-1px] right-6 text-xs font-bold px-3 py-1 rounded-b-[8px]"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff" }}
              >
                {t("plan.popular")}
              </span>
            )}

            {isActive(plan.slug) && (
              <span
                className="inline-block mb-3 text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: `rgba(124,58,237,${isFree(plan) ? "0.15" : "0.2"})`, color: "var(--purple-light)" }}
              >
                {t("billing.activePlan")}
              </span>
            )}

            <div className="text-[15px] font-bold uppercase tracking-[1px] mb-4" style={{ color: "var(--muted)" }}>
              {getPlanName(plan.slug)}
            </div>

            <div className="text-[48px] font-black tracking-[-2px] mb-1 leading-none">
              {isFree(plan) ? (
                <>0 <sup className="text-xl font-bold align-super">€</sup></>
              ) : (
                <><sup className="text-xl font-bold align-super">{plan.currency === "EUR" ? "€" : plan.currency}</sup>{plan.price}</>
              )}
            </div>

            <div className="text-sm mb-6" style={{ color: "var(--muted)" }}>
              {getPeriod(plan.slug)}
            </div>

            <ul className="space-y-2 mb-6 flex-1">
              {plan.featureKeys.map((k) => (
                <li key={k} className="flex items-center gap-2.5 text-sm" style={{ color: "var(--muted)" }}>
                  <Check size={14} style={{ color: "var(--purple-light)", flexShrink: 0 }} />
                  {t(k as Parameters<typeof t>[0])}
                </li>
              ))}
            </ul>

            {!isFree(plan) && (
              isActive(plan.slug) ? (
                <Button variant="ghost" className="w-full" onClick={handleCancel} disabled={loading}>
                  {loading ? t("billing.loading") : t("billing.cancelBtn")}
                </Button>
              ) : (
                <Button variant="primary" className="w-full" onClick={handleSubscribe} disabled={loading}>
                  {loading ? t("billing.loading") : t("billing.getProBtn")}
                </Button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
