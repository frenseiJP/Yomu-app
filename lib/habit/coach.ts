import { recordsStorage } from "@/src/features/records/storage";
import type { CoachContextPayload } from "@/lib/habit/types";
import { getOrCreateRetentionDailyMission } from "@/lib/mission/retentionDaily";
import { readMissionGrowth } from "@/lib/progress/missionGrowth";
import { getCoachFocusSummary } from "@/lib/coach/categoryMastery";
import { getUserStats } from "@/lib/habit/progress";
import { readHabitJson } from "@/lib/habit/storage";
import type { UserProgressV1 } from "@/lib/habit/types";
import { getRecentCorrectionsForCoach } from "@/lib/vocabulary/learnerStats";

const PROGRESS_KIND = "progress_v1";

const COACH_IDENTITY = `Sensei mode: warm professional teacher. Celebrate small wins. If the learner struggled recently, acknowledge gently and offer one concrete next step.`;

export type BuildCoachContextExtra = {
  region?: string;
  sessionSummary?: string;
  learningMode?: string;
};

/** Client: gather context for the next chat completion */
export function buildCoachContext(
  userId: string,
  sessionGoal?: string,
  jlptLevel?: string,
  extra?: BuildCoachContextExtra,
): CoachContextPayload {
  const mistakes = recordsStorage.mistakeLogs.getAllByUser(userId);
  const recentFromLogs = mistakes.slice(0, 3).map((m) => ({
    original: m.originalText,
    corrected: m.correctedText,
    explanation: m.explanation.slice(0, 200),
  }));
  const recent =
    recentFromLogs.length > 0 ? recentFromLogs : getRecentCorrectionsForCoach(userId, 3);

  const level = jlptLevel?.trim() || "N3";
  const stats = getUserStats(userId);
  const dayMission = getOrCreateRetentionDailyMission(userId, level);
  const mg = readMissionGrowth(userId);
  const lastMissionSummary = `Today's quick mission (${dayMission.date}): "${dayMission.mission.title}" — ${dayMission.mission.instruction} (EN cue: "${dayMission.mission.prompt_en}"). Status: ${dayMission.completed ? "completed" : "open"}. Mission completions (lifetime): ${mg.totalCompleted}; current mission-day streak: ${mg.currentStreak}.`;

  const prog = readHabitJson<UserProgressV1>(PROGRESS_KIND, userId, {
    activeDays: [],
    totalChatMessages: 0,
    missionsCompletedCount: 0,
    reviewsCompletedCount: 0,
    mistakesFixedCount: 0,
    learningDays: [],
  });
  const summaries = recordsStorage.sessionSummaries.getAllByUser(userId);
  const sessionSummary = extra?.sessionSummary?.trim() ?? "";
  const lastSummary =
    sessionSummary ||
    summaries[0]?.encouragement?.slice(0, 300) ||
    prog.lastSessionSummarySnippet ||
    "";

  const focus = getCoachFocusSummary(userId);
  const region = extra?.region?.trim() || undefined;
  const learningMode = extra?.learningMode?.trim() || undefined;

  return {
    recentMistakes: recent,
    streak: stats.streak,
    lastMissionSummary,
    lastSummary,
    coachToneNote: COACH_IDENTITY,
    sessionGoal: sessionGoal?.trim() || undefined,
    focusCategory: focus.label,
    focusCategoryHint: focus.hint,
    focusCategoryScore: focus.score,
    jlptLevel: level,
    region,
    learningMode,
  };
}

const CONVERSATION_AWARENESS = `
CRITICAL — CONVERSATION AWARENESS:
- Read the full message history before replying. The latest user message may be a follow-up, clarification, or continuation — interpret it in light of prior turns.
- Resolve pronouns and vague references ("that", "it", "the first one", "more", "why?", "again") from earlier messages in this thread.
- Do not repeat long explanations already given unless the user asks again or seems confused.
- Stay on the same topic/sub-thread unless the user clearly changes subject.
- If you corrected a sentence earlier, build on that correction when the user revises or asks a related question.
`.trim();

/** Server: append to system prompt (English block so model follows regardless of UI lang) */
export function formatCoachContextForSystem(ctx: CoachContextPayload | null | undefined): string {
  if (!ctx || typeof ctx !== "object") return "";
  const lines: string[] = [
    "",
    "=== LEARNER CONTEXT (use subtly; do not dump as a list to the user unless natural) ===",
    CONVERSATION_AWARENESS,
    ctx.coachToneNote,
    `Current streak (consecutive active days): ${ctx.streak}`,
    `Mission snapshot: ${ctx.lastMissionSummary}`,
  ];
  if (ctx.lastSummary) {
    lines.push(
      `Current conversation thread (stay consistent; reference prior topics naturally): ${ctx.lastSummary}`,
    );
  }
  if (ctx.sessionGoal) {
    lines.push(`Session goal selected by learner: ${ctx.sessionGoal}`);
  }
  if (ctx.jlptLevel) {
    lines.push(
      `Learner JLPT target: ${ctx.jlptLevel}. Match example difficulty to this level — simpler for N5–N4, richer nuance for N2–N1.`,
    );
  }
  if (ctx.region) {
    lines.push(
      `Learner region: ${ctx.region}. When culture, daily life, or regional nuance matters, tailor examples and context to what is familiar in this region — without stereotyping.`,
    );
  }
  if (ctx.learningMode) {
    lines.push(
      `Current learning mode: ${ctx.learningMode}. Stay aligned with this mode — do not drift into unrelated lesson topics.`,
    );
  }
  if (ctx.focusCategory) {
    lines.push(
      `Skill-path focus (from learner's real corrections, not a textbook): ${ctx.focusCategory}${typeof ctx.focusCategoryScore === "number" ? ` (~${ctx.focusCategoryScore}% practice progress)` : ""}.`,
    );
    if (ctx.focusCategoryHint) {
      lines.push(`Focus hint for Sensei: ${ctx.focusCategoryHint}`);
    }
    lines.push(
      "When correcting Japanese, gently prioritize this area in one short Why note—do not lecture or list grammar rules.",
    );
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
