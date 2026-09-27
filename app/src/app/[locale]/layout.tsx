import "@/styles/globals.css";

import { AppSidebar } from "base-ui/layout";
import clsx from "clsx";
import { routing } from "hero-next/i18n/routing";
import { ThemeProvider } from "hero-next/theme";
import { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Raven AI",
  description: "Desktop application of Raven AI Agent.",
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
      <body
        className={clsx(
          "text-foreground bg-background min-h-screen font-sans antialiased",
        )}
      >
        <NextIntlClientProvider>
          <ThemeProvider
            theme={{ attribute: "class", defaultTheme: "dark" }}
            locale={locale}
          >
            <div className="flex h-screen overflow-hidden">
              <AppSidebar />
              <main className="container mx-auto max-w-7xl min-w-0 flex-1 overflow-y-auto px-6 pt-16">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
