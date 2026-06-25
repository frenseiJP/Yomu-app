import {
  getBetaFeedbackEntries,
  getBetaFeedbackPromptState,
  saveBetaFeedbackEntries,
  setBetaFeedbackPromptState,
} from "@/lib/feedback/storage";
import { logBetaEvent } from "@/lib/analytics/client";
import type { BetaFeedback, BetaFeedbackSource } from "@/lib/feedback/types";

const SHOW_COOLDOWN_MS = 12 * 60 * 60 * 1000;
const MAX_SUBMISSIONS = 12;

/** Show feedback prompt every N user messages in chat (6, 12, 18, …). */
export const BETA_FEEDBACK_USER_MESSAGE_INTERVAL = 6;

function nowIso(): string {
  return new Date().toISOString();
}

function isWithinCooldown(lastShownAt: string | null, nowMs: number): boolean {
  if (!lastShownAt) return false;
  const at = Date.parse(lastShownAt);
  if (!Number.isFinite(at)) return false;
  return nowMs - at < SHOW_COOLDOWN_MS;
}

function generateFeedbackId(): string {
  return `fb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function shouldShowBetaFeedbackPrompt(
  userId: string,
  opts: { userMessageCount: number; nowMs?: number },
): boolean {
  if (!userId) return false;
  const count = opts.userMessageCount;
  if (count < BETA_FEEDBACK_USER_MESSAGE_INTERVAL) return false;
  if (count % BETA_FEEDBACK_USER_MESSAGE_INTERVAL !== 0) return false;

  const state = getBetaFeedbackPromptState(userId);
  if (state.submittedCount >= MAX_SUBMISSIONS) return false;
  return !isWithinCooldown(state.lastShownAt, opts.nowMs ?? Date.now());
}

export function markBetaFeedbackPromptShown(userId: string): void {
  if (!userId) return;
  const state = getBetaFeedbackPromptState(userId);
  setBetaFeedbackPromptState(userId, {
    ...state,
    lastShownAt: nowIso(),
  });
}

export async function submitBetaFeedback(input: {
  userId: string;
  source: BetaFeedbackSource;
  helpful: boolean | null;
  message?: string | null;
  sessionId?: string;
  appVersion?: string;
  route?: string;
}): Promise<BetaFeedback | null> {
  const { userId, source, helpful, sessionId, appVersion, route = "/app" } = input;
  if (!userId) return null;

  const message = typeof input.message === "string" ? input.message.trim().slice(0, 500) : "";
  const createdAt = nowIso();

  const entries = getBetaFeedbackEntries(userId);
  const latest = entries[0];
  if (
    latest &&
    latest.source === source &&
    latest.helpful === helpful &&
    (latest.message ?? "") === (message || "") &&
    latest.sessionId === sessionId
  ) {
    const latestMs = Date.parse(latest.createdAt);
    if (Number.isFinite(latestMs) && Date.now() - latestMs < 60 * 1000) {
      return null;
    }
  }

  const entry: BetaFeedback = {
    id: generateFeedbackId(),
    userId,
    source,
    helpful,
    message: message || null,
    sessionId,
    createdAt,
    appVersion,
  };

  saveBetaFeedbackEntries(userId, [entry, ...entries]);

  void fetch("/api/feedback/beta-prompt", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      userId,
      source,
      helpful,
      message: message || undefined,
      sessionId,
      appVersion,
      route,
      createdAt,
    }),
  }).catch(() => {
    /* local copy retained; server sync is best-effort */
  });

  void logBetaEvent({
    eventType: "feedback_submit",
    userId,
    sessionId,
    route,
    metadata: {
      source,
      channel: "beta_prompt",
      helpful: helpful === null ? "null" : String(helpful),
      hasMessage: Boolean(message),
    },
  });

  const state = getBetaFeedbackPromptState(userId);
  setBetaFeedbackPromptState(userId, {
    ...state,
    lastShownAt: createdAt,
    submittedCount: state.submittedCount + 1,
  });

  return entry;
}

export function skipBetaFeedbackPrompt(userId: string): void {
  if (!userId) return;
  const state = getBetaFeedbackPromptState(userId);
  setBetaFeedbackPromptState(userId, {
    ...state,
    lastShownAt: nowIso(),
    dismissedCount: state.dismissedCount + 1,
  });
}
