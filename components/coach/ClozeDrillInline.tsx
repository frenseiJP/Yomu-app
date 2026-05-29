"use client";

import { useMemo, useState } from "react";
import { buildClozeFromCorrection, scoreClozeAnswer, type ClozeDrill } from "@/lib/coach/clozeDrill";
import { applyMasteryFromDrill } from "@/lib/coach/categoryMastery";

type Props = {
  corrected: string;
  userSentence?: string;
  userId: string;
  categoryHint?: string;
  onScored?: (score: 0 | 1 | 2) => void;
};

export default function ClozeDrillInline({
  corrected,
  userSentence,
  userId,
  categoryHint,
  onScored,
}: Props) {
  const drill = useMemo(
    () => buildClozeFromCorrection(corrected, userSentence),
    [corrected, userSentence],
  );
  const [input, setInput] = useState("");
  const [done, setDone] = useState<0 | 1 | 2 | null>(null);

  if (!drill) return null;

  const submit = () => {
    const s = scoreClozeAnswer(drill, input);
    setDone(s);
    applyMasteryFromDrill(userId, categoryHint ?? "particle", s, 2);
    onScored?.(s);
  };

  return (
    <ClozeBody drill={drill} input={input} setInput={setInput} done={done} onSubmit={submit} />
  );
}

function ClozeBody({
  drill,
  input,
  setInput,
  done,
  onSubmit,
}: {
  drill: ClozeDrill;
  input: string;
  setInput: (v: string) => void;
  done: 0 | 1 | 2 | null;
  onSubmit: () => void;
}) {
  return (
    <div className="mt-2 rounded-xl border border-amber-500/25 bg-amber-500/8 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-200/90">
        Quick cloze
      </p>
      <p className="mt-1 font-wa-serif text-[15px] leading-relaxed text-slate-100">{drill.prompt}</p>
      <p className="mt-0.5 text-[11px] text-slate-500">{drill.hint}</p>
      {done == null ? (
        <div className="mt-2 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="missing piece"
            className="min-h-[36px] flex-1 rounded-lg border border-slate-700 bg-slate-900/80 px-2 text-[13px] text-slate-100"
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          />
          <button
            type="button"
            onClick={onSubmit}
            className="min-h-[36px] rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 text-[11px] font-medium text-amber-100"
          >
            Check
          </button>
        </div>
      ) : (
        <p className="mt-2 text-[12px] text-slate-300">
          {done === 2
            ? "Perfect — that matches your correction."
            : done === 1
              ? `Close. Answer: ${drill.answer}`
              : `Try: ${drill.fullSentence}`}
        </p>
      )}
    </div>
  );
}
