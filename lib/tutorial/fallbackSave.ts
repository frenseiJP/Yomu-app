import type { SaveCandidate } from "@/lib/save-candidates/types";

export const TUTORIAL_FALLBACK_SAVE_ID = "tutorial-fallback-phrase";

export function createTutorialFallbackSaveCandidate(
  sessionId?: string,
  messageId?: string,
): SaveCandidate {
  return {
    id: TUTORIAL_FALLBACK_SAVE_ID,
    type: "phrase",
    label: "Phrase",
    primaryText: "遅れてしまいました",
    secondaryText: "sounds apologetic",
    explanation: "A short phrase for apologizing for being late.",
    tags: ["tutorial", "phrase"],
    sourceSessionId: sessionId,
    sourceMessageId: messageId,
    alreadySaved: false,
  };
}
