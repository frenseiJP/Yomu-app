"use client";

import { useEffect, useState } from "react";
import { getChatUsageToday, getUserPlan } from "@/lib/plan/usage";
import { planDisplayName, FREE_DAILY_CHAT_MESSAGES } from "@/lib/plan/limits";
import { t } from "@/src/utils/i18n/t";
import type { Lang } from "@/src/utils/i18n/types";

type Props = { lang: Lang };

export default function PlanUsageClient({ lang }: Props) {
  const [used, setUsed] = useState(0);
  const [limit, setLimit] = useState(FREE_DAILY_CHAT_MESSAGES);
  const [plan, setPlan] = useState<"free" | "pro">("free");

  useEffect(() => {
    void (async () => {
      const p = await getUserPlan();
      setPlan(p);
      const u = await getChatUsageToday();
      setUsed(u.used);
      setLimit(u.limit);
    })();
  }, []);

  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-medium text-slate-100">{planDisplayName(plan, lang)}</p>
        <span className="rounded-full border border-violet-500/25 bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-200">
          {plan === "pro" ? "Pro" : t(lang, "planFreeBadge")}
        </span>
      </div>
      <div>
        <div className="mb-1 flex justify-between text-[11px] text-slate-400">
          <span>{t(lang, "planUsageToday")}</span>
          <span>
            {used} / {limit}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      {plan === "free" ? (
        <div className="space-y-2">
          <p className="text-[11px] leading-relaxed text-slate-500">{t(lang, "planUpgradeHint")}</p>
          <div className="flex flex-wrap gap-2">
            <a
              href="https://frensei.jp/trial/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-[11px] font-medium text-pink-200 transition hover:bg-pink-500/20"
            >
              {t(lang, "planLessonsCta")}
            </a>
            <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-[11px] text-slate-500">
              {t(lang, "planProWaitlist")}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
