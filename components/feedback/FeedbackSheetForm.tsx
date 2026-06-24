"use client";

import { useState } from "react";
import { logBetaEvent } from "@/lib/analytics/client";
import type { FeedbackSource } from "@/lib/feedback/googleSheets";
import { feedbackErrorMessage, getFeedbackCopy } from "@/lib/i18n/feedbackCopy";
import { useAppLang } from "@/lib/i18n/useAppLang";
import { useVocabularyUserId } from "@/lib/vocabulary/useVocabularyUserId";

type SubmitState = "idle" | "submitting" | "success" | "error";

export type ReportContextSnapshot = Record<string, string | number>;

type FeedbackSheetFormProps = {
  route?: string;
  source?: FeedbackSource;
  reportContext?: ReportContextSnapshot;
  /** Skip outer card styling when embedded inside another section */
  embedded?: boolean;
};

export default function FeedbackSheetForm({
  route = "/feedback",
  source = "feedback_form",
  reportContext,
  embedded = false,
}: FeedbackSheetFormProps) {
  const userId = useVocabularyUserId();
  const appLang = useAppLang();
  const copy = getFeedbackCopy(appLang);

  const [displayName, setDisplayName] = useState("");
  const [comment, setComment] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const canSubmit = comment.trim().length > 0 && state !== "submitting";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setState("submitting");
    setErrorMessage("");

    const body = comment.trim();
    const createdAt = new Date().toISOString();
    const reportContextJson =
      reportContext && Object.keys(reportContext).length > 0
        ? JSON.stringify(reportContext)
        : undefined;

    try {
      const res = await fetch("/api/feedback/comment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          userId,
          displayName: displayName.trim() || undefined,
          body,
          createdAt,
          route,
          source,
          reportContext: reportContextJson,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setErrorMessage(feedbackErrorMessage(data.error, appLang));
        setState("error");
        return;
      }

      void logBetaEvent({
        eventType: "feedback_submit",
        userId,
        route,
        metadata: {
          source,
          hasDisplayName: Boolean(displayName.trim()),
          bodyLength: body.length,
          hasReportContext: Boolean(reportContextJson),
        },
      });

      setComment("");
      setState("success");
    } catch {
      setErrorMessage(copy.networkError);
      setState("error");
    }
  }

  if (state === "success") {
    const successBlock = (
      <>
        <h2 className="font-wa-serif text-lg font-bold text-emerald-100">{copy.thanksTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-emerald-50/90">{copy.thanksBody}</p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-xl border border-emerald-400/50 bg-emerald-500/20 px-5 py-2.5 text-sm font-medium text-emerald-100 hover:bg-emerald-500/30"
        >
          {copy.sendAnother}
        </button>
      </>
    );

    if (embedded) {
      return (
        <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 sm:p-5">
          {successBlock}
        </div>
      );
    }

    return (
      <section className="mt-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6 sm:mt-8 sm:p-8">
        {successBlock}
      </section>
    );
  }

  const formBlock = (
    <>
      {!embedded ? (
        <>
          <h2 className="font-wa-serif text-lg font-bold text-pink-200">{copy.formTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{copy.formIntro}</p>
        </>
      ) : null}

      <form onSubmit={onSubmit} className={embedded ? "mt-4 space-y-3" : "mt-6 space-y-4"}>
        <label className="block">
          <span className="text-xs font-medium text-slate-400">{copy.nameLabel}</span>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={120}
            className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-pink-500/60 focus:outline-none focus:ring-1 focus:ring-pink-500/40"
            placeholder={copy.namePlaceholder}
            autoComplete="nickname"
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-slate-400">
            {copy.commentLabel} <span className="text-pink-300">*</span>
          </span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={embedded ? 5 : 7}
            maxLength={4000}
            required
            className="mt-1.5 w-full resize-y rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-pink-500/60 focus:outline-none focus:ring-1 focus:ring-pink-500/40"
            placeholder={copy.commentPlaceholder}
          />
          <span className="mt-1 block text-right text-[11px] text-slate-500">{comment.length} / 4000</span>
        </label>

        {state === "error" && errorMessage ? (
          <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className={`inline-flex min-h-[48px] w-full items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition sm:w-auto ${
            canSubmit
              ? "bg-pink-500 text-white shadow-[0_12px_36px_rgba(236,72,153,0.35)] hover:bg-pink-400"
              : "cursor-not-allowed bg-slate-800 text-slate-500"
          }`}
        >
          {state === "submitting" ? copy.submitting : copy.submit}
        </button>
      </form>
    </>
  );

  if (embedded) {
    return formBlock;
  }

  return (
    <section className="mt-6 rounded-2xl border border-pink-500/35 bg-gradient-to-b from-pink-950/30 to-slate-950/80 p-5 sm:mt-8 sm:p-8">
      {formBlock}
    </section>
  );
}
