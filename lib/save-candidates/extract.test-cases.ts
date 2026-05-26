import { getRecommendedSaveCandidates } from "@/lib/save-candidates/extract";

/** Manual regression fixtures — run in dev console or a one-off script. */
export const SAVE_CANDIDATE_EXTRACT_CASES = [
  {
    name: "long apology splits into short phrases",
    params: {
      aiMessageContent: `Better:
すみません、遅れてしまいました。次回からはもっと早く来ます。
Why: Softer apology.
Other ways:
・すみません
・遅れてしまいました`,
      userMessageContent: "すみません、遅れました",
      messageId: "t1",
    },
    assert: (items: ReturnType<typeof getRecommendedSaveCandidates>) => {
      const terms = items.map((i) => i.primaryText);
      const maxLen = Math.max(...terms.map((t) => t.length));
      return maxLen <= 22 && !terms.some((t) => t.includes("次回からはもっと早く"));
    },
  },
  {
    name: "skips verbose explanation lines",
    params: {
      aiMessageContent: `Better:
お願いします
Why: これはレストランで注文するときに使える丁寧な表現です`,
      userMessageContent: "おねがい",
    },
    assert: (items: ReturnType<typeof getRecommendedSaveCandidates>) =>
      !items.some((i) => i.primaryText.includes("レストラン")),
  },
  {
    name: "short correction allowed, long skipped",
    params: {
      aiMessageContent: "Better:\nトイレはどこですか？\nWhy: Add は.",
      userMessageContent: "トイレどこ",
      correctedSentence: "トイレはどこですか？",
    },
    assert: (items: ReturnType<typeof getRecommendedSaveCandidates>) => {
      const corr = items.find((i) => i.type === "correction");
      if (!corr) return true;
      return corr.primaryText.length <= 22;
    },
  },
] as const;

export function runSaveCandidateExtractCases(): { name: string; ok: boolean }[] {
  return SAVE_CANDIDATE_EXTRACT_CASES.map((tc) => ({
    name: tc.name,
    ok: tc.assert(getRecommendedSaveCandidates({ ...tc.params, existingItems: [] })),
  }));
}
