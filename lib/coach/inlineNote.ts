import { readHabitJson, writeHabitJson } from "@/lib/habit/storage";
import { TOPIC_PROMPTS } from "@/lib/topic/service";
import type { FtueCoachPayload } from "@/lib/ftue/types";
import { inferMistakeCategory } from "@/lib/vocabulary/mistakeCategory";
import type { Lang } from "@/src/utils/i18n/types";

const STATE_KIND = "inline_coach_note_state_v2";

type InlineNoteState = {
  sessionId: string;
  lastAtTurn: number;
  correctionCount: number;
  notesShown: number;
};

export type InlineNoteContext = {
  userId: string;
  lang: Lang;
  sessionId: string;
  assistantTurnIndex: number;
  priorUserText?: string;
  payload?: FtueCoachPayload;
  topicId?: string;
};

function readState(userId: string): InlineNoteState {
  return readHabitJson<InlineNoteState>(STATE_KIND, userId, {
    sessionId: "",
    lastAtTurn: 0,
    correctionCount: 0,
    notesShown: 0,
  });
}

function writeState(userId: string, state: InlineNoteState): void {
  writeHabitJson(STATE_KIND, userId, state);
}

function isMostlyEnglish(text: string): boolean {
  const latin = (text.match(/[a-zA-Z]/g) ?? []).length;
  const jp = (text.match(/[\u3040-\u30ff\u4e00-\u9faf]/g) ?? []).length;
  return latin > jp && latin >= 8;
}

function noteCopy(lang: Lang, key: string): string {
  const map: Record<string, Record<Lang, string>> = {
    restaurant: {
      en: "You often practice restaurant Japanese.",
      ja: "レストランの日本語をよく練習していますね。",
      ko: "레스토랑 일본어를 자주 연습하고 있어요.",
      zh: "你经常在练习餐厅场景的日语。",
    },
    particles: {
      en: "You are getting more comfortable using particles.",
      ja: "助詞の使い方がだんだん自然になってきています。",
      ko: "조사 사용이 점점 편해지고 있어요.",
      zh: "你的助词用法越来越自然了。",
    },
    translation: {
      en: "You tend to use direct English translations. Try shorter Japanese chunks.",
      ja: "英語の直訳になりがちです。短い日本語の塊で試してみましょう。",
      ko: "영어를 직역하는 경향이 있어요. 짧은 일본어 덩어리로 시도해 보세요.",
      zh: "你有时会直译英语。试试用更短的日语片段。",
    },
    directions: {
      en: "Nice work practicing how to ask for directions.",
      ja: "道の尋ね方を練習しましたね。いい感じです。",
      ko: "길 묻기 연습을 잘하고 있어요.",
      zh: "问路练习做得不错。",
    },
    natural: {
      en: "Your phrasing is sounding more natural.",
      ja: "表現がだんだん自然になってきています。",
      ko: "표현이 점점 자연스러워지고 있어요.",
      zh: "你的表达越来越自然了。",
    },
    encouragement: {
      en: "You're building a steady learning rhythm — keep going.",
      ja: "学習のリズムができてきています。この調子で続けましょう。",
      ko: "학습 리듬이 잡히고 있어요. 계속해 보세요.",
      zh: "你的学习节奏很好，继续保持。",
    },
    explain: {
      en: "Good question — you're exploring useful real-life Japanese.",
      ja: "いい質問です。実生活で使える日本語を学んでいますね。",
      ko: "좋은 질문이에요. 실생활 일본어를 익히고 있어요.",
      zh: "问得好——你在学习实用的日语。",
    },
  };
  return map[key]?.[lang] ?? map[key]?.en ?? "";
}

function isLearningMoment(ctx: InlineNoteContext): boolean {
  if (ctx.topicId) return true;
  if (!ctx.payload) return false;
  if (ctx.payload.replyMode === "correction" || ctx.payload.replyMode === "explain") return true;
  return ctx.payload.replyMode === "reading";
}

/**
 * Returns a short coach note for meaningful assistant turns only (not every message).
 * Targets visibility within the first 3–5 learning interactions.
 */
export function maybeInlineCoachNote(ctx: InlineNoteContext): string | null {
  if (!isLearningMoment(ctx)) return null;

  const state = readState(ctx.userId);
  const isCorrection = ctx.payload?.replyMode === "correction";
  const correctionCount = isCorrection ? state.correctionCount + 1 : state.correctionCount;

  const sameSession = state.sessionId === ctx.sessionId;
  const turnsSinceLast = sameSession ? ctx.assistantTurnIndex - state.lastAtTurn : 999;
  const shouldRateLimit = state.notesShown > 0 && sameSession && turnsSinceLast < 2;

  if (shouldRateLimit) return null;

  const candidates: string[] = [];

  if (ctx.topicId) {
    const prompt = TOPIC_PROMPTS.find((p) => p.id === ctx.topicId);
    if (prompt?.category === "restaurant") candidates.push(noteCopy(ctx.lang, "restaurant"));
    if (prompt?.category === "asking_help") candidates.push(noteCopy(ctx.lang, "directions"));
  }

  if (ctx.payload?.replyMode === "correction") {
    const cat = inferMistakeCategory({
      userSentence: ctx.priorUserText ?? "",
      correctedSentence: ctx.payload.correctedSentence,
      note: ctx.payload.whyEnglish,
    });
    if (cat === "particle") candidates.push(noteCopy(ctx.lang, "particles"));
    if (ctx.priorUserText && isMostlyEnglish(ctx.priorUserText)) {
      candidates.push(noteCopy(ctx.lang, "translation"));
    }
    if (
      ctx.payload.correctedSentence.length > 0 &&
      ctx.priorUserText &&
      ctx.priorUserText.length > ctx.payload.correctedSentence.length + 8
    ) {
      candidates.push(noteCopy(ctx.lang, "natural"));
    }
  }

  if (ctx.payload?.replyMode === "explain" || ctx.payload?.replyMode === "reading") {
    const q = (ctx.priorUserText ?? "").toLowerCase();
    if (/restaurant|order|food|travel|particle|は|が|を/.test(q)) {
      candidates.push(noteCopy(ctx.lang, "explain"));
    }
  }

  const withinEarlyWindow = correctionCount <= 5 || state.notesShown < 3;
  if (candidates.length === 0 && withinEarlyWindow) {
    if (isCorrection && [1, 2, 3, 4, 5].includes(correctionCount)) {
      candidates.push(noteCopy(ctx.lang, "encouragement"));
    } else if (ctx.payload?.replyMode === "explain" && state.notesShown < 2) {
      candidates.push(noteCopy(ctx.lang, "explain"));
    }
  }

  if (candidates.length === 0) return null;

  writeState(ctx.userId, {
    sessionId: ctx.sessionId,
    lastAtTurn: ctx.assistantTurnIndex,
    correctionCount,
    notesShown: state.notesShown + 1,
  });
  return candidates[0];
}
