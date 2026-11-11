import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "../globals.css";
import { fontVariables } from "../fonts";
import { hasLocale, locales, localizePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { GrainOverlay } from "@/components/GrainOverlay";
import { ToastProvider } from "@/components/toast/ToastProvider";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: { default: dict.meta.title, template: `%s — Joshfield` },
    description: dict.meta.description,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, localizePath(l, "/")])),
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <html lang={lang} className={fontVariables}>
      <body className="flex min-h-dvh flex-col bg-paper text-ink">
        <ToastProvider>
          <Header lang={lang} dict={dict.header} toast={dict.toast} />
          {children}
          <Footer lang={lang} dict={dict.footer} toast={dict.toast} />
        </ToastProvider>
        <GrainOverlay />
      </body>
    </html>
  );
}
