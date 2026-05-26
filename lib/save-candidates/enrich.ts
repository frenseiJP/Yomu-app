import type { SaveCandidate } from "@/lib/save-candidates/types";
import { jpCharCount, stripSnippet, toJapaneseOnly } from "@/lib/save-candidates/japanese";

const MEANINGS: Record<string, string> = {
  遅れてしまいました: "I ended up being late",
  すみません: "sorry / excuse me",
  お願いします: "please / I'd appreciate it",
  おつかれさま: "good work / see you",
  どこですか: "where is it?",
  これください: "this one, please",
  気をつけます: "I'll be careful",
  大丈夫: "it's okay / all right",
  予約: "reservation",
  注文: "order",
  駅: "station",
  トイレ: "restroom / toilet",
  遅れる: "to be late",
  辛い: "spicy",
};

const PHRASE_EXAMPLES: Record<
  string,
  { exampleSentence: string; exampleTranslation: string }
> = {
  遅れてしまいました: {
    exampleSentence: "すみません、遅れてしまいました。",
    exampleTranslation: "Sorry, I ended up being late.",
  },
  お願いします: {
    exampleSentence: "水をお願いします。",
    exampleTranslation: "Water, please.",
  },
  おつかれさま: {
    exampleSentence: "今日もおつかれさま。",
    exampleTranslation: "Good work today.",
  },
  どこですか: {
    exampleSentence: "トイレはどこですか。",
    exampleTranslation: "Where is the restroom?",
  },
  これください: {
    exampleSentence: "これください。",
    exampleTranslation: "This one, please.",
  },
  気をつけます: {
    exampleSentence: "次回から気をつけます。",
    exampleTranslation: "I'll be careful next time.",
  },
  すみません: {
    exampleSentence: "すみません、少し遅れます。",
    exampleTranslation: "Sorry, I'll be a little late.",
  },
};

function normKey(term: string): string {
  return stripSnippet(term);
}

export function inferMeaning(term: string, type: "word" | "phrase"): string {
  const key = normKey(term);
  if (MEANINGS[key]) return MEANINGS[key]!;
  if (/すみません|申し訳|ごめん/.test(key)) return "sorry / excuse me";
  if (/お願い|ください/.test(key)) return "please / request";
  if (/ですか|ますか/.test(key)) return "question pattern";
  if (/遅れ|遅刻/.test(key)) return "being late";
  if (/気をつけ/.test(key)) return "being careful";
  if (/辛い/.test(key)) return "spicy / hot";
  if (/おいしい/.test(key)) return "delicious";
  return type === "word" ? "Japanese word" : "useful phrase";
}

export function buildPhraseExample(
  term: string,
): { exampleSentence: string; exampleTranslation: string } {
  const key = normKey(term);
  if (PHRASE_EXAMPLES[key]) return PHRASE_EXAMPLES[key]!;

  const meaning = inferMeaning(key, "phrase");
  const t = key.endsWith("。") ? key : `${key}。`;

  if (/すみません/.test(key) && key.length > 5) {
    return {
      exampleSentence: `すみません、${key.replace(/^すみません[、,]?/, "")}。`.replace(/。。/g, "。"),
      exampleTranslation: `Sorry — ${meaning}.`,
    };
  }
  if (/ください$/.test(key) && !/^これ/.test(key)) {
    const topic = key.includes("水") ? "" : "水を";
    return {
      exampleSentence: `${topic}${key}。`,
      exampleTranslation: meaning === "please / request" ? "A polite request." : meaning,
    };
  }
  if (/ですか$|ますか$/.test(key)) {
    const topic = /トイレ/.test(key) ? "トイレは" : /駅/.test(key) ? "駅は" : "";
    const q = key.replace(/^トイレは?/, "").replace(/^駅は?/, "");
    return {
      exampleSentence: `${topic}${q}。`,
      exampleTranslation: "Asking where something is.",
    };
  }
  if (/ます$|ました$/.test(key)) {
    return {
      exampleSentence: t.length <= 24 ? t : `今日は${key}。`,
      exampleTranslation: meaning,
    };
  }

  return {
    exampleSentence: t.length <= 28 ? t : `${key.slice(0, 12)}…`,
    exampleTranslation: meaning,
  };
}

export function makeSaveCandidate(opts: {
  type: "word" | "phrase";
  term: string;
  messageId?: string;
  sessionId?: string;
  index: number;
  tags?: string[];
}): SaveCandidate {
  const term = toJapaneseOnly(opts.term);
  const meaning = inferMeaning(term, opts.type);
  const phraseEx = opts.type === "phrase" ? buildPhraseExample(term) : undefined;

  return {
    id: `cand_${opts.type}_${Date.now()}_${opts.index}`,
    type: opts.type,
    label: opts.type === "word" ? "Word" : "Phrase",
    term,
    meaning,
    primaryText: term,
    secondaryText: meaning,
    exampleSentence: phraseEx?.exampleSentence,
    exampleTranslation: phraseEx?.exampleTranslation,
    tags: opts.tags ?? [opts.type],
    sourceMessageId: opts.messageId,
    sourceSessionId: opts.sessionId,
    alreadySaved: false,
  };
}

/** Reject English-heavy or oversized display strings. */
export function isValidCandidateTerm(term: string, maxJp: number): boolean {
  const jp = toJapaneseOnly(term);
  const n = jpCharCount(jp);
  return n >= 1 && n <= maxJp && jp === stripSnippet(term);
}
