"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Plus, CreditCard, LogOut } from "lucide-react";
import LangSwitcher from "@/components/LangSwitcher";

const QRLogoSvg = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="6" height="6" rx="1" fill="white" />
    <rect x="12" y="2" width="6" height="6" rx="1" fill="white" />
    <rect x="2" y="12" width="6" height="6" rx="1" fill="white" />
    <rect x="12" y="12" width="3" height="3" rx="0.5" fill="white" />
    <rect x="15" y="15" width="3" height="3" rx="0.5" fill="white" />
  </svg>
);

const navItems = [
  { href: "/dashboard" as const, icon: LayoutDashboard, labelKey: "sidebar.dashboard" as const },
  { href: "/qr/new" as const, icon: Plus, labelKey: "sidebar.newQr" as const },
  { href: "/billing" as const, icon: CreditCard, labelKey: "sidebar.billing" as const },
];

export default function Sidebar() {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-full w-60 flex flex-col py-6 px-4 z-50"
      style={{
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2.5 mb-8 px-2 text-[18px] font-extrabold tracking-[-0.5px] no-underline"
        style={{ color: "var(--text)" }}
      >
        <div
          className="w-8 h-8 rounded-[8px] flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
        >
          <div className="w-4 h-4">
            <QRLogoSvg />
          </div>
        </div>
        QRcraft
      </Link>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ href, icon: Icon, labelKey }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium no-underline transition-all duration-200"
              style={
                isActive
                  ? {
                      background: "rgba(124,58,237,0.15)",
                      color: "var(--purple-light)",
                    }
                  : {
                      background: "transparent",
                      color: "var(--muted)",
                    }
              }
            >
              <Icon size={18} />
              {t(labelKey)}
            </Link>
          );
        })}
      </nav>

      {/* Lang switcher */}
      <div className="px-2 mb-3 flex">
        <LangSwitcher />
      </div>

      {/* Sign out */}
      <button
        onClick={() => signOut({ callbackUrl: "/en" })}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full"
        style={{
          background: "transparent",
          color: "var(--muted)",
          border: "none",
          cursor: "pointer",
        }}
      >
        <LogOut size={18} />
        {t("sidebar.signOut")}
      </button>
    </aside>
  );
}
