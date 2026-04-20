import type { SaveCandidate } from "@/lib/save-candidates/types";

/** メッセージ列からミッション完了判定に使う最小形 */
export type MissionCompletionMessage = {
  role: "user" | "assistant";
  baseText?: string;
  chatContext?: { saveCandidates?: Pick<SaveCandidate, "type">[] };
  topicFeedback?: { correctedAnswer?: string };
};

function userMessageCount(messages: MissionCompletionMessage[]): number {
  return messages.filter((m) => m.role === "user" && (m.baseText?.trim().length ?? 0) > 0).length;
}

function assistantDeliveredCorrection(m: MissionCompletionMessage): boolean {
  if (m.role !== "assistant") return false;
  if (m.topicFeedback?.correctedAnswer?.trim()) return true;
  if (m.chatContext?.saveCandidates?.some((c) => c.type === "correction")) return true;
  const t = m.baseText ?? "";
  if (t.includes("Better:") && (t.includes("Why:") || t.includes("Try again"))) return true;
  return false;
}

/**
 * ミッション完了: ユーザーが 2 通以上送り、かつ少なくとも 1 度「矯正」が返っている。
 * （saveCandidates の correction / FTUE 形式 / Topic の correctedAnswer）
 */
export function isMissionCompleted(messages: MissionCompletionMessage[]): boolean {
  if (userMessageCount(messages) < 2) return false;
  return messages.some((m) => assistantDeliveredCorrection(m));
}
