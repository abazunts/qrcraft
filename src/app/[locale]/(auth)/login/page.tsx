import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignInButton from "./SignInButton";

type Props = { params: { locale: string } };

export default async function LoginPage({ params }: Props) {
  const session = await auth();
  if (session?.user) {
    redirect(`/${params.locale}/dashboard`);
  }

  const t = await getTranslations();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--bg)" }}
    >
      {/* Background glow */}
      <div
        className="fixed rounded-full pointer-events-none"
        style={{
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
          filter: "blur(100px)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div
        className="relative w-full max-w-sm rounded-[24px] p-10 text-center"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div
            className="w-10 h-10 rounded-[10px] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
            >
              <rect x="2" y="2" width="6" height="6" rx="1" fill="white" />
              <rect x="12" y="2" width="6" height="6" rx="1" fill="white" />
              <rect x="2" y="12" width="6" height="6" rx="1" fill="white" />
              <rect x="12" y="12" width="3" height="3" rx="0.5" fill="white" />
              <rect x="15" y="15" width="3" height="3" rx="0.5" fill="white" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-[-0.5px]" style={{ color: "var(--text)" }}>
            QRcraft
          </span>
        </div>

        <h1 className="text-2xl font-bold mb-2 tracking-[-0.5px]" style={{ color: "var(--text)" }}>
          {t("login.title")}
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
          {t("login.subtitle")}
        </p>

        <SignInButton label={t("login.google")} locale={params.locale} />

        <p className="text-xs mt-6" style={{ color: "var(--muted)" }}>
          {t("login.terms")}
        </p>
      </div>
    </div>
  );
}
