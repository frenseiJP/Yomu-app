import { extractBetterLineFromCoachText } from "@/lib/save-candidates/extract";
import { guessCorrectedSentence } from "@/lib/save-candidates/guess-correction";
import type { FtueCoachPayload } from "@/lib/ftue/types";

export type CorrectionPracticeFields = {
  corrected: string;
  userSentence?: string;
  categoryHint?: string;
};

export function deriveCorrectionPracticeFields(input: {
  senseiPayload?: FtueCoachPayload;
  assistantText: string;
  priorUserText?: string;
}): CorrectionPracticeFields | null {
  const payload = input.senseiPayload;
  if (payload?.replyMode === "correction" && payload.correctedSentence?.trim()) {
    return {
      corrected: payload.correctedSentence.trim(),
      userSentence: payload.studentSentence?.trim() || input.priorUserText?.trim(),
      categoryHint: payload.whyEnglish,
    };
  }
  const user = input.priorUserText?.trim();
  if (!user) return null;
  const guessed = guessCorrectedSentence(user, input.assistantText);
  if (guessed) {
    return { corrected: guessed, userSentence: user };
  }
  const better = extractBetterLineFromCoachText(input.assistantText);
  if (better) {
    return { corrected: better, userSentence: user };
  }
  return null;
}
