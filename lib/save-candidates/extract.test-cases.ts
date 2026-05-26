import { getRecommendedSaveCandidates } from "@/lib/save-candidates/extract";
import { jpCharCount } from "@/lib/save-candidates/japanese";

function terms(items: ReturnType<typeof getRecommendedSaveCandidates>): string[] {
  return items.map((i) => i.term);
}

function hasLatin(items: ReturnType<typeof getRecommendedSaveCandidates>): boolean {
  return items.some((i) => /[a-zA-Z]/.test(i.term + (i.meaning ?? "")));
}

/** Manual regression fixtures — run with npx tsx. */
export const SAVE_CANDIDATE_EXTRACT_CASES = [
  {
    name: "long apology → short phrases",
    params: {
      aiMessageContent: `Better:
すみません、遅れてしまいました。次回から気をつけます。
Why: Softer apology.
Other ways:
・遅れてしまいました
・気をつけます`,
      userMessageContent: "すみません、遅れました",
    },
    assert: (items: ReturnType<typeof getRecommendedSaveCandidates>) => {
      const t = terms(items);
      return (
        t.some((x) => x.includes("遅れてしまいました")) &&
        t.some((x) => x.includes("気をつけます")) &&
        !t.some((x) => x.includes("次回から"))
      );
    },
  },
  {
    name: "skips restaurant explanation",
    params: {
      aiMessageContent: `Better:
お願いします
Why: これはレストランで使える丁寧な言い方です
Other ways:
・お願いします
・これください`,
      userMessageContent: "おねがい",
    },
    assert: (items: ReturnType<typeof getRecommendedSaveCandidates>) => {
      const t = terms(items);
      return t.some((x) => x.includes("お願い")) && !t.some((x) => x.includes("レストラン"));
    },
  },
  {
    name: "toilet question → word + phrase",
    params: {
      aiMessageContent: "Better:\nトイレはどこですか？\nWhy: Add は.",
      userMessageContent: "トイレどこ",
      correctedSentence: "トイレはどこですか？",
    },
    assert: (items: ReturnType<typeof getRecommendedSaveCandidates>) => {
      const t = terms(items);
      return t.includes("トイレ") || t.some((x) => x.includes("どこですか"));
    },
  },
  {
    name: "phrases have example sentences",
    params: {
      aiMessageContent: "Other ways:\n・お願いします",
      userMessageContent: "test",
    },
    assert: (items: ReturnType<typeof getRecommendedSaveCandidates>) =>
      items.filter((i) => i.type === "phrase").every((i) => Boolean(i.exampleSentence && i.exampleTranslation)),
  },
  {
    name: "no correction type in recommendations",
    params: {
      aiMessageContent: "Better:\nトイレはどこですか？",
      userMessageContent: "トイレどこ",
      correctedSentence: "トイレはどこですか？",
    },
    assert: (items: ReturnType<typeof getRecommendedSaveCandidates>) =>
      !items.some((i) => i.type === "correction"),
  },
  {
    name: "terms are Japanese-only and within hard max",
    params: {
      aiMessageContent: `Better:
すみません、遅れてしまいました。
Other ways:
・すみません`,
      userMessageContent: "late",
    },
    assert: (items: ReturnType<typeof getRecommendedSaveCandidates>) =>
      items.every((i) => jpCharCount(i.term) <= 24 && !/[a-zA-Z]/.test(i.term)),
  },
] as const;

export function runSaveCandidateExtractCases(): { name: string; ok: boolean }[] {
  return SAVE_CANDIDATE_EXTRACT_CASES.map((tc) => ({
    name: tc.name,
    ok: tc.assert(getRecommendedSaveCandidates({ ...tc.params, existingItems: [] })),
  }));
}
