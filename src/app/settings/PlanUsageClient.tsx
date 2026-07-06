"use client";

import { useEffect, useState } from "react";
import { getChatUsageToday, getUserPlan } from "@/lib/plan/usage";
import { planDisplayName, FREE_DAILY_CHAT_MESSAGES } from "@/lib/plan/limits";
import { t } from "@/src/utils/i18n/t";
import type { Lang } from "@/src/utils/i18n/types";
import { mkt } from "@/lib/ui/appTheme";

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
        <p className={`text-[13px] font-medium ${mkt.heading}`}>{planDisplayName(plan, lang)}</p>
        <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] text-blue-700">
          {plan === "pro" ? "Pro" : t(lang, "planFreeBadge")}
        </span>
      </div>
      <div>
        <div className={`mb-1 flex justify-between text-[11px] ${mkt.faint}`}>
          <span>{t(lang, "planUsageToday")}</span>
          <span>
            {used} / {limit}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      {plan === "free" ? (
        <div className="space-y-2">
          <p className={`text-[11px] leading-relaxed ${mkt.faint}`}>{t(lang, "planUpgradeHint")}</p>
          <div className="flex flex-wrap gap-2">
            <a
              href="/trial"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700 transition hover:bg-blue-100"
            >
              {t(lang, "planLessonsCta")}
            </a>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] text-slate-500">
              {t(lang, "planProWaitlist")}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
