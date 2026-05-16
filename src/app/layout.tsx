import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TraducIA - Translation Learning Assistant",
  description:
    "Translate text and learn about the culture behind every language. Powered by AI.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TraducIA",
  },
  applicationName: "TraducIA",
};

export const viewport: Viewport = {
  themeColor: "#c5af71",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/logo-icono.png" />
        <link rel="apple-touch-icon" href="/logo-icono.png" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-surface`}>
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(197,175,113,0.08),transparent_50%)]" />
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-brand-teal/20 py-4 text-center text-xs text-surface-300">
          TraducIA &mdash; Learn languages through translation
        </footer>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
