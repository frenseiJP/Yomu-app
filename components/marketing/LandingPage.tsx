"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, MessageCircle, Sparkles, UserRound } from "lucide-react";
import GuestTryChat from "@/components/marketing/GuestTryChat";
import MarketingShell, { mkt } from "@/components/marketing/MarketingShell";
import { getAllPhrases } from "@/lib/learn/phrases";
import { logBetaEvent } from "@/lib/analytics/client";
import { createClient } from "@/src/utils/supabase/client";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { getMarketingCopy } from "@/lib/i18n/marketingCopy";
import { localizePhrase } from "@/lib/learn/localizePhrase";

const FEATURED_SLUGS = [
  "itadakimasu",
  "otsukaresama",
  "yoroshiku-onegaishimasu",
  "sumimasen",
  "sumimasen-vs-gomennasai",
  "arigatou-gozaimasu",
];

export default function LandingPage() {
  const featured = getAllPhrases().filter((p) => FEATURED_SLUGS.includes(p.slug));
  const [signedIn, setSignedIn] = useState(false);
  const { language: appLang } = useLanguage();
  const m = getMarketingCopy(appLang);

  useEffect(() => {
    void logBetaEvent({ eventType: "landing_view", route: "/" });
  }, []);

  useEffect(() => {
    let cancelled = false;
    void createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (!cancelled) setSignedIn(Boolean(data.user));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const tryCtaProps = {
    href: "/try",
    onClick: () =>
      void logBetaEvent({
        eventType: "promo_cta_click",
        route: "/",
        metadata: { source: "landing", medium: "cta" },
      }),
  };

  return (
    <MarketingShell>
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-slate-900">Frensei</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link href="/pricing" className={`hidden sm:inline ${mkt.navLink}`}>
            {m.pricing}
          </Link>
          <Link href="/learn" className={`hidden md:inline ${mkt.navLink}`}>
            {m.phraseGuides}
          </Link>
          {signedIn ? (
            <Link
              href="/chat"
              onClick={() =>
                void logBetaEvent({
                  eventType: "home_cta_click",
                  route: "/",
                  metadata: { cta: "continue_learning_header" },
                })
              }
              className={mkt.ctaSm}
            >
              {m.continueLearning}
            </Link>
          ) : (
            <>
              <Link href="/login" className={mkt.navLink}>
                {m.signIn}
              </Link>
              <Link {...tryCtaProps} className={mkt.ctaSm}>
                {m.tryChatNow}
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <section className="grid gap-10 pt-10 lg:grid-cols-2 lg:items-center lg:gap-14 lg:pt-14">
          <div className="space-y-5">
            <p className={mkt.badge}>{m.badge}</p>
            <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl">
              {m.heroTitle1}
              <span className={`mt-1 block ${mkt.accent}`}>{m.heroTitle2}</span>
            </h1>
            <p className={`max-w-lg text-base leading-relaxed sm:text-lg ${mkt.body}`}>{m.heroBody}</p>
            <Link {...tryCtaProps} className={`${mkt.cta} gap-2 px-6 py-3.5`}>
              {m.tryChatNow}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <GuestTryChat compact source="landing_hero" theme="light" />
        </section>

        <section className={`mt-20 p-8 sm:p-10 ${mkt.cardSoft}`}>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{m.empathyTitle}</h2>
          <p className={`mt-3 max-w-2xl text-base leading-relaxed ${mkt.body}`}>{m.empathyBody}</p>
          <ul className="mt-6 space-y-3">
            {m.empathyQuotes.map((quote) => (
              <li key={quote} className={`px-4 py-3 text-sm italic text-slate-800 ${mkt.card}`}>
                &ldquo;{quote}&rdquo;
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20">
          <h2 className="text-2xl font-bold text-slate-900">{m.comparisonTitle}</h2>
          <p className={`mt-1 text-sm ${mkt.muted}`}>{m.comparisonSubtitle}</p>
          <div className={`mt-6 overflow-x-auto ${mkt.card}`}>
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-medium" scope="col" />
                  <th className="px-4 py-3 font-medium" scope="col">
                    {m.comparisonColApps}
                  </th>
                  <th className="px-4 py-3 font-medium" scope="col">
                    {m.comparisonColTutor}
                  </th>
                  <th className={`px-4 py-3 font-semibold ${mkt.accent}`} scope="col">
                    {m.comparisonColFrensei}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {m.comparisonRows.map((row) => (
                  <tr key={row.feature} className="border-b border-slate-100 last:border-0">
                    <th className="px-4 py-3 font-medium text-slate-900" scope="row">
                      {row.feature}
                    </th>
                    <td className={`px-4 py-3 ${mkt.muted}`}>{row.apps}</td>
                    <td className={`px-4 py-3 ${mkt.muted}`}>{row.tutor}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{row.frensei}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-20 grid gap-4 sm:grid-cols-3">
          {[
            { icon: MessageCircle, title: m.featureChatTitle, body: m.featureChatBody },
            { icon: Sparkles, title: m.featureCultureTitle, body: m.featureCultureBody },
            { icon: BookOpen, title: m.featureWordbookTitle, body: m.featureWordbookBody },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className={`p-5 ${mkt.card}`}>
              <Icon className={`mb-3 h-5 w-5 ${mkt.icon}`} />
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
              <p className={`mt-2 text-sm leading-relaxed ${mkt.body}`}>{body}</p>
            </div>
          ))}
        </section>

        <section className={`mt-20 p-8 sm:flex sm:items-start sm:gap-6 ${mkt.cardSoft}`}>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <UserRound className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{m.founderTitle}</h2>
            <p className={`mt-3 text-sm leading-relaxed ${mkt.body}`}>{m.founderBody}</p>
            <p className={`mt-3 text-xs font-medium uppercase tracking-wide ${mkt.accent}`}>
              {m.founderNote}
            </p>
          </div>
        </section>

        <section className="mt-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{m.popularGuidesTitle}</h2>
              <p className={`mt-1 text-sm ${mkt.muted}`}>{m.popularGuidesSubtitle}</p>
            </div>
            <Link href="/learn" className={mkt.link}>
              {m.viewAll}
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => {
              const localized = localizePhrase(p, appLang);
              return (
                <Link
                  key={p.slug}
                  href={`/learn/${p.slug}`}
                  className={`p-4 transition hover:border-blue-300 hover:shadow-md ${mkt.card}`}
                >
                  <p className="text-lg font-semibold text-slate-900">{p.topic}</p>
                  <p className={`mt-1 text-[12px] ${mkt.muted}`}>{localized.meaning}</p>
                  <p className={`mt-2 line-clamp-2 text-[13px] leading-snug ${mkt.body}`}>
                    {localized.nuance}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className={`mt-20 ${mkt.footerBand}`}>
          <h2 className={mkt.footerBandTitle}>{m.ctaTitle}</h2>
          <p className={`mx-auto mt-3 max-w-md ${mkt.footerBandBody}`}>{m.ctaBody}</p>
          <Link
            {...tryCtaProps}
            className="mt-6 inline-flex rounded-lg bg-blue-500 px-8 py-3.5 text-sm font-semibold text-white hover:bg-blue-400"
          >
            {m.createAccount}
          </Link>
        </section>
      </main>
    </MarketingShell>
  );
}
