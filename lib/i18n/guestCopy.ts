import type { Lang } from "@/src/utils/i18n/types";

const GUEST_COPY: Record<
  Lang,
  {
    welcome: string;
    tryTitle: string;
    turnsLeft: (n: number) => string;
    lastTurnHint: string;
    atLimitTitle: string;
    atLimitBody: string;
    atLimitCta: string;
    signInLink: string;
    placeholder: string;
    thinking: string;
    shareCopied: string;
    shareButton: string;
    errorGeneric: string;
  }
> = {
  en: {
    welcome:
      "Hi, I'm Frensei. Ask about any Japanese phrase—meaning, culture, or how to sound natural. You have 3 free messages.",
    tryTitle: "Try Frensei",
    turnsLeft: (n) =>
      `No sign-up · ${n} message${n === 1 ? "" : "s"} left${n === 1 ? " — save this chat next" : ""}`,
    lastTurnHint: "Last free message — sign up after this to save and continue your chat.",
    atLimitTitle: "Continue this conversation",
    atLimitBody:
      "Create a free account to keep chatting, save words, and pick up right where you left off.",
    atLimitCta: "Continue this chat — free",
    signInLink: "Already have an account? Sign in",
    placeholder: "Ask about a phrase or paste your Japanese…",
    thinking: "Sensei is thinking…",
    shareCopied: "Link copied!",
    shareButton: "Share this correction",
    errorGeneric: "Something went wrong. Please try again in a moment.",
  },
  ja: {
    welcome:
      "こんにちは、Frenseiです。日本語のフレーズの意味・文化・自然な言い方など、何でも聞いてください。無料で3メッセージ使えます。",
    tryTitle: "Frenseiを試す",
    turnsLeft: (n) =>
      `登録不要 · 残り${n}件${n === 1 ? " — 次は登録して会話を保存" : ""}`,
    lastTurnHint: "最後の無料メッセージです。このあと登録すると会話を保存して続けられます。",
    atLimitTitle: "この会話を続ける",
    atLimitBody: "無料アカウントを作成すると、チャットの続き・単語保存ができます。",
    atLimitCta: "無料で会話を続ける",
    signInLink: "アカウントをお持ちの方はログイン",
    placeholder: "フレーズについて聞く、または日本語を貼り付け…",
    thinking: "先生が考えています…",
    shareCopied: "リンクをコピーしました",
    shareButton: "この添削をシェア",
    errorGeneric: "エラーが発生しました。しばらくしてからもう一度お試しください。",
  },
  ko: {
    welcome:
      "안녕하세요, Frensei입니다. 일본어 표현의 의미, 문화, 자연스러운 말하기를 물어보세요. 무료 메시지 3회입니다.",
    tryTitle: "Frensei 체험",
    turnsLeft: (n) =>
      `가입 불필요 · ${n}회 남음${n === 1 ? " — 다음은 가입 후 대화 저장" : ""}`,
    lastTurnHint: "마지막 무료 메시지입니다. 가입하면 대화를 저장하고 이어갈 수 있어요.",
    atLimitTitle: "이 대화를 이어가기",
    atLimitBody: "무료 계정을 만들면 채팅, 단어 저장을 계속할 수 있습니다.",
    atLimitCta: "무료로 대화 이어가기",
    signInLink: "이미 계정이 있나요? 로그인",
    placeholder: "표현을 물어보거나 일본어를 붙여넣기…",
    thinking: "선생님이 생각 중…",
    shareCopied: "링크가 복사되었습니다",
    shareButton: "이 교정 공유하기",
    errorGeneric: "오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
  },
  zh: {
    welcome:
      "你好，我是 Frensei。可以问任何日语表达的含义、文化或自然说法。你有 3 条免费消息。",
    tryTitle: "试用 Frensei",
    turnsLeft: (n) =>
      `无需注册 · 剩余 ${n} 条${n === 1 ? " — 注册后可保存对话" : ""}`,
    lastTurnHint: "这是最后一条免费消息。注册后可保存并继续对话。",
    atLimitTitle: "继续这段对话",
    atLimitBody: "创建免费账号即可继续聊天、保存词汇。",
    atLimitCta: "免费继续对话",
    signInLink: "已有账号？登录",
    placeholder: "询问表达或粘贴日语…",
    thinking: "老师正在思考…",
    shareCopied: "链接已复制",
    shareButton: "分享这条纠正",
    errorGeneric: "出错了，请稍后再试。",
  },
};

export function getGuestCopy(lang: Lang) {
  return GUEST_COPY[lang] ?? GUEST_COPY.en;
}
