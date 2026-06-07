import { postFeedbackToGoogleSheets } from "@/lib/feedback/googleSheets";
import type { BetaEventInput } from "@/lib/analytics/types";

/** Mirror analytics to Google Sheets when Supabase service role is unavailable. */
export async function mirrorAnalyticsToSheets(input: BetaEventInput): Promise<void> {
  const line = JSON.stringify({
    eventType: input.eventType,
    sessionId: input.sessionId ?? null,
    metadata: input.metadata ?? null,
  });
  await postFeedbackToGoogleSheets({
    source: "analytics_event",
    userId: input.userId ?? "anonymous",
    body: line.slice(0, 4000),
    createdAt: new Date().toISOString(),
    route: input.route ?? "",
  });
}
