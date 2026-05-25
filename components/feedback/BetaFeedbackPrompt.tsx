"use client";

import { useMemo, useState } from "react";
import { skipBetaFeedbackPrompt, submitBetaFeedback } from "@/lib/feedback/service";
import type { BetaFeedbackSource } from "@/lib/feedback/types";

type Props = {
  visible: boolean;
  userId: string;
  source: BetaFeedbackSource;
  sessionId?: string | null;
  appVersion?: string;
  onSubmitted?: () => void;
  onSkipped?: () => void;
};

export default function BetaFeedbackPrompt({
  visible,
  userId,
  source,
  sessionId,
  appVersion,
  onSubmitted,
  onSkipped,
}: Props) {
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const canSend = useMemo(() => helpful !== null, [helpful]);

  if (!visible) return null;

  if (sent) {
    return (
      <section className="mt-3 rounded-2xl border border-emerald-400/35 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-100">
        Thank you — this helps improve Frensei 🙏
      </section>
    );
  }

  return (
    <section className="mt-3 rounded-2xl border border-slate-700/60 bg-slate-900/55 px-3 py-3 text-slate-100">
      <p className="text-sm font-medium">Was this helpful?</p>
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setHelpful(true)}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
            helpful === true
              ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-100"
              : "border-slate-600 bg-slate-800/70 text-slate-200"
          }`}
        >
          👍 Yes
        </button>
        <button
          type="button"
          onClick={() => setHelpful(false)}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
            helpful === false
              ? "border-rose-400/60 bg-rose-500/20 text-rose-100"
              : "border-slate-600 bg-slate-800/70 text-slate-200"
          }`}
        >
          👎 No
        </button>
      </div>

      {helpful !== null ? (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-slate-300">What felt useful or confusing? (optional)</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Write a quick note..."
            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-wa-ruri focus:outline-none focus:ring-1 focus:ring-wa-ruri/60"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!canSend}
              onClick={() => {
                if (!canSend) return;
                submitBetaFeedback({
                  userId,
                  source,
                  helpful,
                  message,
                  sessionId: sessionId ?? undefined,
                  appVersion,
                });
                setSent(true);
                onSubmitted?.();
              }}
              className="rounded-xl bg-wa-ruri px-3 py-2 text-xs font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              Send feedback
            </button>
            <button
              type="button"
              onClick={() => {
                skipBetaFeedbackPrompt(userId);
                onSkipped?.();
              }}
              className="rounded-xl border border-slate-600 bg-slate-900/70 px-3 py-2 text-xs text-slate-300"
            >
              Skip
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
