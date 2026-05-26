"use client";

import type { SaveCandidate } from "@/lib/save-candidates/types";

function badgeClass(type: SaveCandidate["type"]): string {
  if (type === "word") return "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";
  if (type === "correction") return "border-amber-500/40 bg-amber-500/10 text-amber-200";
  return "border-sky-500/40 bg-sky-500/10 text-sky-200";
}

function displayTerm(cand: SaveCandidate): string {
  return cand.term || cand.primaryText;
}

function displayMeaning(cand: SaveCandidate): string {
  return cand.meaning || cand.secondaryText || "";
}

export function SaveCandidateList({
  candidates,
  onSave,
  title = "Save useful words",
  highlight,
  saveButtonLabel = "Save",
  savedButtonLabel = "Saved",
  saveDataAttr,
}: {
  candidates: SaveCandidate[];
  onSave: (cand: SaveCandidate) => void;
  title?: string;
  highlight?: boolean;
  saveButtonLabel?: string;
  savedButtonLabel?: string;
  saveDataAttr?: string;
}) {
  if (candidates.length === 0) return null;

  return (
    <div
      className={`space-y-1.5 border-t border-slate-800/35 pt-2 ${
        highlight ? "rounded-xl ring-2 ring-pink-400/40 ring-offset-2 ring-offset-slate-950" : ""
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      {candidates.map((cand) => {
        const term = displayTerm(cand);
        const meaning = displayMeaning(cand);
        const isPhrase = cand.type === "phrase";
        return (
          <div
            key={cand.id}
            className="flex items-start gap-2 rounded-lg border border-slate-700/50 bg-slate-900/45 px-2 py-1.5"
          >
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${badgeClass(cand.type)}`}
                >
                  {cand.label}
                </span>
                <span className="text-[13px] font-medium leading-snug text-slate-50">{term}</span>
              </div>
              {isPhrase && cand.exampleSentence ? (
                <p className="text-[10px] leading-snug text-slate-400">
                  <span className="font-medium text-slate-500">Example: </span>
                  <span className="text-slate-300">{cand.exampleSentence}</span>
                </p>
              ) : null}
              {meaning ? (
                <p className="text-[10px] leading-snug text-slate-400">
                  <span className="font-medium text-slate-500">Meaning: </span>
                  {meaning}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              disabled={cand.alreadySaved}
              data-tutorial-save={saveDataAttr}
              onClick={() => onSave(cand)}
              className="mt-0.5 shrink-0 rounded-md border border-wa-ruri/45 bg-wa-ruri/15 px-2 py-1 text-[10px] font-semibold text-slate-100 disabled:border-slate-700/80 disabled:bg-slate-800/60 disabled:text-slate-500"
            >
              {cand.alreadySaved ? savedButtonLabel : saveButtonLabel}
            </button>
          </div>
        );
      })}
    </div>
  );
}
