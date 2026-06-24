import type { Lang } from "@/src/utils/i18n/types";

export type MarketingCopy = {
  phraseGuides: string;
  continueLearning: string;
  openApp: string;
  signIn: string;
  startFree: string;
  badge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroBody: string;
  tryChatNow: string;
  browsePhraseGuides: string;
  featureChatTitle: string;
  featureChatBody: string;
  featureCultureTitle: string;
  featureCultureBody: string;
  featureWordbookTitle: string;
  featureWordbookBody: string;
  popularGuidesTitle: string;
  popularGuidesSubtitle: string;
  viewAll: string;
  ctaTitle: string;
  ctaBody: string;
    createAccount: string;
    tryPageTitle: string;
    tryPageBody: string;
    loading: string;
};

const MARKETING_COPY: Record<Lang, MarketingCopy> = {
  en: {
    phraseGuides: "Phrase guides",
    continueLearning: "Continue learning",
    openApp: "Open app",
    signIn: "Sign in",
    startFree: "Start free",
    badge: "AI Japanese coach",
    heroTitle1: "Stop sounding like a textbook.",
    heroTitle2: "Start sounding natural.",
    heroBody:
      "Frensei coaches nuance, politeness, and real-life Japanese—not grammar drills. Try 3 free messages, no sign-up.",
    tryChatNow: "Try chat now",
    browsePhraseGuides: "Browse phrase guides",
    featureChatTitle: "Chat-first coaching",
    featureChatBody:
      "Ask anything—meanings, culture, or polish your Japanese. Sensei answers like a real coach.",
    featureCultureTitle: "Culture included",
    featureCultureBody:
      "Every phrase carries context about relationships, work, and daily life in Japan.",
    featureWordbookTitle: "Your wordbook",
    featureWordbookBody: "Save words from chat. Build a personal library tied to your level and topics.",
    popularGuidesTitle: "Popular phrase guides",
    popularGuidesSubtitle: "SEO-friendly guides—then ask Sensei to go deeper.",
    viewAll: "View all →",
    ctaTitle: "Ready for unlimited coaching?",
    ctaBody: "Free account · Daily missions · Progress tracking · Personal wordbook",
    createAccount: "Create free account",
    tryPageTitle: "Try Frensei free",
    tryPageBody: "3 messages, no sign-up. Ask about any phrase or paste your Japanese.",
    loading: "Loading…",
  },
  ja: {
    phraseGuides: "フレーズガイド",
    continueLearning: "学習を続ける",
    openApp: "アプリを開く",
    signIn: "ログイン",
    startFree: "無料で始める",
    badge: "AI日本語コーチ",
    heroTitle1: "教科書っぽい日本語は、もうやめよう。",
    heroTitle2: "自然な日本語を、一緒に。",
    heroBody:
      "Frenseiはニュアンス・敬語・リアルな日本語をコーチします。登録不要で3メッセージ無料体験。",
    tryChatNow: "チャットを試す",
    browsePhraseGuides: "フレーズガイドを見る",
    featureChatTitle: "チャット中心のコーチング",
    featureChatBody: "意味・文化・表現の磨き方、何でも聞けます。先生がリアルなコーチのように答えます。",
    featureCultureTitle: "文化もセット",
    featureCultureBody: "人間関係・仕事・日常の文脈まで、フレーズごとに解説します。",
    featureWordbookTitle: "あなたの単語帳",
    featureWordbookBody: "チャットから単語を保存。レベルとトピックに合わせたライブラリを作れます。",
    popularGuidesTitle: "人気のフレーズガイド",
    popularGuidesSubtitle: "ガイドで基礎を学び、先生にもっと深く聞こう。",
    viewAll: "すべて見る →",
    ctaTitle: "無制限コーチングの準備はできましたか？",
    ctaBody: "無料アカウント · デイリーミッション · 進捗トラッキング · 個人単語帳",
    createAccount: "無料アカウントを作成",
    tryPageTitle: "Frenseiを無料で試す",
    tryPageBody: "登録不要・3メッセージ。フレーズについて聞くか、日本語を貼り付けてください。",
    loading: "読み込み中…",
  },
  ko: {
    phraseGuides: "표현 가이드",
    continueLearning: "학습 계속하기",
    openApp: "앱 열기",
    signIn: "로그인",
    startFree: "무료로 시작",
    badge: "AI 일본어 코치",
    heroTitle1: "교과서 같은 일본어는 그만.",
    heroTitle2: "자연스러운 일본어를 시작하세요.",
    heroBody:
      "Frensei는 뉘앙스, 경어, 실생활 일본어를 코칭합니다. 가입 없이 무료 메시지 3회 체험.",
    tryChatNow: "채팅 체험",
    browsePhraseGuides: "표현 가이드 보기",
    featureChatTitle: "채팅 중심 코칭",
    featureChatBody: "의미, 문화, 표현 다듬기—무엇이든 물어보세요. 선생님이 코치처럼 답합니다.",
    featureCultureTitle: "문화까지 포함",
    featureCultureBody: "인간관계, 직장, 일상의 맥락까지 표현마다 설명합니다.",
    featureWordbookTitle: "나만의 단어장",
    featureWordbookBody: "채팅에서 단어를 저장하고 레벨과 주제에 맞는 라이브러리를 만드세요.",
    popularGuidesTitle: "인기 표현 가이드",
    popularGuidesSubtitle: "가이드로 기초를 배우고, 선생님에게 더 깊이 물어보세요.",
    viewAll: "전체 보기 →",
    ctaTitle: "무제한 코칭을 시작할 준비가 되셨나요?",
    ctaBody: "무료 계정 · 데일리 미션 · 진도 추적 · 개인 단어장",
    createAccount: "무료 계정 만들기",
    tryPageTitle: "Frensei 무료 체험",
    tryPageBody: "가입 불필요 · 메시지 3회. 표현을 물어보거나 일본어를 붙여넣으세요.",
    loading: "로딩 중…",
  },
  zh: {
    phraseGuides: "表达指南",
    continueLearning: "继续学习",
    openApp: "打开应用",
    signIn: "登录",
    startFree: "免费开始",
    badge: "AI 日语教练",
    heroTitle1: "别再说教科书日语了。",
    heroTitle2: "开始说自然的日语。",
    heroBody: "Frensei 教练语感、敬语和真实日语——不是刷语法题。无需注册，免费 3 条消息。",
    tryChatNow: "立即试聊",
    browsePhraseGuides: "浏览表达指南",
    featureChatTitle: "以聊天为主的教练",
    featureChatBody: "含义、文化、润色表达——什么都可以问。老师会像真人教练一样回答。",
    featureCultureTitle: "文化一并讲解",
    featureCultureBody: "每个表达都附带人际关系、工作和日常生活的语境。",
    featureWordbookTitle: "你的单词本",
    featureWordbookBody: "从聊天中保存单词，建立符合水平和主题的 personal 词库。",
    popularGuidesTitle: "热门表达指南",
    popularGuidesSubtitle: "先看指南打基础，再向老师深入提问。",
    viewAll: "查看全部 →",
    ctaTitle: "准备好无限教练了吗？",
    ctaBody: "免费账户 · 每日任务 · 进度追踪 · 个人单词本",
    createAccount: "创建免费账户",
    tryPageTitle: "免费试用 Frensei",
    tryPageBody: "无需注册 · 3 条消息。询问任何表达或粘贴日语。",
    loading: "加载中…",
  },
};

export function getMarketingCopy(lang: Lang): MarketingCopy {
  return MARKETING_COPY[lang] ?? MARKETING_COPY.en;
}
