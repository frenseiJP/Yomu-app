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
  "coach_correction_received",
  "coach_cloze_complete",
  "coach_speaking_check",
  "coach_content_import",
  "coach_weekly_goal_met",
  "shell_view",
  "home_cta_click",
  "scenario_started",
  "save_prompt_shown",
  "save_clicked",
  "landing_view",
  "guest_chat_start",
  "guest_chat_turn",
  "guest_chat_limit",
  "signup_cta_click",
  "share_copy",
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
