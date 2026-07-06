"use client";

import Link from "next/link";
import { BookOpen, MessageCircle, Rocket } from "lucide-react";
import MarketingShell, { mkt } from "@/components/marketing/MarketingShell";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { getLaunchCopy } from "@/lib/i18n/launchCopy";
import { logBetaEvent } from "@/lib/analytics/client";
import { useEffect } from "react";

export default function LaunchPageClient() {
  const { language } = useLanguage();
  const copy = getLaunchCopy(language);

  useEffect(() => {
    void logBetaEvent({
      eventType: "landing_view",
      route: "/launch",
      metadata: { source: "product_hunt" },
    });
  }, []);

  return (
    <MarketingShell>
      <header className="mx-auto flex w-full max-w-4xl items-center justify-between border-b border-slate-200 bg-white px-4 py-6 sm:px-6">
        <Link href="/" className={`flex items-center gap-2 ${mkt.link}`}>
          <BookOpen className="h-5 w-5" />
          <span className="font-semibold">Frensei</span>
        </Link>
        <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-900">
          {copy.badge}
        </span>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6">
        <div className={`flex items-center gap-2 ${mkt.accent}`}>
          <Rocket className="h-5 w-5" />
          <span className="text-sm font-medium">Product Hunt · Beta launch</span>
        </div>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">{copy.title}</h1>
        <p className={`mt-3 text-xl font-medium ${mkt.accent}`}>{copy.tagline}</p>
        <p className={`mt-4 max-w-2xl text-sm leading-relaxed ${mkt.body}`}>{copy.body}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/try?utm_source=product_hunt&utm_medium=launch&utm_campaign=beta"
            onClick={() =>
              void logBetaEvent({
                eventType: "signup_cta_click",
                route: "/launch",
                metadata: { source: "product_hunt", trigger: "try" },
              })
            }
            className={`${mkt.cta} gap-2`}
          >
            <MessageCircle className="h-4 w-4" />
            {copy.tryCta}
          </Link>
          <Link
            href="/trial?utm_source=product_hunt&utm_medium=launch&utm_campaign=beta"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            {copy.trialCta}
          </Link>
        </div>

        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          {copy.features.map((f) => (
            <div key={f.title} className={`p-4 ${mkt.card}`}>
              <h3 className="font-semibold text-slate-900">{f.title}</h3>
              <p className={`mt-2 text-sm ${mkt.body}`}>{f.body}</p>
            </div>
          ))}
        </section>

        <section className={`mt-12 p-6 ${mkt.cardSoft}`}>
          <h2 className="text-lg font-semibold text-slate-900">{copy.phTitle}</h2>
          <ul className={`mt-4 list-inside list-disc space-y-2 text-sm ${mkt.body}`}>
            {copy.phBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <blockquote className={`mt-6 border-l-4 border-blue-400 pl-4 text-sm italic ${mkt.muted}`}>
            {copy.makerComment}
          </blockquote>
        </section>

        <p className={`mt-8 text-center text-xs ${mkt.muted}`}>
          <Link href="/feedback" className={mkt.link}>
            Send beta feedback
          </Link>
          {" · "}
          <Link href="/privacy" className="text-slate-600 hover:text-slate-900">
            Privacy
          </Link>
        </p>
      </main>
    </MarketingShell>
  );
}
