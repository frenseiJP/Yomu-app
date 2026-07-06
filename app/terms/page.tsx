import Link from "next/link";
import { getTermsCopy, CONTACT_EMAIL } from "@/lib/i18n/legalCopy";
import { getLangServer } from "@/src/utils/i18n/serverLang";
import { mkt } from "@/lib/ui/appTheme";

export default function TermsPage() {
  const lang = getLangServer();
  const c = getTermsCopy(lang);

  return (
    <div className={mkt.page}>
      <main id="top" className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className={mkt.cardHero}>
          <p className={mkt.eyebrow}>{c.eyebrow}</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">{c.title}</h1>
          <p className={`mt-3 text-sm ${mkt.muted}`}>
            {c.lastUpdatedLabel}：{c.lastUpdated} ｜ {c.versionLabel}：{c.version}
          </p>
          <p className={`mt-5 text-sm leading-relaxed ${mkt.body}`}>{c.intro}</p>
        </section>

        <section className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
          {c.articles.map((article) => (
            <article key={article.title} className={`p-5 sm:p-6 ${mkt.card}`}>
              <h2 className={mkt.articleTitle}>{article.title}</h2>
              {article.body ? (
                <div className="mt-3 space-y-3">
                  {article.body.map((line) => (
                    <p key={line} className={`text-sm leading-7 ${mkt.body}`}>
                      {line}
                    </p>
                  ))}
                </div>
              ) : null}
              {article.bullets ? (
                <ul className={`mt-3 list-disc space-y-2 pl-5 text-sm leading-7 ${mkt.body}`}>
                  {article.bullets.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </section>

        <section className={`mt-8 p-5 sm:mt-10 sm:p-6 ${mkt.card}`}>
          <p className={`text-sm leading-7 ${mkt.body}`}>
            {c.contactBlock.replace("frensei.jp@gmail.com", CONTACT_EMAIL)}
            <br />
            {c.contactHours}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link href="/" className={mkt.cta}>
              {c.agreeCta}
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
