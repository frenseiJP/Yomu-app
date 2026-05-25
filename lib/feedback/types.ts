export type BetaFeedbackSource = "chat" | "topic" | "vocabulary" | "general";

export type BetaFeedback = {
  id: string;
  userId: string;
  source: BetaFeedbackSource;
  helpful: boolean | null;
  message: string | null;
  sessionId?: string;
  createdAt: string;
  appVersion?: string;
};

export type BetaFeedbackPromptState = {
  lastShownAt: string | null;
  submittedCount: number;
  dismissedCount: number;
};
