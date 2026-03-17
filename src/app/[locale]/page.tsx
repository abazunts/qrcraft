import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import LangSwitcher from "@/components/LangSwitcher";
import { Link } from "@/i18n/navigation";
import { connectDB } from "@/lib/db";
import Plan, { IPlan } from "@/models/Plan";

const QRLogoSvg = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="6" height="6" rx="1" fill="white" />
    <rect x="12" y="2" width="6" height="6" rx="1" fill="white" />
    <rect x="2" y="12" width="6" height="6" rx="1" fill="white" />
    <rect x="12" y="12" width="3" height="3" rx="0.5" fill="white" />
    <rect x="17" y="12" width="1" height="1" rx="0.3" fill="white" />
    <rect x="15" y="15" width="3" height="3" rx="0.5" fill="white" />
    <rect x="12" y="17" width="1" height="1" rx="0.3" fill="white" />
  </svg>
);

const QRPreviewSvg = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="30" height="30" rx="4" fill="#7c3aed" opacity="0.15" />
    <rect x="13" y="13" width="20" height="20" rx="2.5" fill="#7c3aed" opacity="0.25" />
    <rect x="18" y="18" width="10" height="10" rx="1.5" fill="#a78bfa" />
    <rect x="62" y="8" width="30" height="30" rx="4" fill="#7c3aed" opacity="0.15" />
    <rect x="67" y="13" width="20" height="20" rx="2.5" fill="#7c3aed" opacity="0.25" />
    <rect x="72" y="18" width="10" height="10" rx="1.5" fill="#a78bfa" />
    <rect x="8" y="62" width="30" height="30" rx="4" fill="#7c3aed" opacity="0.15" />
    <rect x="13" y="67" width="20" height="20" rx="2.5" fill="#7c3aed" opacity="0.25" />
    <rect x="18" y="72" width="10" height="10" rx="1.5" fill="#a78bfa" />
    <rect x="48" y="8" width="7" height="7" rx="1.5" fill="#6d28d9" />
    <rect x="58" y="8" width="7" height="7" rx="1.5" fill="#6d28d9" opacity="0.5" />
    <rect x="8" y="48" width="7" height="7" rx="1.5" fill="#6d28d9" opacity="0.7" />
    <rect x="8" y="58" width="7" height="7" rx="1.5" fill="#6d28d9" />
    <rect x="48" y="48" width="7" height="7" rx="1.5" fill="#7c3aed" />
    <rect x="58" y="48" width="7" height="7" rx="1.5" fill="#6d28d9" opacity="0.6" />
    <rect x="48" y="58" width="7" height="7" rx="1.5" fill="#6d28d9" opacity="0.4" />
    <rect x="58" y="58" width="7" height="7" rx="1.5" fill="#7c3aed" />
    <rect x="68" y="48" width="7" height="7" rx="1.5" fill="#6d28d9" opacity="0.5" />
    <rect x="78" y="48" width="7" height="7" rx="1.5" fill="#7c3aed" />
    <rect x="68" y="58" width="7" height="7" rx="1.5" fill="#7c3aed" opacity="0.7" />
    <rect x="78" y="58" width="7" height="7" rx="1.5" fill="#6d28d9" opacity="0.4" />
    <rect x="48" y="68" width="7" height="7" rx="1.5" fill="#6d28d9" />
    <rect x="58" y="68" width="7" height="7" rx="1.5" fill="#7c3aed" opacity="0.5" />
    <rect x="48" y="78" width="7" height="7" rx="1.5" fill="#7c3aed" opacity="0.7" />
    <rect x="68" y="68" width="7" height="7" rx="1.5" fill="#6d28d9" opacity="0.3" />
    <rect x="78" y="68" width="7" height="7" rx="1.5" fill="#7c3aed" />
    <rect x="68" y="78" width="7" height="7" rx="1.5" fill="#7c3aed" opacity="0.6" />
    <rect x="78" y="78" width="7" height="7" rx="1.5" fill="#6d28d9" />
  </svg>
);

