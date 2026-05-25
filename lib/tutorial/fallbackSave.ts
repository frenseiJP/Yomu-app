import type { SaveCandidate } from "@/lib/save-candidates/types";

export const TUTORIAL_FALLBACK_SAVE_ID = "tutorial-fallback-phrase";

export function createTutorialFallbackSaveCandidate(
  sessionId?: string,
  messageId?: string,
): SaveCandidate {
  return {
    id: TUTORIAL_FALLBACK_SAVE_ID,
    type: "phrase",
    label: "Useful phrase",
    primaryText: "すみません、遅れてしまいました",
    secondaryText: "A natural way to apologize for being late",
    explanation: "Slightly softer and clearer than the raw sentence.",
    tags: ["tutorial", "phrase"],
    sourceSessionId: sessionId,
    sourceMessageId: messageId,
    alreadySaved: false,
  };
}
