import { readHabitJson, writeHabitJson } from "@/lib/habit/storage";
import { todayYmd } from "@/lib/habit/date";
import type { Lang } from "@/src/utils/i18n/types";

const KIND = "daily_reflection_v1";

type ReflectionState = { completedDays: string[] };

const REFLECTIONS: Record<Lang, string[]> = {
  en: [
    "Describe your day in one Japanese sentence.",
    "Use one new polite phrase today.",
    "Ask for help politely in Japanese.",
    "Say thank you naturally — not textbook-stiff.",
    "Practice one travel phrase you'll use soon.",
  ],
  ja: [
    "今日のことを日本語で一文で書いてみましょう。",
    "丁寧な言い方を一つ使ってみましょう。",
    "助けを求めるとき、自然な日本語は？",
    "ありがとうを自然に言う練習をしましょう。",
    "旅行で使えそうなフレーズを一つ練習しましょう。",
  ],
  ko: [
    "오늘 하루를 일본어 한 문장으로 써 보세요.",
    "정중한 표현을 하나 써 보세요.",
    "도움을 정중하게 요청하는 일본어는?",
    "자연스럽게 감사 인사를 연습해 보세요.",
    "여행에서 쓸 표현을 하나 연습해 보세요.",
  ],
  zh: [
    "用一句日语描述你今天。",
    "今天试着用一句礼貌表达。",
    "如何用日语礼貌地请求帮助？",
    "练习自然地表达感谢。",
    "练习一个旅行时会用的短语。",
  ],
};

export function isDailyReflectionCompletedToday(userId: string): boolean {
  const state = readHabitJson<ReflectionState>(KIND, userId, { completedDays: [] });
  return state.completedDays.includes(todayYmd());
}

export function markDailyReflectionCompleted(userId: string): void {
  const day = todayYmd();
  const state = readHabitJson<ReflectionState>(KIND, userId, { completedDays: [] });
  if (state.completedDays.includes(day)) return;
  writeHabitJson(KIND, userId, {
    completedDays: [...state.completedDays, day].slice(-90),
  });
}

export function getDailyReflectionPrompt(lang: Lang, userId: string): string | null {
  if (isDailyReflectionCompletedToday(userId)) return null;
  const list = REFLECTIONS[lang] ?? REFLECTIONS.en;
  const day = todayYmd();
  let hash = 0;
  const seed = `${userId}|${day}`;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return list[hash % list.length]!;
}
