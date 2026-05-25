"use client";

import { useState } from "react";
import { logBetaEvent } from "@/lib/analytics/client";
import type { FeedbackSource } from "@/lib/feedback/googleSheets";
import { useVocabularyUserId } from "@/lib/vocabulary/useVocabularyUserId";
import { getLangClient } from "@/src/utils/i18n/clientLang";

type SubmitState = "idle" | "submitting" | "success" | "error";

export type ReportContextSnapshot = Record<string, string | number>;

type FeedbackSheetFormProps = {
  route?: string;
  source?: FeedbackSource;
  reportContext?: ReportContextSnapshot;
  /** Skip outer card styling when embedded inside another section */
  embedded?: boolean;
};

function errorMessageForCode(code: string | undefined, isJa: boolean): string {
  if (code === "sheets_not_configured") {
    return isJa
      ? "フィードバックの記録がまだ設定されていません。サーバー側で FEEDBACK_SHEETS_WEBHOOK_URL を設定してください。"
      : "Feedback recording is not configured yet. Please set FEEDBACK_SHEETS_WEBHOOK_URL on the server.";
  }
  if (code === "sheets_script_not_ready") {
    return isJa
      ? "Google Apps Script の Webhook がまだ準備できていません。scripts/google-apps-script-feedback.gs を Apps Script に貼り付け、Web アプリとして再デプロイしてください。"
      : "The Google Apps Script webhook is not ready yet. Paste scripts/google-apps-script-feedback.gs into Apps Script, then create a new web app deployment.";
  }
  return isJa
    ? "フィードバックを保存できませんでした。しばらくしてからもう一度お試しください。"
    : "Could not save your feedback. Please try again in a moment.";
}

export default function FeedbackSheetForm({
  route = "/feedback",
  source = "feedback_form",
  reportContext,
  embedded = false,
}: FeedbackSheetFormProps) {
  const userId = useVocabularyUserId();
  const appLang = getLangClient();
  const isJa = appLang === "ja";

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
        setErrorMessage(errorMessageForCode(data.error, isJa));
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
      setErrorMessage(
        isJa
          ? "ネットワークエラーです。接続を確認してからもう一度お試しください。"
          : "Network error. Check your connection and try again.",
      );
      setState("error");
    }
  }

  if (state === "success") {
    const successBlock = (
      <>
        <h2 className="font-wa-serif text-lg font-bold text-emerald-100">
          {isJa ? "ありがとうございます" : "Thank you"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-emerald-50/90">
          {isJa
            ? "フィードバックを保存しました。すべてのコメントを読み、Frensei の改善に活かします。"
            : "Your feedback was saved. We read every comment to improve Frensei."}
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-xl border border-emerald-400/50 bg-emerald-500/20 px-5 py-2.5 text-sm font-medium text-emerald-100 hover:bg-emerald-500/30"
        >
          {isJa ? "もう一条送る" : "Send another comment"}
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
          <h2 className="font-wa-serif text-lg font-bold text-pink-200">
            {isJa ? "フィードバックを送る" : "Send feedback"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            {isJa
              ? "コメントはチームのスプレッドシートに直接届きます。メールや外部フォームは不要です。"
              : "Your comment goes straight to our team spreadsheet. No email or external form needed."}
          </p>
        </>
      ) : null}

      <form onSubmit={onSubmit} className={embedded ? "mt-4 space-y-3" : "mt-6 space-y-4"}>
        <label className="block">
          <span className="text-xs font-medium text-slate-400">
            {isJa ? "お名前・ニックネーム（任意）" : "Name or nickname (optional)"}
          </span>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={120}
            className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-pink-500/60 focus:outline-none focus:ring-1 focus:ring-pink-500/40"
            placeholder={isJa ? "任意" : "Optional"}
            autoComplete="nickname"
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-slate-400">
            {isJa ? "ご意見・ご感想" : "Your feedback"}{" "}
            <span className="text-pink-300">*</span>
          </span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={embedded ? 5 : 7}
            maxLength={4000}
            required
            className="mt-1.5 w-full resize-y rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-pink-500/60 focus:outline-none focus:ring-1 focus:ring-pink-500/40"
            placeholder={
              isJa
                ? "使い心地、わかりにくかった点、不具合、こうしてほしいこと…"
                : "What worked, what confused you, bugs, feature ideas…"
            }
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
          {state === "submitting"
            ? isJa
              ? "送信中…"
              : "Sending…"
            : isJa
              ? "フィードバックを送信"
              : "Submit feedback"}
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
