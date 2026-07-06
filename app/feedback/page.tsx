import Link from "next/link";
import FeedbackSheetForm from "@/components/feedback/FeedbackSheetForm";
import { getFeedbackCopy } from "@/lib/i18n/feedbackCopy";
import { getLangServer } from "@/src/utils/i18n/serverLang";
import { mkt } from "@/lib/ui/appTheme";

export default function FeedbackPage() {
  const lang = getLangServer();
  const copy = getFeedbackCopy(lang);

  return (
    <div className={mkt.page}>
      <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <section className={mkt.cardHero}>
          <p className={mkt.eyebrow}>{copy.eyebrow}</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">{copy.title}</h1>
          <p className={`mt-3 text-sm leading-relaxed ${mkt.body}`}>{copy.intro}</p>
        </section>

        <FeedbackSheetForm />

        <p className={`mt-8 text-center text-xs ${mkt.faint}`}>
          <Link href="/privacy" className={mkt.link}>
            {copy.privacyLink}
          </Link>
        </p>

        <div className="mt-6 flex justify-center">
          <Link href="/" className={mkt.secondaryBtn}>
            {copy.backHome}
          </Link>
        </div>
      </main>
    </div>
  );
}