export default async function LandingPage() {
  const t = await getTranslations();
  const session = await auth();

  await connectDB();
  const plans = await Plan.find({ isActive: true }).sort({ price: 1 }).lean() as unknown as IPlan[];

  const features = [
    {
      icon: "🔗",
      titleKey: "f1.title",
      descKey: "f1.desc",
      tags: ["URL", t("tag.text"), "vCard", "Wi-Fi", t("tag.event")],
    },
    {
      icon: "🎨",
      titleKey: "f2.title",
      descKey: "f2.desc",
      tags: [t("tag.color"), t("tag.logo"), t("tag.shape")],
    },
    { icon: "📊", titleKey: "f3.title", descKey: "f3.desc", tags: [] },
    { icon: "✏️", titleKey: "f4.title", descKey: "f4.desc", tags: [] },
    {
      icon: "💾",
      titleKey: "f5.title",
      descKey: "f5.desc",
      tags: ["PNG", "SVG", "PDF"],
    },
    { icon: "♾️", titleKey: "f6.title", descKey: "f6.desc", tags: [] },
  ] as const;

  return (
    <>
      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-10 py-[18px]"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "rgba(9,9,11,0.75)",
          borderBottom: "1px solid rgba(63,63,70,0.5)",
        }}
      >
        <Link href="/" className="flex items-center gap-[10px] text-[20px] font-extrabold tracking-[-0.5px] no-underline" style={{ color: "var(--text)" }}>
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
          >
            <div className="w-5 h-5">
              <QRLogoSvg />
            </div>
          </div>
          QRcraft
        </Link>
        <div className="flex items-center gap-3">
          <LangSwitcher />
          {session?.user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-[22px] py-[10px] rounded-xl text-sm font-semibold transition-all duration-200 no-underline"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                color: "#fff",
                boxShadow: "0 0 24px rgba(124,58,237,0.35)",
              }}
            >
              {t("nav.dashboard")}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-[22px] py-[10px] rounded-xl text-sm font-semibold transition-all duration-200 no-underline"
                style={{
                  background: "transparent",
                  color: "var(--muted)",
                  border: "1px solid var(--border)",
                }}
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-[22px] py-[10px] rounded-xl text-sm font-semibold transition-all duration-200 no-underline"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  color: "#fff",
                  boxShadow: "0 0 24px rgba(124,58,237,0.35)",
                }}
              >
                {t("nav.start")}
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section
        className="relative min-h-screen flex items-center justify-center text-center overflow-hidden"
        style={{ padding: "120px 24px 80px" }}
      >
        {/* Glows */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 600,
            height: 600,
            background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)",
            filter: "blur(80px)",
            top: -100,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(79,70,229,0.2) 0%, transparent 70%)",
            filter: "blur(80px)",
            bottom: 0,
            right: -100,
          }}
        />

        <div className="relative z-[1] max-w-[780px]">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 mb-7 rounded-full px-4 py-[6px] text-[13px] font-semibold tracking-[0.3px]"
            style={{
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.4)",
              color: "var(--purple-light)",
            }}
          >
            <span
              className="w-[7px] h-[7px] rounded-full animate-pulse-dot"
              style={{ background: "var(--purple-light)" }}
            />
            {t("hero.badge")}
          </div>

          {/* QR Preview */}
          <div className="relative mx-auto w-[140px] h-[140px] mb-12">
            <div
              className="absolute inset-[-16px] rounded-[36px] animate-spin-slow"
              style={{ border: "1px solid rgba(124,58,237,0.3)" }}
            />
            <div
              className="absolute inset-[-32px] rounded-[50px] animate-spin-slow-reverse"
              style={{ border: "1px solid rgba(79,70,229,0.15)" }}
            />
            <div
              className="w-[140px] h-[140px] flex items-center justify-center rounded-[20px] relative overflow-hidden"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="w-[100px] h-[100px]">
                <QRPreviewSvg />
              </div>
            </div>
          </div>

          <h1
            className="font-black leading-[1.05] tracking-[-2.5px] mb-6"
            style={{ fontSize: "clamp(42px, 6vw, 80px)" }}
          >
            <span className="gradient-text">{t("hero.h1a")}</span>
            <br />
            <span>{t("hero.h1b")}</span>
          </h1>

          <p
            className="mb-10 mx-auto max-w-[560px] leading-[1.7]"
            style={{ fontSize: 18, color: "var(--muted)" }}
          >
            {t("hero.desc")}
          </p>

          <div className="flex items-center justify-center gap-[14px] flex-wrap">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-[14px] text-base font-semibold no-underline transition-all duration-200"
              style={{
                padding: "16px 36px",
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                color: "#fff",
                boxShadow: "0 0 24px rgba(124,58,237,0.35)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
              {t("hero.cta")}
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 rounded-[14px] text-base font-semibold no-underline transition-all duration-200"
              style={{
                padding: "16px 36px",
                background: "transparent",
                color: "var(--muted)",
                border: "1px solid var(--border)",
              }}
            >
              {t("hero.pricing")}
            </a>
          </div>

          {/* Stats */}
          <div
            className="flex items-center justify-center gap-10 mt-[60px] pt-10 flex-wrap"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {[
              { value: "100K+", labelKey: "stats.generated" },
              { value: "5", labelKey: "stats.types" },
              { value: "PNG / SVG", labelKey: "stats.export" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-10">
                {i > 0 && (
                  <div
                    className="w-px h-10"
                    style={{ background: "var(--border)" }}
                  />
                )}
                <div className="text-center">
                  <div
                    className="text-[32px] font-extrabold tracking-[-1px] gradient-text"
                  >
                    {stat.value}
                  </div>
                  <div className="text-[13px] mt-0.5" style={{ color: "var(--muted)" }}>
                    {t(stat.labelKey as Parameters<typeof t>[0])}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-[100px] px-6">
        <div
          className="text-center text-[13px] font-bold tracking-[2px] uppercase mb-4"
          style={{ color: "var(--purple-light)" }}
        >
          {t("features.label")}
        </div>
        <h2
          className="text-center font-extrabold tracking-[-1.5px] mb-4"
          style={{ fontSize: "clamp(30px, 4vw, 48px)" }}
        >
          {t("features.title")}
        </h2>
        <p
          className="text-center max-w-[520px] mx-auto mb-16 leading-[1.65]"
          style={{ color: "var(--muted)", fontSize: 17 }}
        >
          {t("features.desc")}
        </p>

        <div
          className="grid gap-5 max-w-[1100px] mx-auto"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="card-hover relative overflow-hidden rounded-[16px] p-8"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-[22px]"
                style={{
                  background: "rgba(124,58,237,0.15)",
                  border: "1px solid rgba(124,58,237,0.3)",
                }}
              >
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-2.5 tracking-[-0.3px]">
                {t(f.titleKey)}
              </h3>
              <p className="text-sm leading-[1.65]" style={{ color: "var(--muted)" }}>
                {t(f.descKey)}
              </p>
              {f.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {f.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold px-[10px] py-1 rounded-[6px]"
                      style={{
                        background: "var(--surface2)",
                        border: "1px solid var(--border)",
                        color: "var(--muted)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        className="py-[100px] px-6"
        style={{ background: "var(--surface)" }}
      >
        <div
          className="text-center text-[13px] font-bold tracking-[2px] uppercase mb-4"
          style={{ color: "var(--purple-light)" }}
        >
          {t("pricing.label")}
        </div>
        <h2
          className="text-center font-extrabold tracking-[-1.5px] mb-4"
          style={{ fontSize: "clamp(30px, 4vw, 48px)" }}
        >
          {t("pricing.title")}
        </h2>
        <p
          className="text-center max-w-[520px] mx-auto mb-16 leading-[1.65]"
          style={{ color: "var(--muted)", fontSize: 17 }}
        >
          {t("pricing.desc")}
        </p>

        <div
          className="grid gap-5 max-w-[1000px] mx-auto"
          style={{ gridTemplateColumns: `repeat(${plans.length}, minmax(0, 1fr))` }}
        >
          {plans.map((plan) => {
            const isFree = plan.price === 0;
            const symbol = plan.currency === "EUR" ? "€" : plan.currency;
            const btnKey = `plan.${plan.slug}Btn` as Parameters<typeof t>[0];
            const periodKey = `plan.${plan.slug}Period` as Parameters<typeof t>[0];
            return (
              <div
                key={plan.slug}
                className="rounded-[16px] p-10 relative flex flex-col"
                style={{
                  background: isFree
                    ? "var(--bg)"
                    : "linear-gradient(145deg, rgba(124,58,237,0.12), rgba(79,70,229,0.08))",
                  border: isFree
                    ? "1px solid var(--border)"
                    : "1px solid rgba(124,58,237,0.5)",
                }}
              >
                {plan.isPopular && (
                  <span
                    className="absolute top-[-1px] right-7 text-xs font-bold tracking-[0.3px] px-[14px] py-[5px] rounded-b-[10px]"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff" }}
                  >
                    {t("plan.popular")}
                  </span>
                )}
                <div className="text-[15px] font-bold uppercase tracking-[1px] mb-4" style={{ color: "var(--muted)" }}>
                  {plan.slug.charAt(0).toUpperCase() + plan.slug.slice(1)}
                </div>
                <div className="font-black tracking-[-2px] mb-1 leading-none" style={{ fontSize: 52 }}>
                  {isFree
                    ? <>0 <sup className="text-2xl font-bold align-super tracking-normal">{symbol}</sup></>
                    : <><sup className="text-2xl font-bold align-super tracking-normal">{symbol}</sup>{plan.price}</>
                  }
                </div>
                <div className="text-sm mb-8" style={{ color: "var(--muted)" }}>
                  {t(periodKey)}
                </div>
                <ul className="mb-9 list-none flex-1">
                  {plan.featureKeys.map((k) => (
                    <li
                      key={k}
                      className="flex items-center gap-3 text-sm py-2"
                      style={{ color: "var(--muted)", borderBottom: "1px solid var(--border)" }}
                    >
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[11px]"
                        style={{ background: "rgba(124,58,237,0.2)", color: "var(--purple-light)" }}
                      >
                        ✓
                      </span>
                      {t(k as Parameters<typeof t>[0])}
                    </li>
                  ))}
                </ul>
                <Link
                  href={isFree ? "/login" : "/billing"}
                  className="block text-center rounded-xl text-sm font-semibold no-underline transition-all duration-200"
                  style={{
                    padding: "14px",
                    background: isFree ? "transparent" : "linear-gradient(135deg, #7c3aed, #4f46e5)",
                    color: isFree ? "var(--muted)" : "#fff",
                    border: isFree ? "1px solid var(--border)" : "none",
                    boxShadow: isFree ? "none" : "0 0 24px rgba(124,58,237,0.35)",
                  }}
                >
                  {t(btnKey)}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-[100px] px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs font-bold uppercase tracking-[2px] px-3 py-1 rounded-full mb-4"
              style={{ background: "rgba(124,58,237,0.15)", color: "var(--purple-light)" }}
            >
              {t("testimonials.label")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-[-1px]" style={{ color: "var(--text)" }}>
              {t("testimonials.title")}
            </h2>
          </div>

          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}
          >
            {(t.raw("testimonials.items") as { text: string; name: string; role: string }[]).map((item, i) => (
              <div
                key={i}
                className="rounded-[20px] p-6 flex flex-col gap-4"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill="#f59e0b">
                      <path d="M7 1l1.545 3.09L12 4.635l-2.5 2.41.59 3.41L7 8.77l-3.09 1.685.59-3.41L2 4.635l3.455-.545L7 1z" />
                    </svg>
                  ))}
                </div>

                <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--muted)" }}>
                  &ldquo;{item.text}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  {/* Avatar placeholder */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: `hsl(${(item.name.charCodeAt(0) * 37) % 360}, 60%, 35%)`,
                      color: "#fff",
                    }}
                  >
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{item.name}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-[100px] px-6 text-center relative overflow-hidden"
      >
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 500,
            height: 500,
            background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)",
            filter: "blur(80px)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.5,
          }}
        />
        <div
          className="text-center text-[13px] font-bold tracking-[2px] uppercase mb-4"
          style={{ color: "var(--purple-light)" }}
        >
          {t("cta.label")}
        </div>
        <h2
          className="text-center font-extrabold tracking-[-1.5px] mb-5"
          style={{ fontSize: "clamp(30px, 4vw, 48px)" }}
        >
          {t("cta.title")}
        </h2>
        <p
          className="text-center max-w-[520px] mx-auto mb-10 leading-[1.65]"
          style={{ color: "var(--muted)", fontSize: 17 }}
        >
          {t("cta.desc")}
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 rounded-[14px] text-base font-semibold no-underline transition-all duration-200"
          style={{
            padding: "16px 36px",
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            color: "#fff",
            boxShadow: "0 0 24px rgba(124,58,237,0.35)",
          }}
        >
          {t("cta.btn")}
        </Link>
      </section>

      {/* FOOTER */}
      <footer
        className="flex items-center justify-between px-10 py-8 text-[13px]"
        style={{
          borderTop: "1px solid var(--border)",
          color: "var(--muted)",
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 text-base font-extrabold tracking-[-0.5px] no-underline"
          style={{ color: "var(--text)" }}
        >
          <div
            className="w-7 h-7 rounded-[8px] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
          >
            <div className="w-4 h-4">
              <QRLogoSvg />
            </div>
          </div>
          QRcraft
        </Link>
        <div className="flex gap-6">
          <Link href="/privacy" style={{ color: "var(--muted)", textDecoration: "none" }}>
            {t("footer.privacy")}
          </Link>
          <Link href="/terms" style={{ color: "var(--muted)", textDecoration: "none" }}>
            {t("footer.terms")}
          </Link>
          <a href="mailto:support@qrcraft.app" style={{ color: "var(--muted)", textDecoration: "none" }}>
            {t("footer.support")}
          </a>
        </div>
        <span>{t("footer.copy")}</span>
      </footer>
    </>
  );
}
