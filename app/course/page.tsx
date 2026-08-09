import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell, { mkt } from "@/components/marketing/MarketingShell";

export const metadata: Metadata = {
  title: "Course buyers — start Frensei AI | Frensei",
  description:
    "Bought Real Japanese: From Textbook to Tokyo? Activate Frensei AI practice and open the coach chat.",
  alternates: { canonical: "/course" },
  robots: { index: true, follow: true },
};

const STEPS = [
  {
    title: "Open the AI coach",
    body: "Start with 3 free messages anytime — no signup. Course plans unlock longer Frensei AI access (Core: 1 month · VIP: 3 months).",
    href: "/try?utm_source=course_lp&utm_medium=step&utm_campaign=textbook_tokyo",
    cta: "Try Frensei AI →",
  },
  {
    title: "Practice course scenes",
    body: "Ask about convenience-store phrases, 空気を読む, keigo, or Kyoto situations from the videos. Paste a line you just learned.",
    href: "/try?q=Help%20me%20practice%20survival%20Japanese%20from%20a%20convenience%20store&utm_source=course_lp&utm_medium=preset&utm_campaign=textbook_tokyo",
    cta: "Practice a survival phrase →",
  },
  {
    title: "Save words & keep going",
    body: "Create an account to save vocabulary and sync progress. Live 1-on-1 lessons are optional if you want a human coach too.",
    href: "/login?utm_source=course_lp&utm_medium=step&utm_campaign=textbook_tokyo",
    cta: "Create free account →",
  },
];

export default function CourseBuyerPage() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <p className={`text-xs font-semibold uppercase tracking-wide ${mkt.muted}`}>
          After your Gumroad purchase
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Welcome — let&apos;s practice what you just bought
        </h1>
        <p className={`mt-3 text-sm ${mkt.body}`}>
          You&apos;re in the right place if you got{" "}
          <strong>Real Japanese: From Textbook to Tokyo</strong>. Videos live on Gumroad;
          Frensei AI practice lives here.
        </p>

        <div className="mt-8 space-y-4">
          {STEPS.map((step, i) => (
            <section key={step.title} className={`${mkt.card} p-5`}>
              <p className={`text-xs font-semibold ${mkt.muted}`}>Step {i + 1}</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">{step.title}</h2>
              <p className={`mt-2 text-sm ${mkt.body}`}>{step.body}</p>
              <a href={step.href} className={`${mkt.cta} mt-4 inline-flex px-4 py-2.5`}>
                {step.cta}
              </a>
            </section>
          ))}
        </div>

        <div className={`mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950`}>
          <p className="font-semibold">VIP Zoom / certificate</p>
          <p className="mt-1">
            Email{" "}
            <a className="underline" href="mailto:hello@frensei.jp?subject=VIP%20course%20scheduling">
              hello@frensei.jp
            </a>{" "}
            with your Gumroad receipt to schedule native conversation practice and request your
            certificate.
          </p>
        </div>

        <p className={`mt-8 text-sm ${mkt.body}`}>
          Looking for lessons or the app?{" "}
          <a
            className={mkt.link}
            href="https://frensei.jp/?utm_source=app&utm_medium=course_page&utm_campaign=home"
            target="_blank"
            rel="noopener noreferrer"
          >
            Go to frensei.jp
          </a>
        </p>
        <Link href="/try" className={`mt-4 inline-flex text-sm ${mkt.link}`}>
          ← Back to free try
        </Link>
      </main>
    </MarketingShell>
  );
}
