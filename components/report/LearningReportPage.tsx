"use client";

import { useMemo } from "react";
import Link from "next/link";
import { getLangClient } from "@/src/utils/i18n/clientLang";
import { ArrowLeft, FileText, MessageCircle, Printer } from "lucide-react";
import { activeDaysToWeekDots, getProgressSnapshot, getUserStats } from "@/lib/habit/progress";
import { buildSeasonalProgressState } from "@/lib/progress/seasonal";
import { listTopicPracticeResultsByUser } from "@/lib/topic/service";
import { listVocabularyByUser } from "@/lib/vocabulary/storage";
import { useVocabularyUserId } from "@/lib/vocabulary/useVocabularyUserId";

function formatReportDate(): string {
  try {
    return new Date().toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

export default function LearningReportPage() {
  const userId = useVocabularyUserId();

  const snapshot = useMemo(() => getProgressSnapshot(userId), [userId]);
  const stats = useMemo(() => getUserStats(userId), [userId]);
  const weekDots = useMemo(() => activeDaysToWeekDots(snapshot.activeDays), [snapshot.activeDays]);
  const vocabSaved = useMemo(() => listVocabularyByUser(userId).length, [userId]);
  const recentTopics = useMemo(() => listTopicPracticeResultsByUser(userId).slice(0, 8), [userId]);

  const appLang = getLangClient();
  const seasonal = useMemo(
    () =>
      buildSeasonalProgressState({
        streak: stats.streak,
        activityCount: weekDots.filter(Boolean).length,
        missionDoneCount: snapshot.missionsCompletedCount,
        reviewDoneCount: snapshot.reviewsCompletedCount,
        chatCount: snapshot.totalChatMessages,
        topicCount: stats.totalTopicPractices,
        uiLang: appLang === "ja" || appLang === "ko" || appLang === "zh" ? appLang : "en",
      }),
    [appLang, snapshot, stats, weekDots],
  );

  const card = "rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 sm:p-5";

  return (
    <div className="mx-auto min-h-[100dvh] max-w-2xl px-4 py-6 pb-24 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 px-3 py-2 text-sm text-slate-300 hover:bg-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl border border-wa-ruri/50 bg-wa-ruri/15 px-3 py-2 text-sm text-slate-100 hover:bg-wa-ruri/25"
        >
          <Printer className="h-4 w-4" />
          Print / Save PDF
        </button>
      </div>

      <header className="mb-8 border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-2 text-wa-ruri">
          <FileText className="h-6 w-6" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em]">Learning report</span>
        </div>
        <h1 className="mt-3 font-wa-serif text-2xl font-semibold text-slate-50 sm:text-3xl">Your Frensei snapshot</h1>
        <p className="mt-2 text-sm text-slate-400">Generated {formatReportDate()}</p>
        <p className="mt-4 rounded-xl border border-slate-800/60 bg-slate-900/50 px-4 py-3 text-sm leading-relaxed text-slate-300">
          <span className="font-medium text-slate-200">{seasonal.momentLine}</span>
          <span className="text-slate-500"> · </span>
          {seasonal.storyLine}
        </p>
      </header>

      <section
        className={`${card} mb-5 border-pink-500/35 bg-gradient-to-br from-pink-950/40 to-slate-950/80 print:hidden`}
      >
        <div className="flex items-center gap-2 text-pink-300">
          <MessageCircle className="h-5 w-5 shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-[0.16em]">Beta</span>
        </div>
        {appLang === "ja" ? (
          <>
            <h2 className="mt-2 font-wa-serif text-lg text-slate-50">ご意見・ご感想をお聞かせください</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              ベータ版の使い心地や不具合、こうしてほしいことなど、専用ページからお送りいただけます。レポートを見ながら気づいたことも、ぜひ書いてください。
            </p>
          </>
        ) : (
          <>
            <h2 className="mt-2 font-wa-serif text-lg text-slate-50">Share your feedback</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Tell us what works, what breaks, and what you wish Frensei did next. Open the commentary page — same place as “bugs & impressions” in the app.
            </p>
          </>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/feedback"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_36px_rgba(236,72,153,0.35)] transition hover:bg-pink-400"
          >
            {appLang === "ja" ? "ご意見ページを開く" : "Open feedback page"}
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-600 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-900"
          >
            {appLang === "ja" ? "アプリに戻る" : "Back to app"}
          </Link>
        </div>
      </section>

      <section className={`${card} mb-5`}>
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">This week</h2>
        <div className="mt-3 flex gap-1.5" aria-label="Active days this week">
          {weekDots.map((on, i) => (
            <span
              key={i}
              className={`h-3 w-3 rounded-full ${on ? "bg-wa-ruri shadow-[0_0_8px_rgba(56,189,248,0.35)]" : "bg-slate-800"}`}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">Sun → Sat · lit days had chat, mission, or review activity</p>
      </section>

      <section className={`${card} mb-5`}>
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Totals</h2>
        <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-900/60 px-3 py-2.5">
            <dt className="text-[11px] text-slate-500">Current streak</dt>
            <dd className="mt-0.5 text-lg font-medium text-slate-100">{stats.streak} days</dd>
          </div>
          <div className="rounded-xl bg-slate-900/60 px-3 py-2.5">
            <dt className="text-[11px] text-slate-500">Chat messages (all time)</dt>
            <dd className="mt-0.5 text-lg font-medium text-slate-100">{snapshot.totalChatMessages}</dd>
          </div>
          <div className="rounded-xl bg-slate-900/60 px-3 py-2.5">
            <dt className="text-[11px] text-slate-500">Missions completed</dt>
            <dd className="mt-0.5 text-lg font-medium text-slate-100">{snapshot.missionsCompletedCount}</dd>
          </div>
          <div className="rounded-xl bg-slate-900/60 px-3 py-2.5">
            <dt className="text-[11px] text-slate-500">Reviews completed</dt>
            <dd className="mt-0.5 text-lg font-medium text-slate-100">{snapshot.reviewsCompletedCount}</dd>
          </div>
          <div className="rounded-xl bg-slate-900/60 px-3 py-2.5">
            <dt className="text-[11px] text-slate-500">Topic practices</dt>
            <dd className="mt-0.5 text-lg font-medium text-slate-100">{stats.totalTopicPractices}</dd>
          </div>
          <div className="rounded-xl bg-slate-900/60 px-3 py-2.5">
            <dt className="text-[11px] text-slate-500">Vocabulary saved (library)</dt>
            <dd className="mt-0.5 text-lg font-medium text-slate-100">{vocabSaved}</dd>
          </div>
          <div className="rounded-xl bg-slate-900/60 px-3 py-2.5 sm:col-span-2">
            <dt className="text-[11px] text-slate-500">Learning days recorded</dt>
            <dd className="mt-0.5 text-lg font-medium text-slate-100">{snapshot.learningDays.length}</dd>
          </div>
        </dl>
      </section>

      <section className={`${card} mb-5`}>
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Recent topic practice</h2>
        {recentTopics.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No topic sessions yet. Try the Topic tab in the app.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {recentTopics.map((r) => (
              <li key={r.id} className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2 text-sm">
                <p className="text-slate-200">{r.userAnswer}</p>
                <p className="mt-1 text-xs text-emerald-300/90">{r.correctedAnswer}</p>
                <p className="mt-1 text-[10px] text-slate-500">{r.createdAt.slice(0, 10)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-center text-[11px] text-slate-600 print:hidden">
        Data is stored on this device (local). Sign in on the same account on other devices to align IDs.
      </p>
    </div>
  );
}
