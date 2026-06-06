"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, MessageCircle, Sparkles } from "lucide-react";
import GuestTryChat from "@/components/marketing/GuestTryChat";
import { getAllPhrases } from "@/lib/learn/phrases";
import { logBetaEvent } from "@/lib/analytics/client";
import { createClient } from "@/src/utils/supabase/client";

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

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#020617]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(236,72,153,0.18), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(42,92,170,0.12), transparent)",
        }}
      />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-wa-ruri to-wa-asagi shadow-lg">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="font-wa-serif text-lg font-semibold text-slate-100">Frensei</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/learn"
            className="hidden rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-slate-200 sm:inline"
          >
            Phrase guides
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
              className="rounded-xl bg-gradient-to-r from-wa-ruri to-wa-asagi px-4 py-2 text-sm font-medium text-white shadow-lg hover:opacity-95"
            >
              Continue learning
            </Link>
          ) : (
            <>
              <Link
                href="/app"
                className="hidden rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-slate-200 md:inline"
              >
                Open app
              </Link>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/login?intent=signup"
                onClick={() =>
                  void logBetaEvent({
                    eventType: "signup_cta_click",
                    route: "/",
                    metadata: { source: "landing_header" },
                  })
                }
                className="rounded-xl bg-gradient-to-r from-pink-500/90 to-pink-600/90 px-4 py-2 text-sm font-medium text-white shadow-lg hover:from-pink-500 hover:to-pink-600"
              >
                Start free
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <section className="grid gap-10 pt-6 lg:grid-cols-2 lg:items-center lg:gap-14 lg:pt-12">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-pink-500/25 bg-pink-500/8 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-pink-200/90">
              <Sparkles className="h-3.5 w-3.5" />
              AI Japanese coach
            </p>
            <h1 className="font-wa-serif text-4xl font-semibold leading-[1.15] tracking-tight text-slate-50 sm:text-5xl">
              Stop sounding like a textbook.
              <span className="mt-2 block bg-gradient-to-r from-pink-300 to-sky-300 bg-clip-text text-transparent">
                Start sounding natural.
              </span>
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-slate-400 sm:text-lg">
              Frensei coaches nuance, politeness, and real-life Japanese—not grammar drills.
              Try 3 free messages, no sign-up.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/try"
                className="inline-flex items-center gap-2 rounded-xl bg-wa-ruri px-5 py-3 text-sm font-medium text-white shadow-glass hover:bg-wa-asagi"
              >
                Try chat now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/60 px-5 py-3 text-sm font-medium text-slate-200 hover:border-slate-600"
              >
                Browse phrase guides
              </Link>
            </div>
          </div>

          <GuestTryChat compact source="landing_hero" />
        </section>

        <section className="mt-20 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: MessageCircle,
              title: "Chat-first coaching",
              body: "Ask anything—meanings, culture, or polish your Japanese. Sensei answers like a real coach.",
            },
            {
              icon: Sparkles,
              title: "Culture included",
              body: "Every phrase carries context about relationships, work, and daily life in Japan.",
            },
            {
              icon: BookOpen,
              title: "Your wordbook",
              body: "Save words from chat. Build a personal library tied to your level and topics.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5 backdrop-blur-sm"
            >
              <Icon className="mb-3 h-5 w-5 text-pink-400/90" />
              <h2 className="font-wa-serif text-lg font-semibold text-slate-100">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{body}</p>
            </div>
          ))}
        </section>

        <section className="mt-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-wa-serif text-2xl font-semibold text-slate-100">
                Popular phrase guides
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                SEO-friendly guides—then ask Sensei to go deeper.
              </p>
            </div>
            <Link href="/learn" className="text-sm text-pink-300 hover:text-pink-200">
              View all →
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <Link
                key={p.slug}
                href={`/learn/${p.slug}`}
                className="group rounded-2xl border border-slate-800/80 bg-slate-950/50 p-4 transition hover:border-pink-500/30 hover:bg-slate-900/60"
              >
                <p className="font-wa-serif text-lg text-slate-100 group-hover:text-pink-100">
                  {p.topic}
                </p>
                <p className="mt-1 text-[12px] text-slate-500">{p.meaningEn}</p>
                <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-slate-400">
                  {p.nuance}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-pink-500/20 bg-gradient-to-br from-slate-950 via-slate-950 to-pink-950/30 p-8 text-center sm:p-12">
          <h2 className="font-wa-serif text-2xl font-semibold text-slate-50 sm:text-3xl">
            Ready for unlimited coaching?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
            Free account · Daily missions · Progress tracking · Personal wordbook
          </p>
          <Link
            href="/login?intent=signup"
            onClick={() =>
              void logBetaEvent({
                eventType: "signup_cta_click",
                route: "/",
                metadata: { source: "landing_footer" },
              })
            }
            className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 px-8 py-3.5 text-sm font-medium text-white shadow-lg hover:from-pink-400 hover:to-pink-500"
          >
            Create free account
          </Link>
        </section>
      </main>
    </div>
  );
}
