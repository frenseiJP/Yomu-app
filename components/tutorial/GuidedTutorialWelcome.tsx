"use client";

import { getWelcomeCopy } from "@/lib/tutorial/copy";

type GuidedTutorialWelcomeProps = {
  open: boolean;
  isJa?: boolean;
  onStart: () => void;
  onSkip: () => void;
};

export default function GuidedTutorialWelcome({
  open,
  isJa = false,
  onStart,
  onSkip,
}: GuidedTutorialWelcomeProps) {
  if (!open) return null;
  const copy = getWelcomeCopy(isJa);

  return (
    <div className="fixed inset-0 z-[280] flex flex-col justify-end sm:items-center sm:justify-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        aria-label={copy.skip}
        onClick={onSkip}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 mx-auto w-full max-w-md rounded-t-2xl border border-slate-800/80 bg-gradient-to-b from-slate-950 to-slate-950/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:rounded-2xl sm:p-6"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-wa-ruri/90">
          {isJa ? "はじめかた" : "Quick guide"}
        </p>
        <h2 className="mt-2 font-wa-serif text-xl font-semibold leading-snug text-slate-50">
          {copy.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">{copy.body}</p>
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onSkip}
            className="min-h-[44px] flex-shrink-0 rounded-xl px-3 py-2 text-sm text-slate-400 hover:bg-slate-800/80"
          >
            {copy.skip}
          </button>
          <button
            type="button"
            onClick={onStart}
            className="min-h-[48px] flex-1 rounded-xl bg-wa-ruri px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_36px_rgba(56,189,248,0.25)] hover:bg-wa-ruri/90"
          >
            {copy.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
