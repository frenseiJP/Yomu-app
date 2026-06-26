import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import CalendlyTrialEmbed from "@/components/marketing/CalendlyTrialEmbed";
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
    <div className="min-h-screen bg-[#020617] px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-slate-400 hover:text-slate-200">
          <BookOpen className="h-4 w-4" />
          <span className="text-sm">Frensei</span>
        </Link>

        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-pink-400/90">Beta</p>
        <h1 className="mt-2 font-wa-serif text-3xl font-semibold text-slate-50 sm:text-4xl">
          {copy.title}
        </h1>
        <p className="mt-2 text-sm text-slate-400">{copy.subtitle}</p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">{copy.body}</p>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
          <h2 className="font-wa-serif text-lg font-semibold text-slate-100">{copy.calendlyTitle}</h2>
          <p className="mt-2 text-sm text-slate-400">{copy.calendlyBody}</p>
          {calendlyConfigured ? (
            <CalendlyTrialEmbed url={CALENDLY_URL} ctaLabel={copy.calendlyCta} />
          ) : (
            <p className="mt-4 text-sm text-amber-200/90">{copy.calendlyFallback}</p>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-pink-500/25 bg-pink-500/8 p-6">
          <h2 className="font-wa-serif text-lg font-semibold text-slate-100">{copy.tryChatTitle}</h2>
          <p className="mt-2 text-sm text-slate-300">{copy.tryChatBody}</p>
          <Link
            href="/try?utm_source=trial_page&utm_medium=cta&utm_campaign=beta"
            className="mt-4 inline-flex rounded-xl bg-gradient-to-r from-wa-ruri to-wa-asagi px-5 py-3 text-sm font-medium text-white"
          >
            {copy.tryChatCta}
          </Link>
        </section>
      </div>
    </div>
  );
}
