"use client";

import { Suspense, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookOpen } from "lucide-react";
import GuestTryChat from "@/components/marketing/GuestTryChat";
import MarketingShell, { mkt } from "@/components/marketing/MarketingShell";
import { logBetaEvent } from "@/lib/analytics/client";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { getMarketingCopy } from "@/lib/i18n/marketingCopy";

function TryPageInner() {
  const searchParams = useSearchParams();
  const preset = useMemo(() => searchParams.get("q") ?? undefined, [searchParams]);
  const { language: appLang } = useLanguage();
  const m = getMarketingCopy(appLang);

  useEffect(() => {
    void logBetaEvent({ eventType: "guest_chat_start", route: "/try" });
  }, []);

  return (
    <MarketingShell>
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
        <Link href="/" className={`mb-6 inline-flex items-center gap-2 ${mkt.link}`}>
          <BookOpen className="h-4 w-4" />
          <span className="text-sm">Frensei</span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">{m.tryPageTitle}</h1>
        <p className={`mt-2 text-sm ${mkt.body}`}>{m.tryPageBody}</p>
        <div className="mt-6">
          <GuestTryChat presetPrompt={preset} source="try_page" theme="light" />
        </div>
      </div>
    </MarketingShell>
  );
}

export default function TryPage() {
  const { language: appLang } = useLanguage();
  const m = getMarketingCopy(appLang);

  return (
    <Suspense
      fallback={
        <div className={`flex min-h-screen items-center justify-center ${mkt.muted}`}>
          {m.loading}
        </div>
      }
    >
      <TryPageInner />
    </Suspense>
  );
}
