import type { VocabularyItem } from "@/lib/vocabulary/types";
import type { PrototypeUiText } from "@/src/utils/i18n/prototypeCopy";

export function vocabSourceLabel(
  ui: PrototypeUiText,
  source: VocabularyItem["sourceType"],
): string {
  if (source === "chat") return ui.vocabSourceChat;
  if (source === "topic") return ui.vocabSourceTopic;
  if (source === "review") return ui.vocabSourceReview;
  return ui.vocabSourceManual;
}

export function vocabReviewStatusLabel(
  ui: PrototypeUiText,
  status: VocabularyItem["reviewStatus"],
): string {
  if (status === "new") return ui.vocabReviewNew;
  if (status === "learning") return ui.vocabReviewLearning;
  return ui.vocabReviewReviewed;
}
