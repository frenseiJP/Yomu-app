import Link from "next/link";
import MarketingShell, { mkt } from "@/components/marketing/MarketingShell";
import { getLangServer } from "@/src/utils/i18n/serverLang";
import { getPricingCopy, type PricingPlan } from "@/lib/i18n/pricingCopy";

function PlanCard({ plan, ctaLabel }: { plan: PricingPlan; ctaLabel: string }) {
  const className = plan.highlight
    ? "rounded-2xl border-2 border-blue-500 bg-blue-50 p-5 shadow-sm"
    : `${mkt.card} p-5`;

  const ctaClass = `${mkt.cta} mt-5 w-full py-2.5`;

  const body = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold text-slate-900">{plan.name}</h2>
        {plan.tag ? (
          <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
            {plan.tag}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-900">{plan.price}</p>
      <p className={`text-xs ${mkt.muted}`}>{plan.period}</p>
      <ul className={`mt-4 space-y-2 text-[13px] ${mkt.body}`}>
        {plan.bullets.map((b) => (
          <li key={b}>• {b}</li>
        ))}
      </ul>
    </>
  );

  return (
    <section className={className}>
      {body}
      {plan.href ? (
        plan.external ? (
          <a href={plan.href} className={ctaClass} target="_blank" rel="noopener noreferrer">
            {ctaLabel}
          </a>
        ) : (
          <Link href={plan.href} className={ctaClass}>
            {ctaLabel}
          </Link>
        )
      ) : null}
    </section>
  );
}

export default function PricingPage() {
  const lang = getLangServer();
  const copy = getPricingCopy(lang);
  const { free, pro, standard, intensive, course } = copy.plans;

  return (
    <MarketingShell>
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">{copy.title}</h1>
        <p className={`mt-2 text-sm ${mkt.body}`}>{copy.subtitle}</p>

        <h2 className={`mt-8 text-sm font-semibold uppercase tracking-wide ${mkt.muted}`}>
          {copy.courseSection}
        </h2>
        <p className="mt-1 text-xs font-medium text-emerald-800">{copy.courseNote}</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-1">
          <PlanCard plan={course} ctaLabel={copy.ctaCourse} />
        </div>
        <p className={`mt-3 text-sm ${mkt.body}`}>
          Already purchased?{" "}
          <Link href="/course" className={mkt.link}>
            Open the course start guide →
          </Link>
        </p>

        <h2 className={`mt-10 text-sm font-semibold uppercase tracking-wide ${mkt.muted}`}>
          {copy.appSection}
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <PlanCard plan={free} ctaLabel={copy.ctaApp} />
          <PlanCard plan={pro} ctaLabel={copy.ctaApp} />
        </div>

        <h2 className={`mt-10 text-sm font-semibold uppercase tracking-wide ${mkt.muted}`}>
          {copy.lessonSection}
        </h2>
        <p className="mt-1 text-xs font-medium text-emerald-800">{copy.lessonNote}</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <PlanCard plan={standard} ctaLabel={copy.ctaLesson} />
          <PlanCard plan={intensive} ctaLabel={copy.ctaLesson} />
        </div>

        <Link href="/try" className={`mt-8 inline-flex ${mkt.link}`}>
          ← {copy.back}
        </Link>
      </main>
    </MarketingShell>
  );
}
