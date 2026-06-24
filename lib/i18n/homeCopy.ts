import type { Lang } from "@/src/utils/i18n/types";

export type HomeCopy = {
  nextStepLabel: string;
  nextStepTitle: string;
  nextStepBody: string;
  continueChat: string;
  startChatting: string;
  reviewsWaiting: (n: number) => string;
  reviewsDesc: string;
  openArrow: string;
  todaysScenario: string;
  practiceInChat: string;
  today: string;
  startMission: string;
  focusPrefix: string;
  practiceFocus: string;
  openChatHint: string;
  coachNotes: string;
  recentWins: string;
  recentWinsEmpty: string;
  weeklyCoachSummary: string;
  dailyReflection: string;
  startReflection: string;
  starterPrompts: string;
  niceWork: string;
  viewPlans: string;
  ok: string;
  guestTrialReady: string;
  guestTrialHint: string;
};

const COPY: Record<Lang, HomeCopy> = {
  en: {
    nextStepLabel: "Your next step",
    nextStepTitle: "Write with Sensei",
    nextStepBody: "Type in Japanese or English — get a natural correction and a short why.",
    continueChat: "Continue chat",
    startChatting: "Start chatting",
    reviewsWaiting: (n) => `${n} review${n === 1 ? "" : "s"} waiting`,
    reviewsDesc: "Quick cloze from your saved corrections",
    openArrow: "Open →",
    todaysScenario: "Today's scenario",
    practiceInChat: "Practice in Chat",
    today: "Today",
    startMission: "Start mission",
    focusPrefix: "Focus:",
    practiceFocus: "Practice with Sensei →",
    openChatHint: "Open chat to start today's practice.",
    coachNotes: "Coach notes",
    recentWins: "Recent wins",
    recentWinsEmpty: "No wins yet. Complete a mission to start building momentum.",
    weeklyCoachSummary: "Your coach noticed…",
    dailyReflection: "Daily reflection",
    startReflection: "Try in chat →",
    starterPrompts: "Try asking",
    niceWork: "Nice work 🌸",
    viewPlans: "View plans",
    ok: "OK",
    guestTrialReady: "Your trial chat is ready",
    guestTrialHint: "Keep the conversation going — ask a follow-up below.",
  },
  ja: {
    nextStepLabel: "次のステップ",
    nextStepTitle: "Sensei と書いてみる",
    nextStepBody: "日本語でも英語でもOK。自然な言い方と短い理由を返します。",
    continueChat: "チャットを続ける",
    startChatting: "チャットを始める",
    reviewsWaiting: (n) => `復習 ${n} 件`,
    reviewsDesc: "保存した添削からクイズ復習",
    openArrow: "開く →",
    todaysScenario: "今日のシナリオ",
    practiceInChat: "チャットで練習",
    today: "今日",
    startMission: "ミッション開始",
    focusPrefix: "フォーカス:",
    practiceFocus: "Sensei と練習 →",
    openChatHint: "チャットを開いて今日の練習を始めましょう。",
    coachNotes: "コーチメモ",
    recentWins: "最近の成果",
    recentWinsEmpty: "まだ成果がありません。ミッションを完了して勢いをつけましょう。",
    weeklyCoachSummary: "コーチが気づいたこと…",
    dailyReflection: "今日の振り返り",
    startReflection: "チャットで試す →",
    starterPrompts: "こんな質問から",
    niceWork: "お疲れさま 🌸",
    viewPlans: "プランを見る",
    ok: "OK",
    guestTrialReady: "体験チャットの準備ができました",
    guestTrialHint: "会話を続けましょう — 下から質問してみてください。",
  },
  ko: {
    nextStepLabel: "다음 단계",
    nextStepTitle: "Sensei와 함께 써 보기",
    nextStepBody: "일본어나 영어로 입력하면 자연스러운 표현과 이유를 알려줘요.",
    continueChat: "채팅 이어하기",
    startChatting: "채팅 시작",
    reviewsWaiting: (n) => `복습 ${n}개`,
    reviewsDesc: "저장한 교정으로 빠른 퀴즈",
    openArrow: "열기 →",
    todaysScenario: "오늘의 시나리오",
    practiceInChat: "채팅에서 연습",
    today: "오늘",
    startMission: "미션 시작",
    focusPrefix: "집중:",
    practiceFocus: "Sensei와 연습 →",
    openChatHint: "채팅을 열어 오늘의 연습을 시작하세요.",
    coachNotes: "코치 노트",
    recentWins: "최근 성과",
    recentWinsEmpty: "아직 성과가 없어요. 미션을 완료해 리듬을 만들어 보세요.",
    weeklyCoachSummary: "코치가 알아챈 점…",
    dailyReflection: "오늘의 회고",
    startReflection: "채팅에서 시도 →",
    starterPrompts: "이런 질문으로 시작",
    niceWork: "수고했어요 🌸",
    viewPlans: "플랜 보기",
    ok: "확인",
    guestTrialReady: "체험 채팅이 준비되었습니다",
    guestTrialHint: "대화를 이어가 보세요 — 아래에서 이어서 질문해 보세요.",
  },
  zh: {
    nextStepLabel: "下一步",
    nextStepTitle: "和 Sensei 一起写",
    nextStepBody: "日语或英语都可以——获得自然表达和简短解释。",
    continueChat: "继续聊天",
    startChatting: "开始聊天",
    reviewsWaiting: (n) => `${n} 项待复习`,
    reviewsDesc: "用保存的订正做快速填空",
    openArrow: "打开 →",
    todaysScenario: "今日情景",
    practiceInChat: "在聊天中练习",
    today: "今天",
    startMission: "开始任务",
    focusPrefix: "重点:",
    practiceFocus: "和 Sensei 练习 →",
    openChatHint: "打开聊天开始今日练习。",
    coachNotes: "教练笔记",
    recentWins: "最近成果",
    recentWinsEmpty: "还没有成果。完成任务来建立学习动力吧。",
    weeklyCoachSummary: "教练注意到…",
    dailyReflection: "每日反思",
    startReflection: "在聊天中试试 →",
    starterPrompts: "可以这样问",
    niceWork: "做得好 🌸",
    viewPlans: "查看方案",
    ok: "确定",
    guestTrialReady: "体验聊天已就绪",
    guestTrialHint: "继续对话吧 — 在下方追问即可。",
  },
};

export function getHomeCopy(lang: Lang): HomeCopy {
  return COPY[lang] ?? COPY.en;
}
