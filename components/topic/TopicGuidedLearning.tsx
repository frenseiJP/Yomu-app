"use client";

import { useCallback, useMemo, useState } from "react";
import { Sparkles, Users } from "lucide-react";
import { guessCorrectedSentence } from "@/lib/save-candidates/guess-correction";
import { recommendCandidatesForMessage, saveCandidateToVocabulary } from "@/lib/save-candidates/service";
import type { SaveCandidate } from "@/lib/save-candidates/types";
import {
  generateTopicFeedback,
  saveTopicPracticeResult,
} from "@/lib/topic/service";
import { getTodaysTopicPrompt } from "@/lib/topic/todaysTopic";
import type { TopicFeedback } from "@/lib/topic/types";

function buildSyntheticAssistantText(f: TopicFeedback): string {
  return [
    f.correctedAnswer,
    f.explanation,
    ...f.alternativeExamples,
    f.encouragement,
  ]
    .filter((s) => s.trim().length > 0)
    .join("\n");
}

type Props = {
  userId: string;
  appLang: "ja" | "en" | "ko" | "zh";
  isLightTheme: boolean;
  onPracticeSaved?: () => void;
};

export default function TopicGuidedLearning({
  userId,
  appLang,
  isLightTheme,
  onPracticeSaved,
}: Props) {
  const topic = useMemo(() => getTodaysTopicPrompt(), []);
  const heroLine = topic.dailyQuestion ?? topic.prompt;

  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<TopicFeedback | null>(null);
  const [saveCandidates, setSaveCandidates] = useState<SaveCandidate[]>([]);

  const resetAnswer = useCallback(() => {
    setFeedback(null);
    setSaveCandidates([]);
    setError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    const text = draft.trim();
    if (!text || loading) return;
    setLoading(true);
    setError(null);
    try {
      const fb = await generateTopicFeedback(topic, text, appLang);
      const id = `topic_turn_${Date.now()}`;
      setFeedback(fb);
      saveTopicPracticeResult(userId, "topic_guided_tab", topic.id, fb, text);
      const assistantBlob = buildSyntheticAssistantText(fb);
      const corrected =
        fb.correctedAnswer.trim() || guessCorrectedSentence(text, assistantBlob) || fb.correctedAnswer;
      const candidates = recommendCandidatesForMessage(
        {
          aiMessageContent: [assistantBlob, ...fb.otherLearnerExamples].join("\n"),
          userMessageContent: text,
          correctedSentence: corrected,
          messageId: id,
          sessionId: "topic_guided_tab",
        },
        userId,
      );
      setSaveCandidates(candidates);
      onPracticeSaved?.();
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [appLang, draft, loading, onPracticeSaved, topic, userId]);

  const card = isLightTheme
    ? "rounded-3xl border border-neutral-200 bg-white shadow-sm"
    : "rounded-3xl border border-slate-800/80 bg-slate-950/80 shadow-[0_22px_80px_rgba(0,0,0,0.9)] backdrop-blur-xl";
  const label = isLightTheme ? "text-[11px] font-medium text-neutral-700" : "text-[11px] font-medium text-slate-300";
  const muted = isLightTheme ? "text-neutral-500" : "text-slate-500";
  const body = isLightTheme ? "text-neutral-900" : "text-slate-100";
  const sub = isLightTheme ? "text-neutral-600" : "text-slate-300";

  return (
    <div className="mx-auto flex h-full max-w-lg flex-1 flex-col gap-4 overflow-y-auto px-3 py-4 sm:gap-5 sm:px-5 sm:py-6">
      <header className="space-y-1">
        <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${muted}`}>Today&apos;s Topic</p>
        <h1 className={`font-wa-serif text-lg font-semibold leading-snug sm:text-xl ${body}`}>
          <span className="text-wa-ruri">&ldquo;</span>
          {heroLine}
          <span className="text-wa-ruri">&rdquo;</span>
        </h1>
        <p className={`text-[11px] sm:text-xs ${muted}`}>{topic.title}</p>
      </header>

      <section className={`${card} p-4 sm:p-5`}>
        <label className={label}>Your answer (Japanese)</label>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={4}
          disabled={loading}
          placeholder="Write in Japanese…"
          className={`mt-2 w-full resize-none rounded-2xl border px-3 py-2.5 text-[13px] placeholder:text-slate-500 focus:border-wa-ruri focus:outline-none focus:ring-1 focus:ring-wa-ruri/60 ${
            isLightTheme
              ? "border-neutral-200 bg-neutral-50 text-neutral-900"
              : "border-slate-800 bg-slate-950/60 text-slate-100"
          }`}
        />
        {error ? <p className="mt-2 text-[11px] text-rose-400">{error}</p> : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={loading || !draft.trim()}
            onClick={() => void handleSubmit()}
            className="btn-wa-hover btn-wa-hover-ruri inline-flex items-center justify-center rounded-xl bg-wa-ruri px-4 py-2.5 text-[12px] font-medium text-slate-50 shadow-glass disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {loading ? "Getting feedback…" : "Get feedback"}
          </button>
          {feedback ? (
            <button
              type="button"
              onClick={resetAnswer}
              className={`rounded-xl border px-4 py-2.5 text-[12px] font-medium ${
                isLightTheme
                  ? "border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                  : "border-slate-700 text-slate-300 hover:bg-slate-900"
              }`}
            >
              Write another answer
            </button>
          ) : null}
        </div>
      </section>

      {loading ? (
        <p className={`text-center text-[12px] ${muted}`}>Coach is reading your answer…</p>
      ) : null}

      {feedback ? (
        <>
          <section className={`${card} space-y-4 p-4 sm:p-5`}>
            <div className="flex items-center gap-2 text-wa-ruri">
              <Sparkles className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">Coach feedback</span>
            </div>
            <p className={`text-[13px] leading-relaxed ${sub}`}>{feedback.encouragement}</p>
            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-wider ${muted}`}>Correction</p>
              <p
                className={`mt-1 text-[14px] font-medium leading-relaxed ${
                  isLightTheme ? "text-emerald-800" : "text-emerald-300"
                }`}
              >
                {feedback.correctedAnswer}
              </p>
            </div>
            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-wider ${muted}`}>Explanation</p>
              <p className={`mt-1 text-[13px] leading-relaxed ${sub}`}>{feedback.explanation}</p>
            </div>
            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-wider ${muted}`}>More examples</p>
              <ul className={`mt-2 list-inside list-disc space-y-1.5 text-[13px] leading-relaxed ${sub}`}>
                {feedback.alternativeExamples.map((ex) => (
                  <li key={ex}>{ex}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className={`${card} space-y-3 p-4 sm:p-5`}>
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="h-4 w-4 text-slate-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">Other learners</span>
            </div>
            <p className={`text-[10px] ${muted}`}>Example sentences (illustrative)</p>
            <ul className="space-y-2">
              {feedback.otherLearnerExamples.map((line, i) => (
                <li
                  key={`${i}-${line.slice(0, 12)}`}
                  className={`rounded-xl border border-slate-800/60 bg-slate-900/40 px-3 py-2 text-[13px] leading-relaxed text-slate-200 ${
                    isLightTheme ? "border-neutral-200 bg-neutral-50 text-neutral-800" : ""
                  }`}
                >
                  {line}
                </li>
              ))}
            </ul>
          </section>

          {saveCandidates.length > 0 ? (
            <section
              className={`${card} space-y-2.5 p-4 sm:p-5 ${
                isLightTheme ? "border-neutral-200 bg-white" : "border-slate-800/80 bg-yomu-glass/80"
              }`}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Recommended to save
              </p>
              {saveCandidates.map((cand) => (
                <div
                  key={cand.id}
                  className={`rounded-lg border px-2.5 py-2 ${
                    isLightTheme ? "border-neutral-200 bg-neutral-50" : "border-slate-700/70 bg-slate-900/70"
                  }`}
                >
                  <p className="text-[10px] font-semibold text-slate-400">{cand.label}</p>
                  <p className="mt-0.5 text-[12px] text-slate-100">{cand.primaryText}</p>
                  {cand.secondaryText ? (
                    <p className="mt-0.5 text-[10px] text-slate-400">{cand.secondaryText}</p>
                  ) : null}
                  {cand.explanation ? (
                    <p className="mt-0.5 text-[10px] text-slate-500">{cand.explanation}</p>
                  ) : null}
                  <button
                    type="button"
                    disabled={cand.alreadySaved}
                    onClick={() => {
                      saveCandidateToVocabulary(cand, userId);
                      setSaveCandidates((prev) =>
                        prev.map((c2) => (c2.id === cand.id ? { ...c2, alreadySaved: true } : c2)),
                      );
                    }}
                    className="mt-2 rounded-md border border-wa-ruri/50 bg-wa-ruri/20 px-2.5 py-1 text-[10px] font-medium text-slate-100 disabled:border-slate-700 disabled:bg-slate-800/70 disabled:text-slate-500"
                  >
                    {cand.alreadySaved ? "Saved" : "Save"}
                  </button>
                </div>
              ))}
            </section>
          ) : null}
        </>
      ) : null}

      <div className="h-4 shrink-0" aria-hidden />
    </div>
  );
}
