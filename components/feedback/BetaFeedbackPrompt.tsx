"use client";

import { useMemo, useState } from "react";
import { skipBetaFeedbackPrompt, submitBetaFeedback } from "@/lib/feedback/service";
import type { BetaFeedbackSource } from "@/lib/feedback/types";
import { getBetaFeedbackCopy } from "@/lib/i18n/betaFeedbackCopy";
import type { Lang } from "@/src/utils/i18n/types";

type Props = {
  visible: boolean;
  userId: string;
  source: BetaFeedbackSource;
  sessionId?: string | null;
  appVersion?: string;
  appLang?: Lang;
  onSubmitted?: () => void;
  onSkipped?: () => void;
};

export default function BetaFeedbackPrompt({
  visible,
  userId,
  source,
  sessionId,
  appVersion,
  appLang = "en",
  onSubmitted,
  onSkipped,
}: Props) {
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const copy = useMemo(() => getBetaFeedbackCopy(appLang), [appLang]);

  const canSend = helpful !== null;

  if (!visible) return null;

  if (sent) {
    return (
      <p className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-center text-[11px] text-emerald-100">
        {copy.thanks}
      </p>
    );
  }

  return (
    <section className="rounded-xl border border-slate-700/55 bg-slate-900/75 px-3 py-2 text-slate-100 shadow-sm">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <p className="min-w-0 flex-1 text-[11px] font-medium leading-snug text-slate-200">{copy.ask}</p>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setHelpful(true);
              setExpanded(true);
            }}
            className={`rounded-full border px-2 py-1 text-[10px] font-medium ${
              helpful === true
                ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-100"
                : "border-slate-600 bg-slate-800/70 text-slate-200"
            }`}
          >
            {copy.yes}
          </button>
          <button
            type="button"
            onClick={() => {
              setHelpful(false);
              setExpanded(true);
            }}
            className={`rounded-full border px-2 py-1 text-[10px] font-medium ${
              helpful === false
                ? "border-rose-400/60 bg-rose-500/20 text-rose-100"
                : "border-slate-600 bg-slate-800/70 text-slate-200"
            }`}
          >
            {copy.no}
          </button>
          <button
            type="button"
            onClick={() => {
              skipBetaFeedbackPrompt(userId);
              onSkipped?.();
            }}
            className="rounded-full px-2 py-1 text-[10px] text-slate-500 hover:text-slate-300"
          >
            {copy.skip}
          </button>
        </div>
      </div>

      {expanded && helpful !== null ? (
        <div className="mt-2 space-y-1.5">
          <p className="text-[10px] text-slate-400">{copy.note}</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            placeholder={copy.placeholder}
            className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950/70 px-2.5 py-1.5 text-[12px] text-slate-100 placeholder:text-slate-500 focus:border-wa-ruri focus:outline-none focus:ring-1 focus:ring-wa-ruri/60"
          />
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
            className="w-full rounded-lg bg-wa-ruri px-3 py-2 text-[11px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {copy.send}
          </button>
        </div>
      ) : null}
    </section>
  );
}
