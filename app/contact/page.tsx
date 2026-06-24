import Link from "next/link";
import { CONTACT_EMAIL, getContactCopy } from "@/lib/i18n/legalCopy";
import { getLangServer } from "@/src/utils/i18n/serverLang";

export default function ContactPage() {
  const lang = getLangServer();
  const c = getContactCopy(lang);
  const mailHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(c.mailSubject)}`;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="rounded-3xl border border-pink-400/60 bg-slate-950/90 p-6 shadow-[0_20px_70px_rgba(236,72,153,0.18)] sm:p-8">
          <p className="text-xs tracking-[0.18em] text-pink-200">{c.eyebrow}</p>
          <h1 className="mt-2 font-wa-serif text-2xl font-semibold text-slate-50 sm:text-3xl">
            {c.title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-200">{c.intro}</p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 sm:mt-8 sm:p-6">
          <h2 className="font-wa-serif text-base font-bold text-pink-200 sm:text-lg">
            {c.contactTitle}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            {c.emailLabel}
            <a
              href={mailHref}
              className="break-all text-pink-300 underline decoration-pink-400/50 underline-offset-2 hover:text-pink-200"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">{c.replyNote}</p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 sm:p-6">
          <h2 className="font-wa-serif text-base font-bold text-pink-200 sm:text-lg">
            {c.relatedTitle}
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-200">
            <li>
              <Link href="/feedback" className="text-pink-300 hover:text-pink-200">
                {c.relatedFeedback}
              </Link>
              {c.relatedFeedbackDesc}
            </li>
            <li>
              <Link href="/privacy" className="text-pink-300 hover:text-pink-200">
                {c.relatedPrivacy}
              </Link>
              {c.relatedPrivacyDesc}
            </li>
            <li>
              <Link href="/terms" className="text-pink-300 hover:text-pink-200">
                {c.relatedTerms}
              </Link>
            </li>
          </ul>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-medium text-white shadow-[0_16px_45px_rgba(236,72,153,0.35)] hover:bg-pink-400"
          >
            {c.backHome}
          </Link>
        </div>
      </main>
    </div>
  );
}
