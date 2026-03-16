"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ComingSoonModal from "@/components/ComingSoonModal";
import Button from "@/components/ui/Button";
import { Check } from "lucide-react";

const PRO_FEATURES = [
  "plan.proF1",
  "plan.proF2",
  "plan.proF3",
  "plan.proF4",
  "plan.proF5",
  "plan.proF6",
] as const;

export default function BillingPage() {
  const t = useTranslations();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2 tracking-[-0.5px]" style={{ color: "var(--text)" }}>
        {t("billing.title")}
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        {t("billing.currentPlan", { plan: t("billing.freePlanName") })}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Free plan */}
        <div
          className="rounded-[20px] p-8"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            className="text-[15px] font-bold uppercase tracking-[1px] mb-4"
            style={{ color: "var(--muted)" }}
          >
            {t("billing.freePlanName")}
          </div>
          <div className="text-[48px] font-black tracking-[-2px] mb-1 leading-none">
            0 <sup className="text-xl font-bold align-super">€</sup>
          </div>
          <div className="text-sm mb-6" style={{ color: "var(--muted)" }}>
            {t("plan.freePeriod")}
          </div>
          <ul className="space-y-2">
            {(["plan.freeF1", "plan.freeF2", "plan.freeF3", "plan.freeF4"] as const).map((k) => (
              <li key={k} className="flex items-center gap-2.5 text-sm" style={{ color: "var(--muted)" }}>
                <Check size={14} style={{ color: "var(--purple-light)", flexShrink: 0 }} />
                {t(k)}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro plan */}
        <div
          className="rounded-[20px] p-8 relative"
          style={{
            background: "linear-gradient(145deg, rgba(124,58,237,0.12), rgba(79,70,229,0.08))",
            border: "1px solid rgba(124,58,237,0.5)",
          }}
        >
          <span
            className="absolute top-[-1px] right-6 text-xs font-bold px-3 py-1 rounded-b-[8px]"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              color: "#fff",
            }}
          >
            {t("plan.popular")}
          </span>
          <div
            className="text-[15px] font-bold uppercase tracking-[1px] mb-4"
            style={{ color: "var(--muted)" }}
          >
            {t("billing.proPlanName")}
          </div>
          <div className="text-[48px] font-black tracking-[-2px] mb-1 leading-none">
            <sup className="text-xl font-bold align-super">€</sup>4.99
          </div>
          <div className="text-sm mb-6" style={{ color: "var(--muted)" }}>
            {t("plan.proPeriod")}
          </div>
          <ul className="space-y-2 mb-6">
            {PRO_FEATURES.map((k) => (
              <li key={k} className="flex items-center gap-2.5 text-sm" style={{ color: "var(--muted)" }}>
                <Check size={14} style={{ color: "var(--purple-light)", flexShrink: 0 }} />
                {t(k)}
              </li>
            ))}
          </ul>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => setShowModal(true)}
          >
            {t("billing.getProBtn")}
          </Button>
        </div>
      </div>

      <ComingSoonModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
