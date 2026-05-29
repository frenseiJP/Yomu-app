"use client";

import { useState } from "react";
import { importContentFromPaste } from "@/lib/coach/contentImport";
import type { SaveCandidate } from "@/lib/save-candidates/types";
import { SaveCandidateList } from "@/components/save-candidates/SaveCandidateList";
import { saveCandidateToVocabulary } from "@/lib/save-candidates/service";
import { getVocabularyLibrary } from "@/lib/vocabulary/service";
import { buildClozeFromCorrection } from "@/lib/coach/clozeDrill";
import { mistakeCategoryLabel } from "@/lib/vocabulary/mistakeCategory";
import type { MistakeCategory } from "@/lib/vocabulary/mistakeCategory";

type Props = {
  userId: string;
  onStartClozeChat?: (prompt: string) => void;
};

export default function ContentImportPanel({ userId, onStartClozeChat }: Props) {
  const [raw, setRaw] = useState("");
  const [candidates, setCandidates] = useState<SaveCandidate[]>([]);
  const [weakCats, setWeakCats] = useState<string[]>([]);
  const [sample, setSample] = useState("");

  const runImport = () => {
    const existing = getVocabularyLibrary(userId).map((v) => v.term);
    const result = importContentFromPaste(raw, { existingTerms: existing });
    setCandidates(result.candidates);
    setWeakCats(result.weakCategories);
    setSample(result.sampleLine);
  };

  const cloze = sample ? buildClozeFromCorrection(sample) : null;

  return (
    <section className="rounded-xl border-0 bg-transparent p-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Learn from your life
      </p>
      <p className="mt-1 text-[12px] text-slate-400">
        Paste a message, diary line, or subtitle. Sensei picks phrases worth saving — not a lesson list.
      </p>
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={4}
        placeholder="例：すみません、少し遅れます。今日はお疲れさまでした。"
        className="mt-3 w-full resize-y rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-[13px] text-slate-100 placeholder:text-slate-600"
      />
      <button
        type="button"
        onClick={runImport}
        disabled={!raw.trim()}
        className="mt-2 min-h-[40px] rounded-lg border border-wa-ruri/40 bg-wa-ruri/15 px-3 text-[12px] font-medium text-sky-100 hover:bg-wa-ruri/25 disabled:opacity-50"
      >
        Find coach picks
      </button>
      {weakCats.length > 0 ? (
        <p className="mt-2 text-[11px] text-slate-500">
          Likely focus:{" "}
          {weakCats
            .map((c) => mistakeCategoryLabel(c as MistakeCategory) ?? c)
            .join(" · ")}
        </p>
      ) : null}
      {candidates.length > 0 ? (
        <div className="mt-3">
          <SaveCandidateList
            candidates={candidates}
            onSave={(cand) => {
              saveCandidateToVocabulary(cand, userId);
              setCandidates((prev) =>
                prev.map((c) => (c.id === cand.id ? { ...c, alreadySaved: true } : c)),
              );
            }}
          />
        </div>
      ) : null}
      {cloze && onStartClozeChat ? (
        <button
          type="button"
          onClick={() =>
            onStartClozeChat(
              `Content practice — fill the gap:\n${cloze.prompt}\n(Hint: ${cloze.hint})`,
            )
          }
          className="mt-3 text-[11px] font-medium text-amber-200/90 hover:text-amber-100"
        >
          Try one cloze in chat →
        </button>
      ) : null}
    </section>
  );
}
