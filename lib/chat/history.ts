import type { FtueCoachPayload } from "@/lib/ftue/types";
import { appendSessionSummarySnippet } from "@/lib/chat/storage";

/** Recent message pairs sent to the model (user + assistant count). */
export const CHAT_HISTORY_MESSAGE_LIMIT = 12;
export const CHAT_HISTORY_MAX_TOTAL_CHARS = 12_000;

export type HistoryTurn = {
  role: "user" | "assistant";
  baseText: string;
  senseiPayload?: FtueCoachPayload;
};

function clip(text: string, max: number): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

/** Compact structured state so the model keeps correction/explain context. */
export function compactPayloadForHistory(payload: FtueCoachPayload): string {
  if (payload.replyMode === "correction") {
    const student = clip(payload.studentSentence || "", 72);
    const corrected = clip(payload.correctedSentence || "", 72);
    const why = clip(payload.whyEnglish || "", 100);
    return `[correction student="${student}" corrected="${corrected}" why="${why}"]`;
  }
  if (payload.replyMode === "reading") {
    return `[reading] ${clip(payload.answer || "", 140)}`;
  }
  return `[explain] ${clip(payload.answer || "", 160)}`;
}

export function messageContentForApi(turn: HistoryTurn): string {
  if (turn.role === "assistant" && turn.senseiPayload) {
    const prefix = compactPayloadForHistory(turn.senseiPayload);
    const body = clip(turn.baseText, 700);
    return `${prefix}\n${body}`;
  }
  if (turn.role === "assistant") {
    return clip(turn.baseText, 700);
  }
  return clip(turn.baseText, 900);
}

export function buildChatHistoryMessages(
  prior: HistoryTurn[],
  userText: string,
): { role: "user" | "assistant"; content: string }[] {
  const history = prior
    .slice(-CHAT_HISTORY_MESSAGE_LIMIT)
    .map((turn) => ({
      role: turn.role,
      content: messageContentForApi(turn),
    }));
  return [...history, { role: "user" as const, content: userText.trim() }];
}

export function buildRollingSessionSummaryLine(
  userText: string,
  payload: FtueCoachPayload,
): string {
  const q = clip(userText, 70);
  if (payload.replyMode === "correction") {
    return `Corrected "${q}" → "${clip(payload.correctedSentence || "", 70)}"`;
  }
  if (payload.replyMode === "reading") {
    return `Reading help for "${q}"`;
  }
  const topic = clip(payload.answer || "", 90);
  return `Explained "${q}" — ${topic}`;
}

/** Append to the current session summary so coachContext carries thread memory. */
export function updateRollingSessionSummary(
  userId: string,
  sessionId: string,
  userText: string,
  payload: FtueCoachPayload,
): void {
  if (!userId || userId === "guest" || !sessionId) return;
  const line = buildRollingSessionSummaryLine(userText, payload);
  appendSessionSummarySnippet(userId, sessionId, line);
}
