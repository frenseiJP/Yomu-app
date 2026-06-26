"use client";

import Link from "next/link";
import { BookOpen, MessageCircle, Rocket } from "lucide-react";
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
    <div className="min-h-screen bg-[#020617]">
      <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-6 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white">
          <BookOpen className="h-5 w-5" />
          <span className="font-wa-serif font-semibold">Frensei</span>
        </Link>
        <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-100">
          {copy.badge}
        </span>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6">
        <div className="flex items-center gap-2 text-pink-400">
          <Rocket className="h-5 w-5" />
          <span className="text-sm font-medium">Product Hunt · Beta launch</span>
        </div>
        <h1 className="mt-4 font-wa-serif text-4xl font-bold text-white sm:text-5xl">{copy.title}</h1>
        <p className="mt-3 text-xl text-pink-200/90">{copy.tagline}</p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">{copy.body}</p>

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
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 px-5 py-3 text-sm font-semibold text-white"
          >
            <MessageCircle className="h-4 w-4" />
            {copy.tryCta}
          </Link>
          <Link
            href="/trial?utm_source=product_hunt&utm_medium=launch&utm_campaign=beta"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-5 py-3 text-sm font-medium text-slate-200 hover:border-slate-500"
          >
            {copy.trialCta}
          </Link>
        </div>

        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          {copy.features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <h3 className="font-semibold text-slate-100">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{f.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
          <h2 className="font-wa-serif text-lg font-semibold text-slate-100">{copy.phTitle}</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-slate-300">
            {copy.phBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <blockquote className="mt-6 border-l-2 border-pink-500/50 pl-4 text-sm italic text-slate-400">
            {copy.makerComment}
          </blockquote>
        </section>

        <p className="mt-8 text-center text-xs text-slate-500">
          <Link href="/feedback" className="text-pink-300 hover:text-pink-200">
            Send beta feedback
          </Link>
          {" · "}
          <Link href="/privacy" className="hover:text-slate-400">
            Privacy
          </Link>
        </p>
      </main>
    </div>
  );
}
