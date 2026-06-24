import type { Lang } from "@/src/utils/i18n/types";

export type ReportCopy = {
  back: string;
  printPdf: string;
  eyebrow: string;
  title: string;
  generated: string;
  beta: string;
  feedbackTitle: string;
  feedbackBody: string;
  fullFeedbackPage: string;
  backToApp: string;
  thisWeek: string;
  weekAria: string;
  weekHint: string;
  totals: string;
  currentStreak: string;
  days: string;
  chatMessages: string;
  missionsCompleted: string;
  reviewsCompleted: string;
  topicPractices: string;
  vocabSaved: string;
  learningDays: string;
  recentTopics: string;
  noTopics: string;
  footerNote: string;
};

const REPORT_COPY: Record<Lang, ReportCopy> = {
  en: {
    back: "Back",
    printPdf: "Print / Save PDF",
    eyebrow: "Learning report",
    title: "Your Frensei snapshot",
    generated: "Generated",
    beta: "Beta",
    feedbackTitle: "Share your feedback",
    feedbackBody:
      "Send impressions while you review this snapshot — bugs, ideas, what felt natural or confusing. Comments go straight to our team spreadsheet.",
    fullFeedbackPage: "Full feedback page",
    backToApp: "Back to app",
    thisWeek: "This week",
    weekAria: "Active days this week",
    weekHint: "Sun → Sat · lit days had chat, mission, or review activity",
    totals: "Totals",
    currentStreak: "Current streak",
    days: "days",
    chatMessages: "Chat messages (all time)",
    missionsCompleted: "Missions completed",
    reviewsCompleted: "Reviews completed",
    topicPractices: "Topic practices",
    vocabSaved: "Vocabulary saved (library)",
    learningDays: "Learning days recorded",
    recentTopics: "Recent topic practice",
    noTopics: "No topic sessions yet. Try the Topic tab in the app.",
    footerNote: "Data is stored on this device (local). Sign in on the same account on other devices to align IDs.",
  },
  ja: {
    back: "戻る",
    printPdf: "印刷 / PDF保存",
    eyebrow: "学習レポート",
    title: "Frensei スナップショット",
    generated: "作成日",
    beta: "ベータ",
    feedbackTitle: "ご意見・ご感想をお聞かせください",
    feedbackBody:
      "レポートを見ながら気づいたこと（使い心地、不具合、こうしてほしいことなど）をその場で送れます。内容はチームのスプレッドシートに届きます。",
    fullFeedbackPage: "フィードバック専用ページ",
    backToApp: "アプリに戻る",
    thisWeek: "今週",
    weekAria: "今週のアクティブ日",
    weekHint: "日→土 · 光っている日はチャット・ミッション・復習のいずれかあり",
    totals: "合計",
    currentStreak: "現在の連続日数",
    days: "日",
    chatMessages: "チャットメッセージ（累計）",
    missionsCompleted: "完了ミッション",
    reviewsCompleted: "完了復習",
    topicPractices: "トピック練習",
    vocabSaved: "保存語彙（ライブラリ）",
    learningDays: "記録された学習日",
    recentTopics: "最近のトピック練習",
    noTopics: "まだトピック練習がありません。アプリの Topic タブを試してください。",
    footerNote: "データはこの端末（ローカル）に保存されています。同じアカウントで他端末にサインインすると ID が揃います。",
  },
  ko: {
    back: "뒤로",
    printPdf: "인쇄 / PDF 저장",
    eyebrow: "학습 리포트",
    title: "Frensei 스냅샷",
    generated: "생성일",
    beta: "베타",
    feedbackTitle: "피드백을 공유해 주세요",
    feedbackBody:
      "리포트를 보며 느낀 점(버그, 아이디어, 자연스러웠던 점·헷갈린 점)을 바로 보낼 수 있습니다. 팀 스프레드시트로 전달됩니다.",
    fullFeedbackPage: "피드백 전용 페이지",
    backToApp: "앱으로 돌아가기",
    thisWeek: "이번 주",
    weekAria: "이번 주 활동일",
    weekHint: "일→토 · 밝은 날은 채팅·미션·복습 중 하나 이상",
    totals: "합계",
    currentStreak: "현재 연속 일수",
    days: "일",
    chatMessages: "채팅 메시지 (전체)",
    missionsCompleted: "완료한 미션",
    reviewsCompleted: "완료한 복습",
    topicPractices: "토픽 연습",
    vocabSaved: "저장 어휘 (라이브러리)",
    learningDays: "기록된 학습일",
    recentTopics: "최근 토픽 연습",
    noTopics: "아직 토픽 연습이 없습니다. 앱의 Topic 탭을 시도해 보세요.",
    footerNote: "데이터는 이 기기(로컬)에 저장됩니다. 같은 계정으로 다른 기기에 로그인하면 ID가 맞춰집니다.",
  },
  zh: {
    back: "返回",
    printPdf: "打印 / 保存 PDF",
    eyebrow: "学习报告",
    title: "你的 Frensei 快照",
    generated: "生成于",
    beta: "测试版",
    feedbackTitle: "分享你的反馈",
    feedbackBody: "查看报告时可随时发送印象——错误、建议、自然或困惑之处。评论会直接进入团队表格。",
    fullFeedbackPage: "反馈专页",
    backToApp: "返回应用",
    thisWeek: "本周",
    weekAria: "本周活跃日",
    weekHint: "日→六 · 高亮表示有聊天、任务或复习",
    totals: "总计",
    currentStreak: "当前连续天数",
    days: "天",
    chatMessages: "聊天消息（累计）",
    missionsCompleted: "已完成任务",
    reviewsCompleted: "已完成复习",
    topicPractices: "话题练习",
    vocabSaved: "已保存词汇（词库）",
    learningDays: "记录的学习日",
    recentTopics: "最近的话题练习",
    noTopics: "还没有话题练习。试试应用中的 Topic 标签。",
    footerNote: "数据保存在本设备（本地）。使用同一账户登录其他设备可对齐 ID。",
  },
};

export function getReportCopy(lang: Lang): ReportCopy {
  return REPORT_COPY[lang] ?? REPORT_COPY.en;
}

export function formatReportDateForLang(lang: Lang): string {
  const locale = lang === "ja" ? "ja-JP" : lang === "ko" ? "ko-KR" : lang === "zh" ? "zh-CN" : "en-US";
  try {
    return new Date().toLocaleDateString(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}
