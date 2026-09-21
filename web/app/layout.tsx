import clsx from "clsx";
import { Metadata, Viewport } from "next";
import { Providers } from "./providers";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Raven AI",
  description: "Web application for Raven AI.",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "text-foreground bg-background min-h-screen font-sans antialiased",
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex h-screen flex-col">
            <main className="container mx-auto max-w-7xl flex-grow px-6 pt-16">
              {children}
            </main>
            <footer className="flex w-full items-center justify-center py-3">
              <a
                className="flex items-center gap-1 text-current no-underline"
                href="https://heroui.com?utm_source=next-app-template"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="text-muted">Powered by</span>
                <p className="text-accent">HeroUI</p>
              </a>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
