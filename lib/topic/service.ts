import { generateRecordId, getStorage } from "@/src/features/records/storage/helpers";
import type { TopicFeedback, TopicPracticeResult, TopicPrompt } from "@/lib/topic/types";

const RESULTS_KEY = "frensei:topic:results:v1";

export const TOPIC_PROMPTS: TopicPrompt[] = [
  {
    id: "apology_late",
    title: "Apologizing politely",
    dailyQuestion: "How do you apologize?",
    prompt: "How would you apologize in Japanese if you are late for a meeting?",
    category: "apology",
    difficulty: "beginner",
  },
  {
    id: "asking_help_polite",
    title: "Asking for help",
    prompt: "How would you ask someone for help politely in Japanese?",
    category: "asking_help",
    difficulty: "beginner",
  },
  {
    id: "restaurant_spicy",
    title: "Restaurant conversation",
    prompt: "How would you ask if this dish is spicy?",
    category: "restaurant",
    difficulty: "beginner",
  },
  {
    id: "self_intro",
    title: "Self introduction",
    prompt: "How would you introduce yourself in a simple and natural way?",
    category: "self_introduction",
    difficulty: "beginner",
  },
  {
    id: "shopping_price",
    title: "Shopping",
    prompt: "How would you ask the price of an item politely?",
    category: "shopping",
    difficulty: "beginner",
  },
];

function readAll(): TopicPracticeResult[] {
  try {
    const raw = getStorage().getItem(RESULTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as TopicPracticeResult[];
  } catch {
    return [];
  }
}

function writeAll(rows: TopicPracticeResult[]): void {
  try {
    getStorage().setItem(RESULTS_KEY, JSON.stringify(rows));
  } catch {
    /* ignore */
  }
}

export function saveTopicPracticeResult(
  userId: string,
  sessionId: string,
  topicId: string,
  feedback: TopicFeedback,
  userAnswer: string,
): TopicPracticeResult {
  const row: TopicPracticeResult = {
    id: generateRecordId("topic_result"),
    userId,
    sessionId,
    topicId,
    userAnswer,
    correctedAnswer: feedback.correctedAnswer,
    explanation: feedback.explanation,
    alternativeExamples: feedback.alternativeExamples,
    createdAt: new Date().toISOString(),
  };
  const all = readAll();
  all.unshift(row);
  writeAll(all);
  return row;
}

export function listTopicPracticeResultsByUser(userId: string): TopicPracticeResult[] {
  return readAll().filter((r) => r.userId === userId);
}

function extractJson(text: string): Record<string, unknown> | null {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    return JSON.parse(m[0]) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function fallback(userAnswer: string): TopicFeedback {
  const cleaned = userAnswer.trim();
  const corrected =
    cleaned.length > 0
      ? cleaned.replace(/\?$/, "")
      : "すみません、遅れてしまいました。";
  return {
    correctedAnswer: corrected,
    explanation: "語尾を丁寧にすると、より自然でやわらかく伝わります。",
    alternativeExamples: [
      "申し訳ありません、遅れてしまいました。",
      "すみません、少し遅れました。",
      "お待たせしてしまい、すみません。",
    ],
    encouragement: "Good effort. This is a more natural and polite version.",
    otherLearnerExamples: [
      "本日はご迷惑をおかけして申し訳ございません。",
      "遅刻してしまい、心よりお詫び申し上げます。",
      "急な用事が入り、遅れてしまいました。すみません。",
    ],
  };
}

export async function generateTopicFeedback(
  topic: TopicPrompt,
  userAnswer: string,
  language: "ja" | "en" | "ko" | "zh",
): Promise<TopicFeedback> {
  try {
    const instruction = [
      "You are a Japanese coach.",
      "Return ONLY valid JSON (no markdown).",
      "JSON schema:",
      '{"correctedAnswer":"...","explanation":"...","alternativeExamples":["...","..."],"encouragement":"...","otherLearnerExamples":["...","...","..."]}',
      "Rules:",
      "- concise",
      "- 2 or 3 alternativeExamples: natural Japanese for the SAME topic (not translations of the user line only)",
      "- otherLearnerExamples: exactly 3 short plausible Japanese sentences other learners might write for this topic (fictional peers; varied politeness levels)",
      "- encouragement: one short line in the learner UI language (" + language + ")",
      `Topic title: ${topic.title}`,
      `Topic prompt: ${topic.prompt}`,
      `Learner answer: ${userAnswer}`,
    ].join("\n");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        tone: "neutral",
        language,
        messages: [{ role: "user", content: instruction }],
      }),
    });

    if (!res.ok || !res.body) return fallback(userAnswer);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let text = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (!value) continue;
      text += decoder.decode(value);
    }

    const parsed = extractJson(text);
    if (!parsed) return fallback(userAnswer);

    const correctedAnswer =
      typeof parsed.correctedAnswer === "string" && parsed.correctedAnswer.trim()
        ? parsed.correctedAnswer.trim()
        : fallback(userAnswer).correctedAnswer;
    const explanation =
      typeof parsed.explanation === "string" && parsed.explanation.trim()
        ? parsed.explanation.trim()
        : fallback(userAnswer).explanation;
    const encouragement =
      typeof parsed.encouragement === "string" && parsed.encouragement.trim()
        ? parsed.encouragement.trim()
        : fallback(userAnswer).encouragement;
    const alternativeExamples = Array.isArray(parsed.alternativeExamples)
      ? parsed.alternativeExamples
          .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
          .slice(0, 3)
      : fallback(userAnswer).alternativeExamples;

    const otherLearnerExamples = Array.isArray(parsed.otherLearnerExamples)
      ? parsed.otherLearnerExamples
          .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
          .slice(0, 3)
      : fallback(userAnswer).otherLearnerExamples;
    const peers =
      otherLearnerExamples.length >= 3
        ? otherLearnerExamples
        : fallback(userAnswer).otherLearnerExamples;

    return {
      correctedAnswer,
      explanation,
      alternativeExamples:
        alternativeExamples.length > 0
          ? alternativeExamples
          : fallback(userAnswer).alternativeExamples,
      encouragement,
      otherLearnerExamples: peers,
    };
  } catch {
    return fallback(userAnswer);
  }
}
