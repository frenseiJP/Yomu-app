import type { Lang } from "@/src/utils/i18n/types";

export type ComparisonRow = {
  feature: string;
  apps: string;
  tutor: string;
  frensei: string;
};

export type MarketingCopy = {
  phraseGuides: string;
  pricing: string;
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
  empathyTitle: string;
  empathyBody: string;
  empathyQuotes: string[];
  comparisonTitle: string;
  comparisonSubtitle: string;
  comparisonColApps: string;
  comparisonColTutor: string;
  comparisonColFrensei: string;
  comparisonRows: ComparisonRow[];
  founderTitle: string;
  founderBody: string;
  founderNote: string;
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
  footerShareLine: string;
  footerShareCta: string;
  tryPageTitle: string;
  tryPageBody: string;
  loading: string;
};

const MARKETING_COPY: Record<Lang, MarketingCopy> = {
  en: {
    phraseGuides: "Phrase guides",
    pricing: "Pricing",
    continueLearning: "Continue learning",
    openApp: "Open app",
    signIn: "Sign in",
    startFree: "Start free",
    badge: "Public beta · AI Japanese coach",
    heroTitle1: "Stop sounding like a textbook.",
    heroTitle2: "Start sounding natural.",
    heroBody:
      "3 free chat messages. No signup. No credit card. See how native Japanese actually sounds — with culture explained in plain English.",
    tryChatNow: "Try 3 free messages — no signup",
    browsePhraseGuides: "Browse phrase guides",
    empathyTitle: "You studied Japanese. Then you landed in Japan.",
    empathyBody:
      "You know the grammar. You freeze when someone speaks fast. You say すみません and still feel off. That gap is not your fault — apps teach drills, not real life.",
    empathyQuotes: [
      "I passed N3 but still sound like a textbook.",
      "Duolingo never explained why my すみません felt wrong at work.",
      "I want to sound polite without sounding robotic.",
    ],
    comparisonTitle: "Why learners switch to Frensei",
    comparisonSubtitle: "Not another vocabulary app. Not grammar drills.",
    comparisonColApps: "Language apps",
    comparisonColTutor: "Tutor only",
    comparisonColFrensei: "Frensei",
    comparisonRows: [
      {
        feature: "Try free, no signup",
        apps: "Limited",
        tutor: "Rarely",
        frensei: "3 messages",
      },
      {
        feature: "Natural phrasing + nuance",
        apps: "Grammar-first",
        tutor: "Depends",
        frensei: "Every reply",
      },
      {
        feature: "Culture explained",
        apps: "Rare",
        tutor: "Sometimes",
        frensei: "Built in",
      },
      {
        feature: "Practice between lessons",
        apps: "Yes",
        tutor: "No",
        frensei: "AI coach 24/7",
      },
    ],
    founderTitle: "Built by someone who hears textbook Japanese every day",
    founderBody:
      "I'm Japanese. I built Frensei because learners deserve better than「教科書の日本語」— the stiff phrases that make native speakers wince. Real Japanese is situational, polite, and human.",
    founderNote: "Public beta — ship fast, fix with your feedback.",
    featureChatTitle: "Chat-first coaching",
    featureChatBody:
      "Ask anything — meanings, culture, or polish your Japanese. Sensei answers like a real coach, not a dictionary.",
    featureCultureTitle: "Culture included",
    featureCultureBody:
      "Every phrase carries context about relationships, work, and daily life in Japan.",
    featureWordbookTitle: "Your wordbook",
    featureWordbookBody: "Save words from chat. Build a personal library tied to your level and topics.",
    popularGuidesTitle: "Popular phrase guides",
    popularGuidesSubtitle: "Start with a guide — then ask Sensei to go deeper.",
    viewAll: "View all →",
    ctaTitle: "Textbook Japanese ends here.",
    ctaBody: "Share Frensei with a friend learning Japanese — or try 3 messages yourself first.",
    createAccount: "Try 3 free messages — no signup",
    footerShareLine: "Stop sounding like a textbook. Share Frensei.",
    footerShareCta: "Try 3 free messages",
    tryPageTitle: "Try 3 free messages",
    tryPageBody: "No signup. Ask about any phrase or paste your Japanese — Sensei replies in seconds.",
    loading: "Loading…",
  },
  ja: {
    phraseGuides: "フレーズガイド",
    pricing: "料金",
    continueLearning: "学習を続ける",
    openApp: "アプリを開く",
    signIn: "ログイン",
    startFree: "無料で始める",
    badge: "公開ベータ · AI日本語コーチ",
    heroTitle1: "教科書っぽい日本語は、もうやめよう。",
    heroTitle2: "自然な日本語を、今すぐ。",
    heroBody:
      "登録不要・3メッセージ無料。クレジットカード不要。ネイティブが実際に使う言い回しと、文化の理由をその場で体験。",
    tryChatNow: "3メッセージ無料で試す — 登録不要",
    browsePhraseGuides: "フレーズガイドを見る",
    empathyTitle: "日本語を勉強した。でも現場で固まる。",
    empathyBody:
      "文法はわかる。早口になると頭が真っ白。すみませんを言ってもしっくりこない——それはあなたのせいじゃない。アプリはドリル、生活は別物だから。",
    empathyQuotes: [
      "N3は取ったのに、まだ教科書っぽい。",
      "アプリでは、職場のすみませんの違和感がわからなかった。",
      "丁寧だけど、ロボットみたいには話したくない。",
    ],
    comparisonTitle: "Frenseiに乗り換える理由",
    comparisonSubtitle: "単語アプリでも、文法ドリルでもない。",
    comparisonColApps: "語学アプリ",
    comparisonColTutor: "レッスンのみ",
    comparisonColFrensei: "Frensei",
    comparisonRows: [
      {
        feature: "登録なしで無料体験",
        apps: "制限あり",
        tutor: "ほぼなし",
        frensei: "3メッセージ",
      },
      {
        feature: "自然な言い回し・ニュアンス",
        apps: "文法中心",
        tutor: "講師次第",
        frensei: "毎回",
      },
      {
        feature: "文化の説明",
        apps: "少ない",
        tutor: "ときどき",
        frensei: "標準装備",
      },
      {
        feature: "レッスン間の練習",
        apps: "あり",
        tutor: "なし",
        frensei: "AIコーチ24/7",
      },
    ],
    founderTitle: "教科書日本語にうんざりした日本人が作った",
    founderBody:
      "日本人として、学習者の「教科書っぽい日本語」を毎日聞いています。Frenseiは場面・敬語・人間味のある日本語を届けるために作りました。",
    founderNote: "公開ベータ — フィードバックで毎週改善します。",
    featureChatTitle: "チャット中心のコーチング",
    featureChatBody: "意味・文化・表現の磨き方、何でも聞けます。辞書ではなくコーチが答えます。",
    featureCultureTitle: "文化もセット",
    featureCultureBody: "人間関係・仕事・日常の文脈まで、フレーズごとに解説します。",
    featureWordbookTitle: "あなたの単語帳",
    featureWordbookBody: "チャットから単語を保存。レベルとトピックに合わせたライブラリを作れます。",
    popularGuidesTitle: "人気のフレーズガイド",
    popularGuidesSubtitle: "ガイドで基礎を学び、先生にもっと深く聞こう。",
    viewAll: "すべて見る →",
    ctaTitle: "教科書の日本語は、ここで終わり。",
    ctaBody: "日本語を学ぶ友人にシェア — まずは3メッセージ無料で試してください。",
    createAccount: "3メッセージ無料で試す — 登録不要",
    footerShareLine: "教科書っぽい日本語、やめよう。Frenseiをシェア。",
    footerShareCta: "3メッセージ無料で試す",
    tryPageTitle: "3メッセージ無料で試す",
    tryPageBody: "登録不要。フレーズを聞くか日本語を貼るだけ — 数秒で先生が返信します。",
    loading: "読み込み中…",
  },
  ko: {
    phraseGuides: "표현 가이드",
    pricing: "요금",
    continueLearning: "학습 계속하기",
    openApp: "앱 열기",
    signIn: "로그인",
    startFree: "무료로 시작",
    badge: "공개 베타 · AI 일본어 코치",
    heroTitle1: "교과서 같은 일본어는 그만.",
    heroTitle2: "자연스러운 일본어를 시작하세요.",
    heroBody:
      "가입 없이 무료 메시지 3회. 카드 불필요. 네이티브가 실제로 쓰는 표현과 문화 설명을 바로 체험하세요.",
    tryChatNow: "무료 메시지 3회 체험 — 가입 불필요",
    browsePhraseGuides: "표현 가이드 보기",
    empathyTitle: "일본어를 공부했는데, 현장에서 막힙니다.",
    empathyBody:
      "문법은 압니다. 빠르게 말하면 멈춥니다. すみません를 써도 어색합니다. 앱은 드릴, 실생활은 다릅니다.",
    empathyQuotes: [
      "N3는 땄는데 아직 교과서 같아요.",
      "앱에서는 직장에서의 すみません 차이를 몰랐어요.",
      "정중하지만 로봇처럼 말하고 싶지 않아요.",
    ],
    comparisonTitle: "Frensei로 바꾸는 이유",
    comparisonSubtitle: "단어 앱도, 문법 드릴도 아닙니다.",
    comparisonColApps: "어학 앱",
    comparisonColTutor: "튜터만",
    comparisonColFrensei: "Frensei",
    comparisonRows: [
      { feature: "가입 없이 무료 체험", apps: "제한적", tutor: "거의 없음", frensei: "메시지 3회" },
      { feature: "자연스러운 표현", apps: "문법 중심", tutor: "강사 따라", frensei: "매 답변" },
      { feature: "문화 설명", apps: "드묾", tutor: "가끔", frensei: "기본 포함" },
      { feature: "레슨 사이 연습", apps: "있음", tutor: "없음", frensei: "AI 코치 24/7" },
    ],
    founderTitle: "교과서 일본어에 지친 일본인이 만들었습니다",
    founderBody:
      "일본인으로서 학습자의 교과서 같은 일본어를 매일 듣습니다. Frensei는 상황·경어·인간적인 일본어를 위해 만들었습니다.",
    founderNote: "공개 베타 — 피드백으로 매주 개선합니다.",
    featureChatTitle: "채팅 중심 코칭",
    featureChatBody: "의미, 문화, 표현 다듬기—무엇이든 물어보세요. 선생님이 코치처럼 답합니다.",
    featureCultureTitle: "문화까지 포함",
    featureCultureBody: "인간관계, 직장, 일상의 맥락까지 표현마다 설명합니다.",
    featureWordbookTitle: "나만의 단어장",
    featureWordbookBody: "채팅에서 단어를 저장하고 레벨과 주제에 맞는 라이브러리를 만드세요.",
    popularGuidesTitle: "인기 표현 가이드",
    popularGuidesSubtitle: "가이드로 기초를 배우고, 선생님에게 더 깊이 물어보세요.",
    viewAll: "전체 보기 →",
    ctaTitle: "교과서 일본어는 여기서 끝.",
    ctaBody: "일본어를 배우는 친구에게 공유하거나, 먼저 3메시지를 체험하세요.",
    createAccount: "무료 메시지 3회 체험 — 가입 불필요",
    footerShareLine: "교과서 같은 일본어, 그만. Frensei를 공유하세요.",
    footerShareCta: "무료 메시지 3회 체험",
    tryPageTitle: "무료 메시지 3회 체험",
    tryPageBody: "가입 불필요. 표현을 물어보거나 일본어를 붙여넣으세요 — 몇 초 안에 답합니다.",
    loading: "로딩 중…",
  },
  zh: {
    phraseGuides: "表达指南",
    pricing: "定价",
    continueLearning: "继续学习",
    openApp: "打开应用",
    signIn: "登录",
    startFree: "免费开始",
    badge: "公开测试 · AI 日语教练",
    heroTitle1: "别再说教科书日语了。",
    heroTitle2: "开始说自然的日语。",
    heroBody: "无需注册，免费 3 条消息。无需信用卡。当场体验母语者真实说法与文化解释。",
    tryChatNow: "免费试 3 条消息 — 无需注册",
    browsePhraseGuides: "浏览表达指南",
    empathyTitle: "学了日语，到现场还是卡住。",
    empathyBody: "语法会了，一快就懵。说了すみません还是别扭——不是您的错。应用教刷题，生活不一样。",
    empathyQuotes: [
      "过了 N3，说话还是像教科书。",
      "应用从没解释职场里すみません为什么不对。",
      "想礼貌，但不想像机器人。",
    ],
    comparisonTitle: "为什么换用 Frensei",
    comparisonSubtitle: "不是背单词应用，也不是语法刷题。",
    comparisonColApps: "语言应用",
    comparisonColTutor: "仅上课",
    comparisonColFrensei: "Frensei",
    comparisonRows: [
      { feature: "免注册免费试", apps: "有限", tutor: "很少", frensei: "3 条消息" },
      { feature: "自然表达与语感", apps: "语法为主", tutor: "看老师", frensei: "每次回复" },
      { feature: "文化讲解", apps: "少", tutor: "有时", frensei: "内置" },
      { feature: "课后练习", apps: "有", tutor: "无", frensei: "AI 教练 24/7" },
    ],
    founderTitle: "听腻教科书日语的日本人做的",
    founderBody:
      "作为日本人，我每天听到学习者的教科书式日语。Frensei 为场景、敬语、有人味的日语而做。",
    founderNote: "公开测试 — 根据反馈每周迭代。",
    featureChatTitle: "以聊天为主的教练",
    featureChatBody: "含义、文化、润色表达——什么都可以问。老师像教练一样回答。",
    featureCultureTitle: "文化一并讲解",
    featureCultureBody: "每个表达都附带人际关系、工作和日常生活的语境。",
    featureWordbookTitle: "你的单词本",
    featureWordbookBody: "从聊天中保存单词，建立符合水平和主题的词库。",
    popularGuidesTitle: "热门表达指南",
    popularGuidesSubtitle: "先看指南打基础，再向老师深入提问。",
    viewAll: "查看全部 →",
    ctaTitle: "教科书日语，到此为止。",
    ctaBody: "分享给学日语的朋友 — 或先自己试 3 条消息。",
    createAccount: "免费试 3 条消息 — 无需注册",
    footerShareLine: "别再说教科书日语。分享 Frensei。",
    footerShareCta: "免费试 3 条消息",
    tryPageTitle: "免费试 3 条消息",
    tryPageBody: "无需注册。问任何表达或粘贴日语 — 几秒内有回复。",
    loading: "加载中…",
  },
};

export function getMarketingCopy(lang: Lang): MarketingCopy {
  return MARKETING_COPY[lang] ?? MARKETING_COPY.en;
}
