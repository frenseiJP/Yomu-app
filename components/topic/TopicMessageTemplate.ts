import type { TopicFeedback, TopicPrompt } from "@/lib/topic/types";

export function buildTopicGuideMessage(topic: TopicPrompt): string {
  return [
    `Topic: ${topic.title}`,
    topic.prompt,
    "",
    "Write your answer in Japanese 👇",
  ].join("\n");
}

export function buildTopicFeedbackMessage(feedback: TopicFeedback): string {
  const alts = feedback.alternativeExamples.slice(0, 3).map((x) => `・${x}`).join("\n");
  return [
    `${feedback.encouragement}`,
    "",
    `Better:\n${feedback.correctedAnswer}`,
    "",
    `Why:\n${feedback.explanation}`,
    "",
    `Other examples:\n${alts}`,
    "",
    "Try again if you want 👇",
  ].join("\n");
}
