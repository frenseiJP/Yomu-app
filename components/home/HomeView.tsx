"use client";

import Link from "next/link";
import type { HomeCopy } from "@/lib/i18n/homeCopy";
import type { ProgressCopy } from "@/lib/i18n/progressCopy";
import { localizeRetentionMission } from "@/lib/i18n/missionCopy";
import type { Lang } from "@/src/utils/i18n/types";
import type { CoachNote } from "@/lib/coach/notes";
import type { RecentWin } from "@/lib/coach/recentWins";
import { MessageCircle, BookOpen, Target, Compass, Sparkles } from "lucide-react";
import type { TopicPrompt } from "@/lib/topic/types";
import DailyUsefulPhraseCard from "@/components/habit/DailyUsefulPhraseCard";
import SeasonalProgressCard from "@/components/progress/SeasonalProgressCard";
import CollapsibleSection from "@/components/ui/CollapsibleSection";
import CoachNotesCard from "@/components/coach/CoachNotesCard";
import RecentWinsCard from "@/components/coach/RecentWinsCard";
import type { DailyUsefulPhrase } from "@/lib/dailyPhrase/phrases";
import {
  homeCard,
  homeCardDark,
  homeCardLight,
  homeScrollArea,
  homeStack,
} from "@/lib/layout/pageShell";
import type { DueReviews } from "@/lib/habit";
import type { RetentionDailyMissionDay } from "@/lib/mission/retentionDaily";
import type { SeasonalProgressState } from "@/lib/progress/seasonal";

type RecentChat = {
  id: string;
  title: string;
  preview: string;
};

type Props = {
  copy: HomeCopy;
  lang: Lang;
  progressCopy: ProgressCopy;
  dailyUsefulPhrase: DailyUsefulPhrase;
  retentionMissionDay: RetentionDailyMissionDay | null;
  recentChatSummary: RecentChat | null;
  seasonalState: SeasonalProgressState;
  dueReviews: DueReviews;
  isLightTheme: boolean;
  coachNotes: CoachNote[];
  recentWins: RecentWin[];
  dailyReflection?: string | null;
  onPracticePhrase: () => void;
  onStartMission: () => void;
  onOpenRecentChat: (sessionId: string) => void;
  onStartNewChat: () => void;
  onStartReflection?: () => void;
  onOpenProgress: () => void;
  coachFocus?: {
    label: string;
    hint: string;
    score: number;
  } | null;
  onPracticeFocus?: () => void;
  onOpenReview?: () => void;
  todaysScenario?: TopicPrompt | null;
  onPracticeScenario?: () => void;
  onCtaClick?: (cta: string) => void;
};

function homeSectionClass(isLightTheme: boolean) {
  return `${homeCard} ${isLightTheme ? homeCardLight : homeCardDark}`;
}

