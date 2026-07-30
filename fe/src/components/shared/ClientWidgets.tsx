"use client";

import dynamic from "next/dynamic";

const QuickAccessToolbar = dynamic(
  () => import("@/components/shared/QuickAccessToolbar"),
  { ssr: false }
);

const CookieConsent = dynamic(
  () => import("@/components/shared/CookieConsent"),
  { ssr: false }
);

/**
 * Client-side widgets that load lazily after the page renders.
 * Extracted from layout.tsx because `ssr: false` requires a Client Component.
 */
export default function ClientWidgets() {
  return (
    <>
      <QuickAccessToolbar />
      <CookieConsent />
    </>
  );
}
