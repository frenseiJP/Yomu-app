"use client";

import { Suspense, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookOpen } from "lucide-react";
import GuestTryChat from "@/components/marketing/GuestTryChat";
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
    <div className="min-h-screen bg-[#020617] px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-slate-400 hover:text-slate-200">
          <BookOpen className="h-4 w-4" />
          <span className="text-sm">Frensei</span>
        </Link>
        <h1 className="font-wa-serif text-2xl font-semibold text-slate-50">{m.tryPageTitle}</h1>
        <p className="mt-2 text-sm text-slate-400">{m.tryPageBody}</p>
        <div className="mt-6">
          <GuestTryChat presetPrompt={preset} source="try_page" />
        </div>
      </div>
    </div>
  );
}

export default function TryPage() {
  const { language: appLang } = useLanguage();
  const m = getMarketingCopy(appLang);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#020617] text-slate-400">
          {m.loading}
        </div>
      }
    >
      <TryPageInner />
    </Suspense>
  );
}
