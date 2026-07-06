import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import CalendlyTrialEmbed from "@/components/marketing/CalendlyTrialEmbed";
import MarketingShell, { mkt } from "@/components/marketing/MarketingShell";
import { getTrialCopy } from "@/lib/i18n/trialCopy";
import { getLangServer } from "@/src/utils/i18n/serverLang";

const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL?.trim() || "https://calendly.com";

export const metadata: Metadata = {
  title: "Book a Free Frensei Beta Intro | Calendly",
  description:
    "Schedule a free intro to Frensei — AI Japanese coaching for natural, real-life Japanese. Or try 3 chat messages instantly, no sign-up.",
  alternates: { canonical: "/trial" },
  openGraph: {
    title: "Frensei Beta — Free Intro Call",
    description: "Book a guided walkthrough or try the AI coach free.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Frensei" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frensei Beta — Free Intro",
    description: "Book a call or try 3 free AI chat messages.",
    images: ["/opengraph-image"],
  },
};

export default function TrialPage() {
  const lang = getLangServer();
  const copy = getTrialCopy(lang);
  const calendlyConfigured = /calendly\.com\/[^/]+\/[^/]+/.test(CALENDLY_URL);

  return (
    <MarketingShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <Link href="/" className={`mb-8 inline-flex items-center gap-2 ${mkt.link}`}>
          <BookOpen className="h-4 w-4" />
          <span className="text-sm">Frensei</span>
        </Link>

        <p className={mkt.badge}>Beta</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">{copy.title}</h1>
        <p className={`mt-2 text-sm ${mkt.muted}`}>{copy.subtitle}</p>
        <p className={`mt-4 max-w-2xl text-sm leading-relaxed ${mkt.body}`}>{copy.body}</p>

        <section className={`mt-10 p-6 ${mkt.card}`}>
          <h2 className="text-lg font-semibold text-slate-900">{copy.calendlyTitle}</h2>
          <p className={`mt-2 text-sm ${mkt.body}`}>{copy.calendlyBody}</p>
          {calendlyConfigured ? (
            <CalendlyTrialEmbed url={CALENDLY_URL} ctaLabel={copy.calendlyCta} />
          ) : (
            <p className="mt-4 text-sm font-medium text-amber-800">{copy.calendlyFallback}</p>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="text-lg font-semibold text-slate-900">{copy.tryChatTitle}</h2>
          <p className={`mt-2 text-sm ${mkt.body}`}>{copy.tryChatBody}</p>
          <Link
            href="/try?utm_source=trial_page&utm_medium=cta&utm_campaign=beta"
            className={`mt-4 ${mkt.cta}`}
          >
            {copy.tryChatCta}
          </Link>
        </section>
      </div>
    </MarketingShell>
  );
}
