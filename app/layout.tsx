import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import ClientProviders from "@/components/clientProviders";
import PWAPopup from "@/components/PWAPopup";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
  title: "ChronoTask",
  description:
    "ChronoTask – A 20-minute goal tracker with learning notes and offline-first PWA support.",
  icons: {
    icon: "/favicon.svg",
  },
  manifest: "/manifest.json",
  applicationName: "ChronoTask",
  short_name: "ChronoTask",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <body>
          <ClientProviders>
            {children}
            <PWAPopup />
          </ClientProviders>
        </body>
      </body>
    </html>
  );
}
