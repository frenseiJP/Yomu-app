import type { Lang } from "@/src/utils/i18n/types";
import { writeHabitJson } from "@/lib/habit/storage";
import {
  EMPTY_ONBOARDING_RESPONSE,
  type OnboardingResponse,
} from "@/lib/onboarding/schema";
import { readOnboardingResponse, writeOnboardingResponse } from "@/lib/onboarding/persistence";

const KIND = "onboarding_goals_v1";

/** @deprecated Use OnboardingResponse from schema */
export type OnboardingGoals = {
  why: string;
  hardest: string;
  minutes: string;
};

const EMPTY: OnboardingGoals = { why: "", hardest: "", minutes: "" };

export function readOnboardingGoals(userId: string): OnboardingGoals {
  const r = readOnboardingResponse(userId);
  return { why: r.why, hardest: r.hardest, minutes: r.minutes };
}

export function writeOnboardingGoals(userId: string, goals: OnboardingGoals): void {
  writeOnboardingResponse(userId, goals as OnboardingResponse);
  writeHabitJson(KIND, userId, goals);
}

export function starterPromptsForGoals(goals: OnboardingGoals, lang: Lang): string[] | null {
  if (!goals.why) return null;
  const travel: Record<Lang, string[]> = {
    en: [
      "How do I order food politely?",
      "Teach me natural Japanese for travel.",
      "How do Japanese people say no politely?",
    ],
    ja: [
      "丁寧に注文するには？",
      "旅行で使える自然な日本語を教えて",
      "断り方を自然に言うには？",
    ],
    ko: [
      "정중하게 주문하려면?",
      "여행에서 쓸 자연스러운 일본어",
      "정중하게 거절하는 표현은?",
    ],
    zh: [
      "如何礼貌地点餐？",
      "教我旅行用的自然日语",
      "日本人如何礼貌地拒绝？",
    ],
  };
  const work: Record<Lang, string[]> = {
    en: [
      "How do I apologize for being late?",
      "Business email opening phrases in Japanese",
      "Keigo vs casual at work",
    ],
    ja: [
      "遅刻のお詫びは？",
      "ビジネスメールの書き出し",
      "仕事での敬語とタメ口",
    ],
    ko: [
      "늦었을 때 사과는?",
      "비즈니스 메일 시작 표현",
      "직장에서 경어 vs 캐주얼",
    ],
    zh: [
      "迟到时如何道歉？",
      "商务邮件开头用语",
      "工作中的敬语与口语",
    ],
  };
  const map: Record<string, Record<Lang, string[]>> = {
    travel: travel,
    anime: travel,
    work: work,
    living: work,
    friends: travel,
    other: travel,
  };
  return map[goals.why]?.[lang] ?? null;
}

export { EMPTY_ONBOARDING_RESPONSE };
