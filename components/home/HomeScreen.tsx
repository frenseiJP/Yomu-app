"use client";

import type { HabitDailyMission, DueReviews, UserStats } from "@/lib/habit";
import type { PrototypeUiText } from "@/src/utils/i18n/prototypeCopy";
import DailyMissionCard from "@/components/habit/DailyMissionCard";
import ReviewCard from "@/components/habit/ReviewCard";
import ProgressCard from "@/components/habit/ProgressCard";

type Props = {
  userId: string;
  mission: HabitDailyMission;
  dueReviews: DueReviews;
  stats: UserStats;
  ui: PrototypeUiText;
  isLightTheme: boolean;
  allComplete: boolean;
  onToggleTask: (taskId: string) => void;
  onOpenChat: (prefill?: string) => void;
  onReviewsUpdated: () => void;
};

export default function HomeScreen({
  userId,
  mission,
  dueReviews,
  stats,
  ui,
  isLightTheme,
  allComplete,
  onToggleTask,
  onOpenChat,
  onReviewsUpdated,
}: Props) {
  return (
    <div className="space-y-3">
      <DailyMissionCard
        mission={mission}
        ui={ui}
        isLightTheme={isLightTheme}
        allComplete={allComplete}
        onToggleTask={onToggleTask}
        onOpenChat={() => onOpenChat()}
      />
      <ReviewCard
        userId={userId}
        words={dueReviews.words}
        mistakes={dueReviews.mistakes}
        ui={ui}
        isLightTheme={isLightTheme}
        onUpdated={onReviewsUpdated}
        onOpenChat={onOpenChat}
      />
      <ProgressCard stats={stats} ui={ui} isLightTheme={isLightTheme} />
      <button
        type="button"
        onClick={() => onOpenChat()}
        className="w-full rounded-xl bg-wa-ruri px-4 py-3 text-sm font-medium text-white"
      >
        Start new conversation
      </button>
    </div>
  );
}
