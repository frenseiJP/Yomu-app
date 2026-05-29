"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { importContentFromPaste } from "@/lib/coach/contentImport";
import { getVocabularyLibrary } from "@/lib/vocabulary/service";
import { saveCandidateToVocabulary } from "@/lib/save-candidates/service";
import type { SaveCandidate } from "@/lib/save-candidates/types";
import { logBetaEvent } from "@/lib/analytics/client";

type Props = {
  userId: string;
  sessionId?: string | null;
};

export default function ChatContentImportSheet({ userId, sessionId }: Props) {
  const [open, setOpen] = useState(false);
  const [raw, setRaw] = useState("");
  const [savedCount, setSavedCount] = useState(0);

  const runImport = () => {
    const existing = getVocabularyLibrary(userId).map((v) => v.term);
    const result = importContentFromPaste(raw, { existingTerms: existing, max: 4 });
    let n = 0;
    for (const cand of result.candidates) {
      if (!cand.alreadySaved) {
        saveCandidateToVocabulary(cand, userId);
        n++;
      }
    }
    setSavedCount(n);
    void logBetaEvent({
      eventType: "coach_content_import",
      userId,
      sessionId: sessionId ?? undefined,
      route: "/chat",
      metadata: { saved: n, candidates: result.candidates.length },
    });
    setRaw("");
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg border border-slate-700/60 bg-slate-900/50 px-3 py-2 text-left text-[12px] font-medium text-slate-300"
      >
        <span>Paste Japanese to save</span>
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>
      {open ? (
        <div className="mt-2 space-y-2">
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={2}
            placeholder="メッセージや日記の一行…"
            className="w-full resize-y rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1.5 text-[12px] text-slate-100"
          />
          <button
            type="button"
            disabled={!raw.trim()}
            onClick={runImport}
            className="rounded-lg border border-wa-ruri/40 bg-wa-ruri/15 px-2.5 py-1.5 text-[11px] font-medium text-sky-100 disabled:opacity-50"
          >
            Save coach picks
          </button>
          {savedCount > 0 ? (
            <p className="text-[11px] text-emerald-300/90">Saved {savedCount} phrase(s) to vocabulary.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
