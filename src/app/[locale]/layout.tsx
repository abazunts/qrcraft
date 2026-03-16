import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

export const metadata: Metadata = {
  title: "QRcraft — QR Code Generator",
  description:
    "Create stylish QR codes for links, contacts, Wi-Fi and events. Customize design, track scans and edit codes without replacement.",
};

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params;

  if (!routing.locales.includes(locale as "en" | "ua")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale === "ua" ? "uk" : "en"}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
