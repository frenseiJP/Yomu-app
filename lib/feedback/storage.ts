import type { BetaFeedback, BetaFeedbackPromptState } from "@/lib/feedback/types";

const FEEDBACK_KEY_PREFIX = "frensei:beta-feedback:v1:";
const FEEDBACK_STATE_KEY_PREFIX = "frensei:beta-feedback-state:v1:";

const DEFAULT_STATE: BetaFeedbackPromptState = {
  lastShownAt: null,
  submittedCount: 0,
  dismissedCount: 0,
};

function feedbackKey(userId: string): string {
  return `${FEEDBACK_KEY_PREFIX}${userId}`;
}

function feedbackStateKey(userId: string): string {
  return `${FEEDBACK_STATE_KEY_PREFIX}${userId}`;
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function isValidFeedback(x: unknown): x is BetaFeedback {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.userId === "string" &&
    typeof o.source === "string" &&
    (typeof o.helpful === "boolean" || o.helpful === null) &&
    (typeof o.message === "string" || o.message === null) &&
    typeof o.createdAt === "string"
  );
}

export function getBetaFeedbackEntries(userId: string): BetaFeedback[] {
  if (typeof window === "undefined" || !userId) return [];
  const parsed = safeParse<unknown[]>(window.localStorage.getItem(feedbackKey(userId)), []);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isValidFeedback);
}

export function saveBetaFeedbackEntries(userId: string, entries: BetaFeedback[]): void {
  if (typeof window === "undefined" || !userId) return;
  window.localStorage.setItem(feedbackKey(userId), JSON.stringify(entries));
}

export function getBetaFeedbackPromptState(userId: string): BetaFeedbackPromptState {
  if (typeof window === "undefined" || !userId) return DEFAULT_STATE;
  const raw = safeParse<Partial<BetaFeedbackPromptState>>(
    window.localStorage.getItem(feedbackStateKey(userId)),
    {},
  );
  return {
    lastShownAt: typeof raw.lastShownAt === "string" ? raw.lastShownAt : null,
    submittedCount:
      typeof raw.submittedCount === "number" && Number.isFinite(raw.submittedCount)
        ? raw.submittedCount
        : 0,
    dismissedCount:
      typeof raw.dismissedCount === "number" && Number.isFinite(raw.dismissedCount)
        ? raw.dismissedCount
        : 0,
  };
}

export function setBetaFeedbackPromptState(userId: string, state: BetaFeedbackPromptState): void {
  if (typeof window === "undefined" || !userId) return;
  window.localStorage.setItem(feedbackStateKey(userId), JSON.stringify(state));
}
