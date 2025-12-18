import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "David Alejandro - Portfolio",
  description:
    "Professional portfolio showcasing my work and experience around computational and software engineering.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {/* Language Switcher - Fixed top right */}
      <div className="fixed top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      {children}
    </NextIntlClientProvider>
  );
}
