import type { Lang } from "@/src/utils/i18n/types";

export type LaunchCopy = {
  badge: string;
  title: string;
  tagline: string;
  body: string;
  tryCta: string;
  trialCta: string;
  phTitle: string;
  phBullets: string[];
  makerComment: string;
  features: { title: string; body: string }[];
};

const COPY: Record<Lang, LaunchCopy> = {
  en: {
    badge: "Public beta",
    title: "Frensei",
    tagline: "Stop sounding like a textbook. Start sounding natural.",
    body: "AI Japanese coach for nuance, politeness, and real-life culture — not grammar drills. Try 3 messages free, no sign-up.",
    tryCta: "Try 3 free messages",
    trialCta: "Book a beta intro call",
    phTitle: "Why we built Frensei",
    phBullets: [
      "Chat-first coaching with cultural context on every phrase",
      "Save vocabulary from real conversations",
      "4 UI languages: English, Japanese, Korean, Chinese",
      "Guest try → sign up when you're hooked",
    ],
    makerComment:
      "We're in beta and shipping fast. Your feedback shapes what we build next — bugs, confusing moments, and 'I wish it did X' all welcome.",
    features: [
      { title: "Natural Japanese", body: "Corrections that sound like a real person, not a textbook." },
      { title: "Culture included", body: "Why a phrase works — relationships, work, daily life." },
      { title: "Your wordbook", body: "Save from chat. Review what you actually use." },
    ],
  },
  ja: {
    badge: "公開ベータ",
    title: "Frensei",
    tagline: "教科書の日本語から、自然な日本語へ。",
    body: "ニュアンス・敬語・文化まで伴走するAI日本語コーチ。登録不要で3メッセージ無料体験。",
    tryCta: "無料で3メッセージ試す",
    trialCta: "ベータ紹介を予約",
    phTitle: "Frenseiを作った理由",
    phBullets: [
      "文化コンテキスト付きのチャットコーチング",
      "会話から語彙を保存",
      "UI 4言語（英・日・韓・中）",
      "ゲスト体験 → 気に入ったら登録",
    ],
    makerComment:
      "ベータ中は改善を最優先しています。バグ・わかりにくい点・要望をぜひフィードバックへ。",
    features: [
      { title: "自然な日本語", body: "教科書ではなく、実際の言い回しで添削。" },
      { title: "文化の説明", body: "なぜその表現か — 関係性や場面も一緒に。" },
      { title: "マイ単語帳", body: "チャットから保存して復習。" },
    ],
  },
  ko: {
    badge: "공개 베타",
    title: "Frensei",
    tagline: "교과서 일본어가 아닌, 자연스러운 일본어로.",
    body: "뉘앙스·경어·문화까지 코칭하는 AI 일본어 코치. 가입 없이 3메시지 무료 체험.",
    tryCta: "무료 3메시지 체험",
    trialCta: "베타 소개 예약",
    phTitle: "Frensei를 만든 이유",
    phBullets: [
      "문화 맥락이 포함된 채팅 코칭",
      "대화에서 어휘 저장",
      "UI 4개 언어",
      "게스트 체험 후 가입",
    ],
    makerComment: "베타 기간 중 빠르게 개선합니다. 버그와 아이디어를 보내 주세요.",
    features: [
      { title: "자연스러운 일본어", body: "실제 대화처럼 교정합니다." },
      { title: "문화 설명", body: "왜 이 표현인지 함께 이해합니다." },
      { title: "단어장", body: "채팅에서 저장하고 복습." },
    ],
  },
  zh: {
    badge: "公开测试",
    title: "Frensei",
    tagline: "告别教科书日语，说更自然的日语。",
    body: "AI 日语教练：语气、礼貌与文化 — 不是刷语法。无需注册，免费试 3 条消息。",
    tryCta: "免费试 3 条消息",
    trialCta: "预约测试版介绍",
    phTitle: "为什么做 Frensei",
    phBullets: [
      "带文化背景的聊天辅导",
      "从对话保存词汇",
      "四种界面语言",
      "游客体验 → 满意再注册",
    ],
    makerComment: "测试阶段快速迭代，欢迎反馈 bug 与建议。",
    features: [
      { title: "自然日语", body: "纠正更像真人表达。" },
      { title: "文化说明", body: "理解为什么这么说。" },
      { title: "单词本", body: "从聊天保存并复习。" },
    ],
  },
};

export function getLaunchCopy(lang: Lang): LaunchCopy {
  return COPY[lang] ?? COPY.en;
}
