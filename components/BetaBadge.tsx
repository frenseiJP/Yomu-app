"use client";

import type { Lang } from "@/src/utils/i18n/types";
import { getBetaBadgeCopy } from "@/lib/i18n/betaBadgeCopy";

type Props = {
  lang: Lang;
  className?: string;
  showNotice?: boolean;
};

export default function BetaBadge({ lang, className = "", showNotice = false }: Props) {
  const copy = getBetaBadgeCopy(lang);

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="inline-flex items-center rounded-full border border-amber-400/40 bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-100">
        {copy.label}
      </span>
      {showNotice ? (
        <p className="min-w-0 flex-1 text-[11px] leading-snug text-slate-400">{copy.notice}</p>
      ) : null}
    </div>
  );
}
