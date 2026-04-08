import { recordsStorage } from "@/src/features/records/storage";
import type { CoachContextPayload, HabitDailyMission } from "@/lib/habit/types";
import { getOrCreateDailyMission } from "@/lib/habit/mission";
import { getUserStats } from "@/lib/habit/progress";
import { readHabitJson } from "@/lib/habit/storage";
import type { UserProgressV1 } from "@/lib/habit/types";

const PROGRESS_KIND = "progress_v1";

const COACH_IDENTITY = `You are a calm, supportive Japanese coach. Be encouraging without being loud. Celebrate small wins. If the learner struggled recently, acknowledge it gently and offer one concrete next step.`;

/** Client: gather context for the next chat completion */
export function buildCoachContext(userId: string): CoachContextPayload {
  const mistakes = recordsStorage.mistakeLogs.getAllByUser(userId);
  const recent = mistakes.slice(0, 3).map((m) => ({
    original: m.originalText,
    corrected: m.correctedText,
    explanation: m.explanation.slice(0, 200),
  }));

  const stats = getUserStats(userId);
  const mission = getOrCreateDailyMission(userId);
  const incomplete = mission.tasks.filter((t) => !t.completed).length;
  const lastMissionSummary = `Today's mission (${mission.date}): ${mission.tasks.length - incomplete}/${mission.tasks.length} tasks done. Tasks: ${mission.tasks.map((t) => t.instruction).join(" | ")}`;

  const prog = readHabitJson<UserProgressV1>(PROGRESS_KIND, userId, {
    activeDays: [],
    totalChatMessages: 0,
    missionsCompletedCount: 0,
    reviewsCompletedCount: 0,
    mistakesFixedCount: 0,
    learningDays: [],
  });
  const summaries = recordsStorage.sessionSummaries.getAllByUser(userId);
  const lastSummary =
    summaries[0]?.encouragement?.slice(0, 300) ??
    prog.lastSessionSummarySnippet ??
    "";

  return {
    recentMistakes: recent,
    streak: stats.streak,
    lastMissionSummary,
    lastSummary,
    coachToneNote: COACH_IDENTITY,
  };
}

/** Server: append to system prompt (English block so model follows regardless of UI lang) */
export function formatCoachContextForSystem(ctx: CoachContextPayload | null | undefined): string {
  if (!ctx || typeof ctx !== "object") return "";
  const lines: string[] = [
    "",
    "=== LEARNER CONTEXT (use subtly; do not dump as a list to the user unless natural) ===",
    ctx.coachToneNote,
    `Current streak (consecutive active days): ${ctx.streak}`,
    `Mission snapshot: ${ctx.lastMissionSummary}`,
  ];
  if (ctx.lastSummary) {
    lines.push(`Last session encouragement (if any): ${ctx.lastSummary}`);
  }
  if (ctx.recentMistakes.length) {
    lines.push("Recent areas to gently reinforce:");
    ctx.recentMistakes.forEach((m, i) => {
      lines.push(
        `${i + 1}. Was: "${m.original}" → Better: "${m.corrected}" (${m.explanation})`,
      );
    });
  }
  lines.push(
    "If relevant, you may reference streak or mission progress in one short warm sentence—never shame, never overwhelm.",
  );
  return lines.join("\n");
}

export function missionToCoachSummary(mission: HabitDailyMission): string {
  const incomplete = mission.tasks.filter((t) => !t.completed).length;
  return `${mission.tasks.length - incomplete}/${mission.tasks.length} tasks done today`;
}
