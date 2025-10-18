// ClientProviders.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/next";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      {children} <Analytics />
    </SessionProvider>
  );
}
