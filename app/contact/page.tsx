import Link from "next/link";
import { CONTACT_EMAIL, getContactCopy } from "@/lib/i18n/legalCopy";
import { getLangServer } from "@/src/utils/i18n/serverLang";
import { mkt } from "@/lib/ui/appTheme";

export default function ContactPage() {
  const lang = getLangServer();
  const c = getContactCopy(lang);
  const mailHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(c.mailSubject)}`;

  return (
    <div className={mkt.page}>
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className={mkt.cardHero}>
          <p className={mkt.eyebrow}>{c.eyebrow}</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">{c.title}</h1>
          <p className={`mt-4 text-sm leading-relaxed ${mkt.body}`}>{c.intro}</p>
        </section>

        <section className={`mt-6 p-5 sm:mt-8 sm:p-6 ${mkt.card}`}>
          <h2 className={mkt.articleTitle}>{c.contactTitle}</h2>
          <p className={`mt-3 text-sm leading-7 ${mkt.body}`}>
            {c.emailLabel}
            <a href={mailHref} className={`break-all ${mkt.link}`}>
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className={`mt-4 text-sm leading-7 ${mkt.body}`}>{c.replyNote}</p>
        </section>

        <section className={`mt-6 p-5 sm:p-6 ${mkt.card}`}>
          <h2 className={mkt.articleTitle}>{c.relatedTitle}</h2>
          <ul className={`mt-3 list-inside list-disc space-y-2 text-sm ${mkt.body}`}>
            <li>
              <Link href="/feedback" className={mkt.link}>
                {c.relatedFeedback}
              </Link>
              {c.relatedFeedbackDesc}
            </li>
            <li>
              <Link href="/privacy" className={mkt.link}>
                {c.relatedPrivacy}
              </Link>
              {c.relatedPrivacyDesc}
            </li>
            <li>
              <Link href="/terms" className={mkt.link}>
                {c.relatedTerms}
              </Link>
            </li>
          </ul>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className={mkt.cta}>
            {c.backHome}
          </Link>
        </div>
      </main>
    </div>
  );
}
