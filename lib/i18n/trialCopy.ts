import type { Lang } from "@/src/utils/i18n/types";

export type TrialCopy = {
  title: string;
  subtitle: string;
  body: string;
  calendlyTitle: string;
  calendlyBody: string;
  calendlyCta: string;
  calendlyFallback: string;
  tryChatTitle: string;
  tryChatBody: string;
  tryChatCta: string;
};

const COPY: Record<Lang, TrialCopy> = {
  en: {
    title: "Book a free beta intro",
    subtitle: "Talk with the maker · get set up · ask anything",
    body: "Frensei is in public beta. Book a short call if you want a guided walkthrough, or jump straight into the AI coach.",
    calendlyTitle: "Schedule on Calendly",
    calendlyBody: "Pick a time that works for you. We'll help you get the most from Frensei.",
    calendlyCta: "Open Calendly",
    calendlyFallback: "Calendly link is being configured — email us via Contact in the meantime.",
    tryChatTitle: "Prefer to try alone?",
    tryChatBody: "3 free AI messages. No sign-up. Natural Japanese coaching in your browser.",
    tryChatCta: "Try chat now",
  },
  ja: {
    title: "無料ベータ体験を予約",
    subtitle: "作り手と話す · セットアップ · 何でも質問",
    body: "Frenseiは公開ベータ中です。ガイド付きウォークスルーは予約を、すぐ試すならAIコーチへどうぞ。",
    calendlyTitle: "Calendlyで予約",
    calendlyBody: "都合のよい時間を選んでください。Frenseiの使い方を一緒に確認します。",
    calendlyCta: "Calendlyを開く",
    calendlyFallback: "Calendly準備中 — お急ぎの方はお問い合わせからご連絡ください。",
    tryChatTitle: "まず自分で試す？",
    tryChatBody: "無料3メッセージ。登録不要。ブラウザで自然な日本語コーチング。",
    tryChatCta: "チャットを試す",
  },
  ko: {
    title: "무료 베타 소개 예약",
    subtitle: "제작자와 대화 · 설정 도움 · 무엇이든 질문",
    body: "Frensei는 공개 베타입니다. 안내가 필요하면 예약하고, 바로 써보고 싶다면 AI 코치로 이동하세요.",
    calendlyTitle: "Calendly에서 예약",
    calendlyBody: "편한 시간을 선택하세요. Frensei 활용법을 함께 살펴봅니다.",
    calendlyCta: "Calendly 열기",
    calendlyFallback: "Calendly 준비 중 — 문의 페이지로 연락해 주세요.",
    tryChatTitle: "혼자 먼저 해볼까요?",
    tryChatBody: "무료 3메시지. 가입 불필요. 브라우저에서 자연스러운 일본어 코칭.",
    tryChatCta: "채팅 체험",
  },
  zh: {
    title: "预约免费测试版介绍",
    subtitle: "与开发者交流 · 协助上手 · 随时提问",
    body: "Frensei 正在公开测试。需要引导可预约通话，想直接体验请进入 AI 教练。",
    calendlyTitle: "在 Calendly 预约",
    calendlyBody: "选择合适的时间，我们会帮你快速上手 Frensei。",
    calendlyCta: "打开 Calendly",
    calendlyFallback: "Calendly 配置中 — 请暂时通过联系页面与我们联系。",
    tryChatTitle: "想先自己试试？",
    tryChatBody: "免费 3 条消息，无需注册，在浏览器中体验自然日语辅导。",
    tryChatCta: "立即试聊",
  },
};

export function getTrialCopy(lang: Lang): TrialCopy {
  return COPY[lang] ?? COPY.en;
}
