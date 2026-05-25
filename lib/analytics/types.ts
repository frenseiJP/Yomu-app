export const BETA_EVENT_TYPES = [
  "page_view",
  "chat_send",
  "mission_start",
  "topic_submit",
  "vocabulary_save",
  "feedback_submit",
  "tutorial_shown",
  "tutorial_started",
  "tutorial_step_completed",
  "tutorial_completed",
  "tutorial_skipped",
  "api_rate_limited",
  "api_payload_too_large",
  "api_error",
] as const;

export type BetaEventType = (typeof BETA_EVENT_TYPES)[number];

export type BetaEventInput = {
  eventType: BetaEventType;
  userId?: string;
  sessionId?: string;
  route?: string;
  metadata?: Record<string, unknown>;
};

export type BetaEventRow = {
  id: string;
  event_type: BetaEventType;
  user_id: string | null;
  session_id: string | null;
  route: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};
