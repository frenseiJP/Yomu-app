"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { getLangClient } from "@/src/utils/i18n/clientLang";
import { getStoredUiTheme } from "@/src/utils/theme/theme";
import { useVocabularyUserId } from "@/lib/vocabulary/useVocabularyUserId";
import { logBetaEvent } from "@/lib/analytics/client";
import { guessCorrectedSentence } from "@/lib/save-candidates/guess-correction";
import { SaveCandidateList } from "@/components/save-candidates/SaveCandidateList";
import { recommendCandidatesForMessage, saveCandidateToVocabulary } from "@/lib/save-candidates/service";
import type { SaveCandidate } from "@/lib/save-candidates/types";
import { TOPIC_PROMPTS, generateTopicFeedback, saveTopicPracticeResult } from "@/lib/topic/service";
import type { TopicFeedback, TopicPrompt } from "@/lib/topic/types";

function buildAssistantBlob(feedback: TopicFeedback): string {
  return [feedback.correctedAnswer, feedback.explanation, ...feedback.alternativeExamples].join("\n");
}

function nextTopic(topics: TopicPrompt[], currentId: string): TopicPrompt {
  if (topics.length === 0) throw new Error("Missing topics");
  const idx = topics.findIndex((t) => t.id === currentId);
  const next = idx < 0 ? 0 : (idx + 1) % topics.length;
  return topics[next]!;
}

export default function TopicPracticePage() {
  const userId = useVocabularyUserId();
  const appLang = getLangClient();
  const isLightTheme = getStoredUiTheme() === "light";
  const topics = TOPIC_PROMPTS;
  const [topic, setTopic] = useState<TopicPrompt>(topics[0]!);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<TopicFeedback | null>(null);
  const [saveCandidates, setSaveCandidates] = useState<SaveCandidate[]>([]);

  const cardClass = useMemo(
    () =>
      isLightTheme
        ? "rounded-3xl border border-neutral-200 bg-white shadow-sm"
        : "rounded-3xl border border-slate-800/80 bg-slate-950/80 shadow-[0_18px_56px_rgba(0,0,0,0.55)]",
    [isLightTheme],
  );

  const resetForNext = useCallback((next: TopicPrompt) => {
    setTopic(next);
    setAnswer("");
    setError(null);
    setFeedback(null);
    setSaveCandidates([]);
  }, []);

  const onSubmit = useCallback(async () => {
    const text = answer.trim();
    if (!text || loading) return;
    setLoading(true);
    setError(null);
    try {
      const fb = await generateTopicFeedback(topic, text, appLang === "ja" || appLang === "ko" || appLang === "zh" ? appLang : "en");
      setFeedback(fb);
      saveTopicPracticeResult(userId, "topic_page", topic.id, fb, text);
      void logBetaEvent({
        eventType: "topic_submit",
        userId,
        sessionId: "topic_page",
        route: "/topic",
        metadata: {
          topicId: topic.id,
          answerLength: text.length,
        },
      });
      const assistantBlob = buildAssistantBlob(fb);
      const corrected = fb.correctedAnswer.trim() || guessCorrectedSentence(text, assistantBlob) || fb.correctedAnswer;
      const candidates = recommendCandidatesForMessage(
        {
          aiMessageContent: assistantBlob,
          userMessageContent: text,
          correctedSentence: corrected,
          messageId: `topic_page_${Date.now()}`,
          sessionId: "topic_page",
        },
        userId,
      );
      setSaveCandidates(candidates);
    } catch {
      setError("Could not generate feedback. You can try another answer.");
    } finally {
      setLoading(false);
    }
  }, [answer, appLang, loading, topic, userId]);

  return (
    <main className="mx-auto min-h-[100dvh] w-full max-w-2xl overflow-x-hidden px-4 py-5 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] sm:px-6 sm:py-8 lg:max-w-3xl lg:px-8">
      <div className="mb-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200">
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>
      </div>

      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-100">Topic Practice</h1>
        <p className="mt-1 text-sm text-slate-400">Practice expressing yourself naturally in Japanese.</p>
      </header>

      <section className={`${cardClass} p-4 sm:p-5`}>
        <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Topic</p>
        <h2 className="mt-1 text-lg font-medium text-slate-100">{topic.title}</h2>
        <p className="mt-2 text-sm text-slate-300">{topic.prompt}</p>

        <label className="mt-4 block text-xs font-medium text-slate-300">Your Japanese answer</label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={4}
          placeholder="Write your answer in Japanese…"
          disabled={loading}
          className="mt-2 w-full resize-none rounded-2xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-wa-ruri focus:outline-none focus:ring-1 focus:ring-wa-ruri/60"
        />

        {error ? <p className="mt-2 text-xs text-rose-400">{error}</p> : null}

        <button
          type="button"
          onClick={() => void onSubmit()}
          disabled={!answer.trim() || loading}
          className="mt-3 rounded-xl bg-wa-ruri px-4 py-2.5 text-sm font-medium text-slate-50 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          {loading ? "Getting feedback…" : "Submit"}
        </button>
      </section>

      {feedback ? (
        <section className={`${cardClass} mt-4 space-y-4 p-4 sm:p-5`}>
          <div className="flex items-center gap-2 text-wa-ruri">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.14em]">Feedback</span>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400">Your answer</p>
            <p className="mt-1 text-sm text-slate-200">{answer.trim()}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Better</p>
            <p className="mt-1 text-sm text-emerald-300">{feedback.correctedAnswer}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Why</p>
            <p className="mt-1 text-sm text-slate-300">{feedback.explanation}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Other natural examples</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-300">
              {feedback.alternativeExamples.map((ex) => (
                <li key={ex}>{ex}</li>
              ))}
            </ul>
          </div>

          <SaveCandidateList
            candidates={saveCandidates}
            onSave={(cand) => {
              saveCandidateToVocabulary(cand, userId);
              void logBetaEvent({
                eventType: "vocabulary_save",
                userId,
                sessionId: "topic_page",
                route: "/topic",
                metadata: {
                  source: "topic_candidate",
                  candidateType: cand.type,
                },
              });
              setSaveCandidates((prev) =>
                prev.map((it) => (it.id === cand.id ? { ...it, alreadySaved: true } : it)),
              );
            }}
          />

          <button
            type="button"
            onClick={() => resetForNext(nextTopic(topics, topic.id))}
            className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-900"
          >
            Try another topic
          </button>
        </section>
      ) : null}
    </main>
  );
}