export default function HomeView({
  copy,
  lang,
  progressCopy,
  dailyUsefulPhrase,
  retentionMissionDay,
  recentChatSummary,
  seasonalState,
  dueReviews,
  isLightTheme,
  coachNotes,
  recentWins,
  dailyReflection,
  onPracticePhrase,
  onStartMission,
  onOpenRecentChat,
  onStartNewChat,
  onStartReflection,
  onOpenProgress,
  coachFocus,
  onPracticeFocus,
  onOpenReview,
  todaysScenario,
  onPracticeScenario,
  onCtaClick,
}: Props) {
  const reviewCount = dueReviews.words.length + dueReviews.mistakes.length;
  const missionDisplay = retentionMissionDay
    ? localizeRetentionMission(retentionMissionDay.mission, lang)
    : null;
  const labelClass = isLightTheme ? "text-neutral-500" : "text-slate-500";
  const titleClass = isLightTheme ? "text-neutral-900" : "text-slate-50";
  const bodyClass = isLightTheme ? "text-neutral-600" : "text-slate-300";
  const mutedClass = isLightTheme ? "text-neutral-500" : "text-slate-400";

  const primaryChat = () => {
    if (recentChatSummary) {
      onCtaClick?.("continue_chat");
      onOpenRecentChat(recentChatSummary.id);
    } else {
      onCtaClick?.("start_chat");
      onStartNewChat();
    }
  };

  return (
    <div className={homeScrollArea}>
      <div className={homeStack}>
        <section
          className={`w-full rounded-2xl border p-5 shadow-glass sm:p-6 ${
            isLightTheme
              ? "border-wa-ruri/25 bg-gradient-to-br from-white to-sky-50/50"
              : "border-wa-ruri/35 bg-gradient-to-br from-slate-950/95 to-wa-ruri/10"
          }`}
        >
          <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${labelClass}`}>
            {copy.nextStepLabel}
          </p>
          <h2 className={`mt-2 font-wa-serif text-xl leading-snug sm:text-2xl ${titleClass}`}>
            {copy.nextStepTitle}
          </h2>
          <p className={`mt-2 text-sm leading-relaxed ${bodyClass}`}>{copy.nextStepBody}</p>
          <button
            type="button"
            onClick={primaryChat}
            className="btn-wa-hover btn-wa-hover-ruri mt-4 inline-flex min-h-[48px] w-full touch-manipulation items-center justify-center gap-2 rounded-xl bg-wa-ruri px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(56,189,248,0.2)] hover:bg-wa-asagi"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            {recentChatSummary ? copy.continueChat : copy.startChatting}
          </button>
        </section>

        {dailyReflection && onStartReflection ? (
          <section className={homeSectionClass(isLightTheme)}>
            <div className="flex items-start gap-2">
              <Sparkles className={`mt-0.5 h-4 w-4 shrink-0 ${isLightTheme ? "text-wa-ruri" : "text-violet-300"}`} />
              <div className="min-w-0 flex-1">
                <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${labelClass}`}>
                  {copy.dailyReflection}
                </p>
                <p className={`mt-1 text-sm leading-relaxed ${bodyClass}`}>{dailyReflection}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onCtaClick?.("daily_reflection");
                onStartReflection();
              }}
              className="mt-3 inline-flex min-h-[40px] w-full items-center justify-center rounded-lg border border-violet-500/35 bg-violet-500/10 px-3 text-[12px] font-medium text-violet-100 hover:bg-violet-500/15"
            >
              {copy.startReflection}
            </button>
          </section>
        ) : null}

        <CoachNotesCard title={copy.coachNotes} notes={coachNotes} isLightTheme={isLightTheme} />
        <RecentWinsCard title={copy.recentWins} wins={recentWins} isLightTheme={isLightTheme} />

        {reviewCount > 0 ? (
          <button
            type="button"
            onClick={() => {
              onCtaClick?.("open_review");
              onOpenReview?.();
            }}
            className={`flex w-full min-h-[48px] touch-manipulation items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition ${
              isLightTheme
                ? "border-amber-200 bg-amber-50/80 hover:bg-amber-50"
                : "border-amber-500/35 bg-amber-500/10 hover:bg-amber-500/15"
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen className={`h-5 w-5 shrink-0 ${isLightTheme ? "text-amber-700" : "text-amber-300"}`} />
              <div>
                <p className={`text-sm font-medium ${isLightTheme ? "text-amber-950" : "text-amber-100"}`}>
                  {copy.reviewsWaiting(reviewCount)}
                </p>
                <p className={`text-[12px] ${isLightTheme ? "text-amber-800/80" : "text-amber-200/70"}`}>
                  {copy.reviewsDesc}
                </p>
              </div>
            </div>
            <span className={`text-[12px] font-medium ${isLightTheme ? "text-amber-800" : "text-amber-200"}`}>
              {copy.openArrow}
            </span>
          </button>
        ) : null}

        {todaysScenario && onPracticeScenario ? (
          <section className={homeSectionClass(isLightTheme)}>
            <div className="flex items-start gap-2">
              <Compass className={`mt-0.5 h-4 w-4 shrink-0 ${isLightTheme ? "text-wa-ruri" : "text-sky-300"}`} />
              <div className="min-w-0 flex-1">
                <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${labelClass}`}>
                  {copy.todaysScenario}
                </p>
                <p className={`mt-1 text-sm font-medium ${titleClass}`}>{todaysScenario.title}</p>
                <p className={`mt-1 line-clamp-2 text-[12px] leading-relaxed ${bodyClass}`}>
                  {todaysScenario.dailyQuestion ?? todaysScenario.prompt}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onCtaClick?.("scenario");
                onPracticeScenario();
              }}
              className="mt-3 inline-flex min-h-[40px] w-full items-center justify-center rounded-lg border border-wa-ruri/40 bg-wa-ruri/15 px-3 text-[12px] font-medium text-sky-700 hover:bg-wa-ruri/25 dark:text-sky-100"
            >
              {copy.practiceInChat}
            </button>
          </section>
        ) : null}

        <section className={homeSectionClass(isLightTheme)}>
          <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${labelClass}`}>{copy.today}</p>

          {retentionMissionDay ? (
            <div
              className={`mt-3 rounded-xl border p-3 ${isLightTheme ? "border-neutral-200 bg-neutral-50" : "border-slate-700/60 bg-slate-900/50"}`}
            >
              <div className="flex items-start gap-2">
                <Target className={`mt-0.5 h-4 w-4 shrink-0 ${isLightTheme ? "text-wa-ruri" : "text-sky-300"}`} />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${titleClass}`}>{missionDisplay?.title}</p>
                  <p className={`mt-1 line-clamp-2 text-[12px] leading-relaxed ${bodyClass}`}>
                    {missionDisplay?.instruction ?? retentionMissionDay.mission.prompt_en}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onCtaClick?.("start_mission");
                  onStartMission();
                }}
                className="mt-3 inline-flex min-h-[40px] w-full items-center justify-center rounded-lg bg-wa-ruri/90 px-3 text-[12px] font-medium text-white hover:bg-wa-ruri"
              >
                {copy.startMission}
              </button>
            </div>
          ) : null}

          {coachFocus && onPracticeFocus ? (
            <div
              className={`${retentionMissionDay ? "mt-3" : "mt-3"} rounded-xl border p-3 ${
                isLightTheme ? "border-sky-200/80 bg-sky-50/50" : "border-sky-500/25 bg-sky-500/8"
              }`}
            >
              <p className={`text-[12px] font-medium ${titleClass}`}>
                {copy.focusPrefix} {coachFocus.label}{" "}
                <span className={mutedClass}>{coachFocus.score}%</span>
              </p>
              <p className={`mt-1 text-[12px] leading-relaxed ${bodyClass}`}>{coachFocus.hint}</p>
              <button
                type="button"
                onClick={() => {
                  onCtaClick?.("practice_focus");
                  onPracticeFocus();
                }}
                className="mt-2 text-[12px] font-medium text-sky-600 hover:text-sky-500 dark:text-sky-300 dark:hover:text-sky-200"
              >
                {copy.practiceFocus}
              </button>
            </div>
          ) : null}

          {!retentionMissionDay && !coachFocus ? (
            <p className={`mt-2 text-sm ${bodyClass}`}>{copy.openChatHint}</p>
          ) : null}
        </section>

        <SeasonalProgressCard
          state={seasonalState}
          compact
          centered
          isLightTheme={isLightTheme}
          onOpenProgress={() => {
            onCtaClick?.("open_progress");
            onOpenProgress();
          }}
        />

        <CollapsibleSection
          title={progressCopy.usefulPhraseTitle}
          subtitle={progressCopy.usefulPhraseSubtitle(dailyUsefulPhrase.phrase)}
          defaultOpen={false}
          tone="muted"
        >
          <DailyUsefulPhraseCard
            phrase={dailyUsefulPhrase}
            isLightTheme={isLightTheme}
            onPractice={() => {
              onCtaClick?.("practice_phrase");
              onPracticePhrase();
            }}
            compact
          />
        </CollapsibleSection>

        <div className="flex justify-center pb-2">
          <Link
            href="/pricing"
            className={`text-[12px] font-medium underline-offset-2 hover:underline ${isLightTheme ? "text-neutral-500 hover:text-neutral-800" : "text-slate-500 hover:text-slate-300"}`}
          >
            {copy.viewPlans}
          </Link>
        </div>
      </div>
    </div>
  );
}
