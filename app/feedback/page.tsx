import Link from "next/link";
import FeedbackSheetForm from "@/components/feedback/FeedbackSheetForm";
import { getFeedbackCopy } from "@/lib/i18n/feedbackCopy";
import { getLangServer } from "@/src/utils/i18n/serverLang";

export default function FeedbackPage() {
  const lang = getLangServer();
  const copy = getFeedbackCopy(lang);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="rounded-3xl border border-pink-400/60 bg-slate-950/90 p-6 shadow-[0_20px_70px_rgba(236,72,153,0.18)] sm:p-8">
          <p className="text-xs tracking-[0.18em] text-pink-200">{copy.eyebrow}</p>
          <h1 className="mt-2 font-wa-serif text-2xl font-semibold text-slate-50 sm:text-3xl">
            {copy.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-200">{copy.intro}</p>
        </section>

        <FeedbackSheetForm />

        <p className="mt-8 text-center text-xs text-slate-500">
          <Link
            href="/privacy"
            className="text-pink-300/90 hover:text-pink-200 underline-offset-2 hover:underline"
          >
            {copy.privacyLink}
          </Link>
        </p>

        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-200 hover:border-pink-400/60"
          >
            {copy.backHome}
          </Link>
        </div>
      </main>
    </div>
  );
}
