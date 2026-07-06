"use client";

import { useEffect, useState } from "react";
import { getSessions } from "@/lib/chat/service";
import { getVocabularyLibrary } from "@/lib/vocabulary/service";
import { useVocabularyUserId } from "@/lib/vocabulary/useVocabularyUserId";
import { t } from "@/src/utils/i18n/t";
import type { Lang } from "@/src/utils/i18n/types";
import { mkt } from "@/lib/ui/appTheme";

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
      <div className={`p-3 ${mkt.cardSoft}`}>
        <p className={`text-[11px] font-medium ${mkt.faint}`}>{chatSessionsLabel}</p>
        <p className={`mt-1 text-[20px] font-semibold ${mkt.heading}`}>{sessions}</p>
      </div>
      <div className={`p-3 ${mkt.cardSoft}`}>
        <p className={`text-[11px] font-medium ${mkt.faint}`}>{vocabularyItemsLabel}</p>
        <p className={`mt-1 text-[20px] font-semibold ${mkt.heading}`}>{vocab}</p>
      </div>
      <p className={`sm:col-span-2 text-[10px] ${mkt.faint}`}>{t(lang, "learningStatsSyncNote")}</p>
    </div>
  );
}
