"use client";

import type { SaveCandidate } from "@/lib/save-candidates/types";

function badgeClass(type: SaveCandidate["type"]): string {
  if (type === "word") return "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";
  if (type === "correction") return "border-amber-500/40 bg-amber-500/10 text-amber-200";
  return "border-sky-500/40 bg-sky-500/10 text-sky-200";
}

function displayNote(cand: SaveCandidate): string | null {
  if (cand.type === "correction") {
    return cand.explanation?.trim() || null;
  }
  const note = cand.secondaryText?.trim();
  if (!note || /^your answer:/i.test(note) || /^from this reply$/i.test(note)) return null;
  return note;
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
        const note = displayNote(cand);
        return (
          <div
            key={cand.id}
            className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-900/45 px-2 py-1.5"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${badgeClass(cand.type)}`}
                >
                  {cand.label}
                </span>
                <span className="truncate text-[13px] font-medium text-slate-50">{cand.primaryText}</span>
              </div>
              {note ? (
                <p className="mt-0.5 truncate text-[10px] text-slate-400">{note}</p>
              ) : null}
            </div>
            <button
              type="button"
              disabled={cand.alreadySaved}
              data-tutorial-save={saveDataAttr}
              onClick={() => onSave(cand)}
              className="shrink-0 rounded-md border border-wa-ruri/45 bg-wa-ruri/15 px-2 py-1 text-[10px] font-semibold text-slate-100 disabled:border-slate-700/80 disabled:bg-slate-800/60 disabled:text-slate-500"
            >
              {cand.alreadySaved ? savedButtonLabel : saveButtonLabel}
            </button>
          </div>
        );
      })}
    </div>
  );
}
