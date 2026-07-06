import Link from "next/link";
import { CONTACT_EMAIL, getPrivacyCopy } from "@/lib/i18n/legalCopy";
import { getLangServer } from "@/src/utils/i18n/serverLang";
import { mkt } from "@/lib/ui/appTheme";

export default function PrivacyPage() {
  const lang = getLangServer();
  const c = getPrivacyCopy(lang);

  return (
    <div className={mkt.page}>
      <main id="top" className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className={mkt.cardHero}>
          <p className={mkt.eyebrow}>{c.eyebrow}</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">{c.title}</h1>
          <p className={`mt-4 text-sm leading-relaxed ${mkt.body}`}>{c.intro}</p>
        </section>

        <section className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
          {c.sections.map((section) => (
            <article key={section.title} className={`p-5 sm:p-6 ${mkt.card}`}>
              <h2 className={mkt.articleTitle}>{section.title}</h2>
              <div className="mt-3 space-y-3">
                {(section.body ?? []).map((line) => (
                  <p key={line} className={`text-sm leading-7 ${mkt.body}`}>
                    {line}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className={`mt-8 p-5 sm:mt-10 sm:p-6 ${mkt.card}`}>
          <p className={`text-sm font-medium ${mkt.accent}`}>{c.contactTitle}</p>
          <p className={`mt-2 text-sm leading-7 ${mkt.body}`}>
            {c.contactBody}
            <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(c.mailSubject)}`} className={mkt.link}>
              {CONTACT_EMAIL}
            </a>
            {lang === "ja" ? "までご連絡ください。" : lang === "ko" ? "로 문의해 주세요." : lang === "zh" ? "。" : "."}
          </p>
          <p className={`mt-3 text-sm ${mkt.muted}`}>
            <Link href="/contact" className={mkt.link}>
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
            <Link href="/" className={mkt.cta}>
              {c.backHome}
            </Link>
            <a href="#top" className={mkt.secondaryBtn}>
              {c.backToTop}
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
