"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useEffect } from "react";
import type { ShareCorrectionPayload } from "@/lib/share/encode";
import { logBetaEvent } from "@/lib/analytics/client";
import MarketingShell, { mkt } from "@/components/marketing/MarketingShell";

type Props = {
  data: ShareCorrectionPayload;
};

export default function ShareCorrectionView({ data }: Props) {
  useEffect(() => {
    void logBetaEvent({
      eventType: "landing_view",
      route: "/share",
      metadata: { source: "share_page" },
    });
  }, []);

  return (
    <MarketingShell className="px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-lg">
        <Link href="/" className={`mb-8 inline-flex items-center gap-2 ${mkt.muted} hover:text-slate-900`}>
          <BookOpen className="h-4 w-4" />
          <span className="text-sm">Frensei</span>
        </Link>

        <p className={mkt.badge}>Shared correction</p>
        <h1 className={`mt-2 text-2xl font-semibold ${mkt.heading}`}>Natural Japanese coaching</h1>

        <div className="mt-8 space-y-4">
          {data.niceLine ? (
            <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">Nice</p>
              <p className={`mt-2 ${mkt.heading}`}>{data.niceLine}</p>
            </section>
          ) : null}

          <section className={`p-4 ${mkt.card}`}>
            <p className={`text-[10px] font-semibold uppercase tracking-wider ${mkt.faint}`}>You wrote</p>
            <p className={`mt-2 ${mkt.heading}`}>{data.userText}</p>
          </section>

          <section className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-700">Better</p>
            <p className={`mt-2 text-lg ${mkt.heading}`}>{data.correctedSentence}</p>
          </section>

          <section className={`p-4 ${mkt.card}`}>
            <p className={`text-[10px] font-semibold uppercase tracking-wider ${mkt.faint}`}>Why</p>
            <p className={`mt-2 leading-relaxed ${mkt.body}`}>{data.whyEnglish}</p>
          </section>
        </div>

        <div className={`mt-10 p-6 text-center ${mkt.alertInfo}`}>
          <p className={`text-sm ${mkt.body}`}>Want your own Japanese coach?</p>
          <Link
            href="/login?intent=signup&utm_source=share&utm_medium=social&utm_campaign=beta"
            onClick={() =>
              void logBetaEvent({
                eventType: "signup_cta_click",
                route: "/share",
                metadata: { source: "share_page", trigger: "signup" },
              })
            }
            className={`mt-4 inline-flex ${mkt.cta}`}
          >
            Try Frensei free
          </Link>
          <Link href="/try?utm_source=share&utm_medium=social&utm_campaign=beta" className={`mt-3 block text-[12px] ${mkt.link}`}>
            Or try 3 messages without signing up
          </Link>
        </div>
      </div>
    </MarketingShell>
  );
}
