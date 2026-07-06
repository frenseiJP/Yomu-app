"use client";

import { useState } from "react";
import { logBetaEvent } from "@/lib/analytics/client";
import type { FeedbackSource } from "@/lib/feedback/googleSheets";
import { feedbackErrorMessage, getFeedbackCopy } from "@/lib/i18n/feedbackCopy";
import { useAppLang } from "@/lib/i18n/useAppLang";
import { mkt } from "@/lib/ui/appTheme";
import { useVocabularyUserId } from "@/lib/vocabulary/useVocabularyUserId";

type SubmitState = "idle" | "submitting" | "success" | "error";

export type ReportContextSnapshot = Record<string, string | number>;

type FeedbackSheetFormProps = {
  route?: string;
  source?: FeedbackSource;
  reportContext?: ReportContextSnapshot;
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
        <h2 className="text-lg font-bold text-emerald-800">{copy.thanksTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-emerald-900">{copy.thanksBody}</p>
        <button type="button" onClick={() => setState("idle")} className={`mt-5 ${mkt.secondaryBtn}`}>
          {copy.sendAnother}
        </button>
      </>
    );

    if (embedded) {
      return <div className={`mt-4 p-4 sm:p-5 ${mkt.alertSuccess}`}>{successBlock}</div>;
    }

    return <section className={`mt-6 p-6 sm:mt-8 sm:p-8 ${mkt.alertSuccess}`}>{successBlock}</section>;
  }

  const formBlock = (
    <>
      {!embedded ? (
        <>
          <h2 className={`text-lg font-bold ${mkt.accent}`}>{copy.formTitle}</h2>
          <p className={`mt-2 text-sm leading-relaxed ${mkt.body}`}>{copy.formIntro}</p>
        </>
      ) : null}

      <form onSubmit={onSubmit} className={embedded ? "mt-4 space-y-3" : "mt-6 space-y-4"}>
        <label className="block">
          <span className={`text-xs font-medium ${mkt.muted}`}>{copy.nameLabel}</span>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={120}
            className={`mt-1.5 ${mkt.field}`}
            placeholder={copy.namePlaceholder}
            autoComplete="nickname"
          />
        </label>

        <label className="block">
          <span className={`text-xs font-medium ${mkt.muted}`}>
            {copy.commentLabel} <span className={mkt.accent}>*</span>
          </span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={embedded ? 5 : 7}
            maxLength={4000}
            required
            className={`mt-1.5 w-full resize-y ${mkt.field}`}
            placeholder={copy.commentPlaceholder}
          />
          <span className={`mt-1 block text-right text-[11px] ${mkt.faint}`}>{comment.length} / 4000</span>
        </label>

        {state === "error" && errorMessage ? <p className={mkt.alertError}>{errorMessage}</p> : null}

        <button type="submit" disabled={!canSubmit} className={canSubmit ? mkt.ctaFull : `${mkt.ctaFull} opacity-50`}>
          {state === "submitting" ? copy.submitting : copy.submit}
        </button>
      </form>
    </>
  );

  if (embedded) return formBlock;

  return <section className={`mt-6 p-5 sm:mt-8 sm:p-8 ${mkt.card}`}>{formBlock}</section>;
}
