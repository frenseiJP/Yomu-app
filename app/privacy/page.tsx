import Link from "next/link";
import { CONTACT_EMAIL, getPrivacyCopy } from "@/lib/i18n/legalCopy";
import { getLangServer } from "@/src/utils/i18n/serverLang";

export default function PrivacyPage() {
  const lang = getLangServer();
  const c = getPrivacyCopy(lang);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <main id="top" className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="rounded-3xl border border-pink-400/60 bg-slate-950/90 p-6 shadow-[0_20px_70px_rgba(236,72,153,0.16)] sm:p-8">
          <p className="text-xs tracking-[0.18em] text-pink-200">{c.eyebrow}</p>
          <h1 className="mt-2 font-wa-serif text-2xl font-semibold text-slate-50 sm:text-3xl">
            {c.title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-200">{c.intro}</p>
        </section>

        <section className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
          {c.sections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 sm:p-6"
            >
              <h2 className="font-wa-serif text-base font-bold text-pink-200 sm:text-lg">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3">
                {(section.body ?? []).map((line) => (
                  <p key={line} className="text-sm leading-7 text-slate-200">
                    {line}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-pink-500/40 bg-slate-950/90 p-5 sm:mt-10 sm:p-6">
          <p className="text-sm font-medium text-pink-100">{c.contactTitle}</p>
          <p className="mt-2 text-sm leading-7 text-slate-200">
            {c.contactBody}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(c.mailSubject)}`}
              className="text-pink-300 underline decoration-pink-400/50 underline-offset-2 hover:text-pink-200"
            >
              {CONTACT_EMAIL}
            </a>
            {lang === "ja" ? "までご連絡ください。" : lang === "ko" ? "로 문의해 주세요." : lang === "zh" ? "。" : "."}
          </p>
          <p className="mt-3 text-sm text-slate-400">
            <Link href="/contact" className="text-pink-300 hover:text-pink-200">
              {c.contactPageLink}
            </Link>
            {lang === "ja"
              ? "もご利用いただけます。"
              : lang === "ko"
                ? "도 이용할 수 있습니다."
                : lang === "zh"
                  ? "也可使用。"
                  : " is also available."}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-medium text-white shadow-[0_16px_45px_rgba(236,72,153,0.35)] hover:bg-pink-400"
            >
              {c.backHome}
            </Link>
            <a
              href="#top"
              className="inline-flex items-center rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-200 hover:border-pink-400/60"
            >
              {c.backToTop}
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
