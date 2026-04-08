export type TopicCategory =
  | "apology"
  | "greeting"
  | "shopping"
  | "travel"
  | "work"
  | "daily_life"
  | "self_introduction"
  | "restaurant"
  | "asking_help"
  | "other";

export type TopicDifficulty = "beginner" | "intermediate" | "advanced";

export interface TopicPrompt {
  id: string;
  title: string;
  prompt: string;
  category: TopicCategory;
  difficulty: TopicDifficulty;
}

export interface TopicPracticeResult {
  id: string;
  userId: string;
  sessionId: string;
  topicId: string;
  userAnswer: string;
  correctedAnswer: string;
  explanation: string;
  alternativeExamples: string[];
  createdAt: string;
}

export interface TopicFeedback {
  correctedAnswer: string;
  explanation: string;
  alternativeExamples: string[];
  encouragement: string;
}
