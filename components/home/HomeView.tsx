"use client";

import Link from "next/link";
import DailyUsefulPhraseCard from "@/components/habit/DailyUsefulPhraseCard";
import SeasonalProgressCard from "@/components/progress/SeasonalProgressCard";
import type { DailyUsefulPhrase } from "@/lib/dailyPhrase/phrases";
import {
  homeCard,
  homeCardDark,
  homeCardLight,
  homeMissionGrid,
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
}: Props) {
  const reviewCount = dueReviews.words.length + dueReviews.mistakes.length;
  const labelClass = isLightTheme ? "text-neutral-500" : "text-slate-500";
  const titleClass = isLightTheme ? "text-neutral-900" : "text-slate-50";
  const bodyClass = isLightTheme ? "text-neutral-600" : "text-slate-300";
  const mutedClass = isLightTheme ? "text-neutral-500" : "text-slate-400";

  return (
    <div className={homeScrollArea}>
      <div className={homeStack}>
        <DailyUsefulPhraseCard
          phrase={dailyUsefulPhrase}
          isLightTheme={isLightTheme}
          onPractice={onPracticePhrase}
        />

        {retentionMissionDay ? (
          <div className={homeMissionGrid}>
            <section className={homeSectionClass(isLightTheme)}>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${labelClass}`}>
                Today&apos;s Mission
              </p>
              <p className={`mt-2 font-wa-serif text-base leading-snug sm:text-lg ${titleClass}`}>
                {retentionMissionDay.mission.title}
              </p>
              <p className={`mt-1 text-sm leading-relaxed ${bodyClass}`}>
                {retentionMissionDay.mission.prompt_en}
              </p>
              <button
                type="button"
                onClick={onStartMission}
                className="mt-3 inline-flex min-h-[44px] w-full touch-manipulation items-center justify-center rounded-xl bg-wa-ruri px-4 py-2.5 text-sm font-medium text-white hover:bg-wa-ruri/90 lg:min-h-[40px]"
              >
                Start
              </button>
            </section>

            <section className={homeSectionClass(isLightTheme)}>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${labelClass}`}>
                Continue Chat
              </p>
              {recentChatSummary ? (
                <button
                  type="button"
                  onClick={() => onOpenRecentChat(recentChatSummary.id)}
                  className={`mt-2 block w-full min-h-[44px] touch-manipulation rounded-xl border px-3 py-2.5 text-left transition ${
                    isLightTheme
                      ? "border-neutral-200 bg-neutral-50 hover:bg-neutral-100"
                      : "border-slate-700/80 bg-slate-900/70 hover:bg-slate-900"
                  }`}
                >
                  <p className={`line-clamp-1 text-sm font-medium ${titleClass}`}>{recentChatSummary.title}</p>
                  <p className={`mt-1 line-clamp-2 text-xs leading-relaxed ${mutedClass}`}>
                    {recentChatSummary.preview}
                  </p>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onStartNewChat}
                  className="mt-2 inline-flex min-h-[44px] w-full touch-manipulation items-center justify-center rounded-xl border border-wa-ruri/50 bg-wa-ruri/20 px-3.5 py-2 text-xs font-medium text-slate-100 hover:bg-wa-ruri/30 lg:min-h-[40px]"
                >
                  Start chatting
                </button>
              )}
            </section>
          </div>
        ) : null}

        <SeasonalProgressCard
          state={seasonalState}
          compact
          centered
          isLightTheme={isLightTheme}
          onOpenProgress={onOpenProgress}
        />

        {reviewCount > 0 ? (
          <section className={homeSectionClass(isLightTheme)}>
            <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${labelClass}`}>Review</p>
            <p className={`mt-2 text-sm ${isLightTheme ? "text-neutral-700" : "text-slate-200"}`}>
              You have {reviewCount} items to review.
            </p>
            <Link
              href="/vocabulary"
              className="mt-3 inline-flex min-h-[44px] w-full touch-manipulation items-center justify-center rounded-xl border border-wa-ruri/50 bg-wa-ruri/20 px-3.5 py-2 text-xs font-medium text-slate-100 hover:bg-wa-ruri/30 lg:min-h-[40px]"
            >
              Open review
            </Link>
          </section>
        ) : null}
      </div>
    </div>
  );
}
