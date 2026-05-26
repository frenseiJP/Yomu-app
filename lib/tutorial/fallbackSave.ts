import { makeSaveCandidate } from "@/lib/save-candidates/enrich";
import type { SaveCandidate } from "@/lib/save-candidates/types";

export const TUTORIAL_FALLBACK_SAVE_ID = "tutorial-fallback-phrase";

export function createTutorialFallbackSaveCandidate(
  sessionId?: string,
  messageId?: string,
): SaveCandidate {
  const cand = makeSaveCandidate({
    type: "phrase",
    term: "遅れてしまいました",
    messageId,
    sessionId,
    index: 0,
    tags: ["tutorial", "phrase"],
  });
  return { ...cand, id: TUTORIAL_FALLBACK_SAVE_ID };
}
