import { TOPIC_PROMPTS } from "@/lib/topic/service";
import type { TopicPrompt } from "@/lib/topic/types";

/** Stable per calendar day (local) so "Today's Topic" does not change on every refresh. */
export function getTodaysTopicPrompt(date: Date = new Date()): TopicPrompt {
  const seed = date.toDateString();
  const idx = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % TOPIC_PROMPTS.length;
  return TOPIC_PROMPTS[idx]!;
}
