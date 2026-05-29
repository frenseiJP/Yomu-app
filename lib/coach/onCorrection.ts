import { applyMasteryFromCorrection } from "@/lib/coach/categoryMastery";
import { getWeeklyCategoryGoalStatus } from "@/lib/habit/weeklyGoal";
import { logBetaEvent } from "@/lib/analytics/client";
import type { FtueCoachPayload } from "@/lib/ftue/types";

export function handleCoachCorrectionReceived(
  userId: string,
  payload: FtueCoachPayload,
  opts?: { sessionId?: string; route?: string },
): void {
  if (payload.replyMode !== "correction") return;
  applyMasteryFromCorrection(userId, {
    userSentence: payload.studentSentence,
    correctedSentence: payload.correctedSentence,
    note: payload.whyEnglish,
  });
  void logBetaEvent({
    eventType: "coach_correction_received",
    userId,
    sessionId: opts?.sessionId,
    route: opts?.route ?? "/chat",
  });
  const weekly = getWeeklyCategoryGoalStatus(userId);
  if (weekly?.met) {
    void logBetaEvent({
      eventType: "coach_weekly_goal_met",
      userId,
      sessionId: opts?.sessionId,
      route: opts?.route ?? "/",
      metadata: { category: weekly.label },
    });
  }
}
