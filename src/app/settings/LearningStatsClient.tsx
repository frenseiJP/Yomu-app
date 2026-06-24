"use client";

import { useEffect, useState } from "react";
import { getSessions } from "@/lib/chat/service";
import { getVocabularyLibrary } from "@/lib/vocabulary/service";
import { useVocabularyUserId } from "@/lib/vocabulary/useVocabularyUserId";
import { t } from "@/src/utils/i18n/t";
import type { Lang } from "@/src/utils/i18n/types";

type Props = {
  lang: Lang;
  chatSessionsLabel: string;
  vocabularyItemsLabel: string;
};

export default function LearningStatsClient({
  lang,
  chatSessionsLabel,
  vocabularyItemsLabel,
}: Props) {
  const userId = useVocabularyUserId();
  const [sessions, setSessions] = useState(0);
  const [vocab, setVocab] = useState(0);

  useEffect(() => {
    if (!userId || userId === "guest") return;
    setSessions(getSessions(userId).length);
    setVocab(getVocabularyLibrary(userId).filter((v) => !v.id.startsWith("topic_")).length);
  }, [userId]);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl border border-slate-800/70 bg-slate-900/45 p-3">
        <p className="text-[11px] font-medium text-slate-400">{chatSessionsLabel}</p>
        <p className="mt-1 text-[20px] font-semibold text-slate-50">{sessions}</p>
      </div>
      <div className="rounded-2xl border border-slate-800/70 bg-slate-900/45 p-3">
        <p className="text-[11px] font-medium text-slate-400">{vocabularyItemsLabel}</p>
        <p className="mt-1 text-[20px] font-semibold text-slate-50">{vocab}</p>
      </div>
      <p className="sm:col-span-2 text-[10px] text-slate-500">{t(lang, "learningStatsSyncNote")}</p>
    </div>
  );
}
