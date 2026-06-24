import type { Lang } from "@/src/utils/i18n/types";

export type FeedbackCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  privacyLink: string;
  backHome: string;
  nameLabel: string;
  namePlaceholder: string;
  commentLabel: string;
  commentPlaceholder: string;
  submit: string;
  submitting: string;
  thanks: string;
  thanksTitle: string;
  thanksBody: string;
  sendAnother: string;
  formTitle: string;
  formIntro: string;
  networkError: string;
  errorGeneric: string;
  errorSheetsNotConfigured: string;
  errorSheetsNotReady: string;
};

const FEEDBACK_COPY: Record<Lang, FeedbackCopy> = {
  en: {
    eyebrow: "BETA · FRENSEI",
    title: "Beta feedback",
    intro:
      "Thank you for trying Frensei beta. Tell us about bugs, confusing moments, and ideas that would help you sound more natural in Japanese. We use your comments to improve the app.",
    privacyLink: "Privacy policy",
    backHome: "Back to Home",
    nameLabel: "Name (optional)",
    namePlaceholder: "How should we call you?",
    commentLabel: "Your feedback",
    commentPlaceholder: "What worked well? What was confusing? What should we build next?",
    submit: "Send feedback",
    submitting: "Sending…",
    thanks: "Thank you! Your feedback helps us improve Frensei.",
    thanksTitle: "Thank you",
    thanksBody: "Your feedback was saved. We read every comment to improve Frensei.",
    sendAnother: "Send another comment",
    formTitle: "Send feedback",
    formIntro: "Your comment goes straight to our team spreadsheet. No email or external form needed.",
    networkError: "Network error. Check your connection and try again.",
    errorGeneric: "Could not save your feedback. Please try again in a moment.",
    errorSheetsNotConfigured:
      "Feedback recording is not configured yet. Please set FEEDBACK_SHEETS_WEBHOOK_URL on the server.",
    errorSheetsNotReady:
      "The Google Apps Script webhook is not ready yet. Paste scripts/google-apps-script-feedback.gs into Apps Script, then create a new web app deployment.",
  },
  ja: {
    eyebrow: "BETA · FRENSEI",
    title: "ベータ版フィードバック",
    intro:
      "Frensei ベータ版をお試しいただきありがとうございます。不具合、わかりにくかった点、より自然な日本語のために欲しい機能などをお聞かせください。",
    privacyLink: "プライバシーポリシー",
    backHome: "ホームへ戻る",
    nameLabel: "お名前（任意）",
    namePlaceholder: "お呼びする名前",
    commentLabel: "フィードバック",
    commentPlaceholder: "良かった点、わかりにくかった点、次に欲しい機能など",
    submit: "送信する",
    submitting: "送信中…",
    thanks: "ありがとうございます！フィードバックは改善に活用します。",
    thanksTitle: "ありがとうございます",
    thanksBody: "フィードバックを保存しました。すべてのコメントを読み、Frensei の改善に活かします。",
    sendAnother: "もう一条送る",
    formTitle: "フィードバックを送る",
    formIntro: "コメントはチームのスプレッドシートに直接届きます。メールや外部フォームは不要です。",
    networkError: "ネットワークエラーです。接続を確認してからもう一度お試しください。",
    errorGeneric: "フィードバックを保存できませんでした。しばらくしてからもう一度お試しください。",
    errorSheetsNotConfigured:
      "フィードバックの記録がまだ設定されていません。サーバー側で FEEDBACK_SHEETS_WEBHOOK_URL を設定してください。",
    errorSheetsNotReady:
      "Google Apps Script の Webhook がまだ準備できていません。scripts/google-apps-script-feedback.gs を Apps Script に貼り付け、Web アプリとして再デプロイしてください。",
  },
  ko: {
    eyebrow: "BETA · FRENSEI",
    title: "베타 피드백",
    intro:
      "Frensei 베타를 이용해 주셔서 감사합니다. 버그, 헷갈렸던 점, 더 자연스러운 일본어를 위한 아이디어를 알려주세요.",
    privacyLink: "개인정보 처리방침",
    backHome: "홈으로",
    nameLabel: "이름 (선택)",
    namePlaceholder: "어떻게 불러드릴까요?",
    commentLabel: "피드백",
    commentPlaceholder: "좋았던 점, 헷갈렸던 점, 다음에 원하는 기능 등",
    submit: "보내기",
    submitting: "전송 중…",
    thanks: "감사합니다! 피드백은 개선에 활용됩니다.",
    thanksTitle: "감사합니다",
    thanksBody: "피드백이 저장되었습니다. 모든 의견을 읽고 Frensei 개선에 반영합니다.",
    sendAnother: "다른 의견 보내기",
    formTitle: "피드백 보내기",
    formIntro: "댓글은 팀 스프레드시트로 바로 전달됩니다. 이메일이나 외부 양식이 필요 없습니다.",
    networkError: "네트워크 오류입니다. 연결을 확인한 후 다시 시도해 주세요.",
    errorGeneric: "피드백을 저장할 수 없습니다. 잠시 후 다시 시도해 주세요.",
    errorSheetsNotConfigured:
      "피드백 기록이 아직 설정되지 않았습니다. 서버에서 FEEDBACK_SHEETS_WEBHOOK_URL을 설정해 주세요.",
    errorSheetsNotReady:
      "Google Apps Script Webhook이 아직 준비되지 않았습니다. scripts/google-apps-script-feedback.gs를 Apps Script에 붙여넣고 웹 앱으로 배포해 주세요.",
  },
  zh: {
    eyebrow: "BETA · FRENSEI",
    title: "测试版反馈",
    intro:
      "感谢试用 Frensei 测试版。请告诉我们错误、困惑之处，以及帮助你更自然说日语的想法。",
    privacyLink: "隐私政策",
    backHome: "返回首页",
    nameLabel: "姓名（可选）",
    namePlaceholder: "我们如何称呼您？",
    commentLabel: "您的反馈",
    commentPlaceholder: "哪些做得好？哪些令人困惑？希望下一步增加什么？",
    submit: "发送反馈",
    submitting: "发送中…",
    thanks: "谢谢！您的反馈将帮助我们改进 Frensei。",
    thanksTitle: "谢谢",
    thanksBody: "反馈已保存。我们会阅读每一条评论以改进 Frensei。",
    sendAnother: "再发一条",
    formTitle: "发送反馈",
    formIntro: "您的评论将直接进入团队表格，无需邮件或外部表单。",
    networkError: "网络错误。请检查连接后重试。",
    errorGeneric: "无法保存反馈。请稍后再试。",
    errorSheetsNotConfigured: "反馈记录尚未配置。请在服务器上设置 FEEDBACK_SHEETS_WEBHOOK_URL。",
    errorSheetsNotReady:
      "Google Apps Script Webhook 尚未就绪。请将 scripts/google-apps-script-feedback.gs 粘贴到 Apps Script 并部署为 Web 应用。",
  },
};

export function getFeedbackCopy(lang: Lang): FeedbackCopy {
  return FEEDBACK_COPY[lang] ?? FEEDBACK_COPY.en;
}

export function feedbackErrorMessage(code: string | undefined, lang: Lang): string {
  const c = getFeedbackCopy(lang);
  if (code === "sheets_not_configured") return c.errorSheetsNotConfigured;
  if (code === "sheets_script_not_ready") return c.errorSheetsNotReady;
  return c.errorGeneric;
}
