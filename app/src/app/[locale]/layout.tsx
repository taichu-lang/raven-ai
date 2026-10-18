import "@/styles/globals.css";

import { PlatformProvider } from "@/platform/context";
import { AppSidebar } from "base-ui/layout";
import clsx from "clsx";
import { routing } from "hero-next/i18n/routing";
import { ThemeProvider } from "hero-next/theme";
import { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Raven AI",
  description: "Application for Raven AI.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html suppressHydrationWarning lang={locale}>
      <head />
      <body className={clsx("text-foreground bg-background min-h-screen font-sans antialiased")}>
        <NextIntlClientProvider>
          <ThemeProvider theme={{ attribute: "class", defaultTheme: "dark" }} locale={locale}>
            <PlatformProvider>
              <div className="flex h-screen w-full overflow-hidden">
                <AppSidebar />
                <div className="flex-1 overflow-y-auto">{children}</div>
              </div>
            </PlatformProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
