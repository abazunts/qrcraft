"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export default function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div
      className="flex items-center overflow-hidden rounded-[10px]"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {(["en", "ua"] as const).map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className="px-3 py-[6px] text-[13px] font-bold tracking-[0.5px] transition-all duration-200 cursor-pointer border-none"
          style={
            locale === l
              ? {
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  color: "#fff",
                }
              : {
                  background: "transparent",
                  color: "var(--muted)",
                }
          }
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
