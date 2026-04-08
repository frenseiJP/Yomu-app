"use client";

type Props = {
  onSave: () => void;
  onTryAgain: () => void;
  saved?: boolean;
};

export default function TopicActions({ onSave, onTryAgain, saved = false }: Props) {
  return (
    <div className="mt-2 flex items-center gap-2">
      <button
        type="button"
        onClick={onSave}
        disabled={saved}
        className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 text-[11px] font-medium text-emerald-200 disabled:opacity-60"
      >
        {saved ? "Saved" : "Save"}
      </button>
      <button
        type="button"
        onClick={onTryAgain}
        className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-[11px] font-medium text-slate-200"
      >
        Try again
      </button>
    </div>
  );
}
