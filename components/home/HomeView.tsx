"use client";

import { MessageCircle, BookOpen, Target, Compass } from "lucide-react";
import type { TopicPrompt } from "@/lib/topic/types";
import DailyUsefulPhraseCard from "@/components/habit/DailyUsefulPhraseCard";
import SeasonalProgressCard from "@/components/progress/SeasonalProgressCard";
import CollapsibleSection from "@/components/ui/CollapsibleSection";
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
  dailyUsefulPhrase: DailyUsefulPhrase;
  retentionMissionDay: RetentionDailyMissionDay | null;
  recentChatSummary: RecentChat | null;
  seasonalState: SeasonalProgressState;
  dueReviews: DueReviews;
  isLightTheme: boolean;
  onPracticePhrase: () => void;
  onStartMission: () => void;
  onOpenRecentChat: (sessionId: string) => void;
  onStartNewChat: () => void;
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
  /** Analytics: fired before the matching action runs. */
  onCtaClick?: (cta: string) => void;
};

function homeSectionClass(isLightTheme: boolean) {
  return `${homeCard} ${isLightTheme ? homeCardLight : homeCardDark}`;
}

export default function HomeView({
  dailyUsefulPhrase,
  retentionMissionDay,
  recentChatSummary,
  seasonalState,
  dueReviews,
  isLightTheme,
  onPracticePhrase,
  onStartMission,
  onOpenRecentChat,
  onStartNewChat,
  onOpenProgress,
  coachFocus,
  onPracticeFocus,
  onOpenReview,
  todaysScenario,
  onPracticeScenario,
  onCtaClick,
}: Props) {
  const reviewCount = dueReviews.words.length + dueReviews.mistakes.length;
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
        {/* Primary path — one obvious next step */}
        <section
          className={`w-full rounded-2xl border p-5 shadow-glass sm:p-6 ${
            isLightTheme
              ? "border-wa-ruri/25 bg-gradient-to-br from-white to-sky-50/50"
              : "border-wa-ruri/35 bg-gradient-to-br from-slate-950/95 to-wa-ruri/10"
          }`}
        >
          <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${labelClass}`}>
            Your next step
          </p>
          <h2 className={`mt-2 font-wa-serif text-xl leading-snug sm:text-2xl ${titleClass}`}>
            Write with Sensei
          </h2>
          <p className={`mt-2 text-sm leading-relaxed ${bodyClass}`}>
            Type in Japanese or English — get a natural correction and a short why.
          </p>
          <button
            type="button"
            onClick={primaryChat}
            className="btn-wa-hover btn-wa-hover-ruri mt-4 inline-flex min-h-[48px] w-full touch-manipulation items-center justify-center gap-2 rounded-xl bg-wa-ruri px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(56,189,248,0.2)] hover:bg-wa-asagi"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            {recentChatSummary ? "Continue chat" : "Start chatting"}
          </button>
        </section>

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
                  {reviewCount} review{reviewCount === 1 ? "" : "s"} waiting
                </p>
                <p className={`text-[12px] ${isLightTheme ? "text-amber-800/80" : "text-amber-200/70"}`}>
                  Quick cloze from your saved corrections
                </p>
              </div>
            </div>
            <span className={`text-[12px] font-medium ${isLightTheme ? "text-amber-800" : "text-amber-200"}`}>
              Open →
            </span>
          </button>
        ) : null}

        {todaysScenario && onPracticeScenario ? (
          <section className={homeSectionClass(isLightTheme)}>
            <div className="flex items-start gap-2">
              <Compass className={`mt-0.5 h-4 w-4 shrink-0 ${isLightTheme ? "text-wa-ruri" : "text-sky-300"}`} />
              <div className="min-w-0 flex-1">
                <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${labelClass}`}>
                  Today&apos;s scenario
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
              Practice in Chat
            </button>
          </section>
        ) : null}

        {/* Today — mission + focus in one card */}
        <section className={homeSectionClass(isLightTheme)}>
          <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${labelClass}`}>Today</p>

          {retentionMissionDay ? (
            <div className={`mt-3 rounded-xl border p-3 ${isLightTheme ? "border-neutral-200 bg-neutral-50" : "border-slate-700/60 bg-slate-900/50"}`}>
              <div className="flex items-start gap-2">
                <Target className={`mt-0.5 h-4 w-4 shrink-0 ${isLightTheme ? "text-wa-ruri" : "text-sky-300"}`} />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${titleClass}`}>{retentionMissionDay.mission.title}</p>
                  <p className={`mt-1 line-clamp-2 text-[12px] leading-relaxed ${bodyClass}`}>
                    {retentionMissionDay.mission.prompt_en}
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
                Start mission
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
                Focus: {coachFocus.label}{" "}
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
                Practice with Sensei →
              </button>
            </div>
          ) : null}

          {!retentionMissionDay && !coachFocus ? (
            <p className={`mt-2 text-sm ${bodyClass}`}>Open chat to start today&apos;s practice.</p>
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
          title="Today's useful phrase"
          subtitle={`${dailyUsefulPhrase.phrase} · tap to expand`}
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
      </div>
    </div>
  );
}
