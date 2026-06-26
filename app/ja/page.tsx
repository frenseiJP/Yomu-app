"use client";

import { useEffect } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import LandingPage from "@/components/marketing/LandingPage";

/** Japanese marketing LP at /ja */
export default function JaLandingPage() {
  const { setLanguage } = useLanguage();

  useEffect(() => {
    setLanguage("ja");
    void logBetaEventJa();
  }, [setLanguage]);

  return <LandingPage />;
}

async function logBetaEventJa() {
  const { logBetaEvent } = await import("@/lib/analytics/client");
  void logBetaEvent({
    eventType: "landing_view",
    route: "/ja",
    metadata: { source: "ja_lp" },
  });
}
