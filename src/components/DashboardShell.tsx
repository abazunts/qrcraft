"use client";

import { useState, useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import Sidebar from "@/components/Sidebar";
import { Menu, X } from "lucide-react";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>

      {/* ── Mobile top bar ── */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-4 px-4 h-14"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg transition-colors"
          style={{ color: "var(--muted)", background: "transparent", border: "none", cursor: "pointer" }}
        >
          <Menu size={22} />
        </button>
        <span className="text-base font-extrabold tracking-[-0.5px]" style={{ color: "var(--text)" }}>
          QRcraft
        </span>
      </header>

      {/* ── Overlay (mobile) ── */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      {/* Desktop: always visible fixed */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile: slide-in drawer */}
      <div
        className="lg:hidden fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out"
        style={{
          transform: open ? "translateX(0)" : "translateX(-100%)",
          width: 240,
        }}
      >
        <div className="relative h-full">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg z-10"
            style={{ color: "var(--muted)", background: "transparent", border: "none", cursor: "pointer" }}
          >
            <X size={18} />
          </button>
          <Sidebar />
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 lg:ml-60 min-h-screen flex justify-center">
        <div className="w-full max-w-5xl px-4 sm:px-8 py-8 pt-20 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
