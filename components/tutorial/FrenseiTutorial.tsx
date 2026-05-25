"use client";

import { useCallback, useEffect, useState } from "react";
import { logBetaEvent } from "@/lib/analytics/client";
import { getTutorialSteps } from "@/lib/tutorial/steps";

type FrenseiTutorialProps = {
  open: boolean;
  userId: string;
  route?: string;
  isJa?: boolean;
  /** User reopened from More / Settings */
  manual?: boolean;
  onClose: () => void;
};

export default function FrenseiTutorial({
  open,
  userId,
  route = "/",
  isJa = false,
  manual = false,
  onClose,
}: FrenseiTutorialProps) {
  const steps = getTutorialSteps(isJa);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (open) setStepIndex(0);
  }, [open]);

  const finish = useCallback(
    (kind: "completed" | "skipped") => {
      void logBetaEvent({
        eventType: kind === "completed" ? "tutorial_completed" : "tutorial_skipped",
        userId,
        route,
        metadata: { stepIndex, totalSteps: steps.length },
      });
      onClose();
    },
    [onClose, route, stepIndex, steps.length, userId],
  );

  useEffect(() => {
    if (!open || !userId) return;
    void logBetaEvent({
      eventType: "tutorial_shown",
      userId,
      route,
      metadata: { manual },
    });
  }, [open, route, userId, manual]);

  if (!open) return null;

  const step = steps[stepIndex]!;
  const isLast = stepIndex >= steps.length - 1;

  return (
    <div className="fixed inset-0 z-[270] flex flex-col justify-end sm:items-center sm:justify-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        aria-label={isJa ? "スキップ" : "Skip"}
        onClick={() => finish("skipped")}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="frensei-tutorial-title"
        className="relative z-10 mx-auto w-full max-w-md rounded-t-2xl border border-slate-800/80 bg-gradient-to-b from-slate-950 to-slate-950/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:rounded-2xl sm:p-6"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-wa-ruri/90">
          {isJa ? "はじめかた" : "Quick guide"}
        </p>
        <h2
          id="frensei-tutorial-title"
          className="mt-2 font-wa-serif text-xl font-semibold leading-snug text-slate-50"
        >
          {step.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">{step.body}</p>

        <div className="mt-6 flex items-center justify-center gap-1.5" aria-hidden>
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === stepIndex ? "w-6 bg-wa-ruri" : "w-1.5 bg-slate-700"
              }`}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => finish("skipped")}
            className="min-h-[44px] flex-shrink-0 rounded-xl px-3 py-2 text-sm text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
          >
            {isJa ? "スキップ" : "Skip"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (isLast) finish("completed");
              else setStepIndex((i) => Math.min(i + 1, steps.length - 1));
            }}
            className="min-h-[48px] flex-1 rounded-xl bg-wa-ruri px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_36px_rgba(56,189,248,0.25)] hover:bg-wa-ruri/90"
          >
            {step.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
