"use client";

import type { TopicPrompt } from "@/lib/topic/types";

type Mode = "entry" | "topic_list";

type Props = {
  mode: Mode;
  topics: TopicPrompt[];
  isLightTheme?: boolean;
  onDailyMission: () => void;
  onTopicPractice: () => void;
  onPracticeTodaysScenario?: () => void;
  onFreeChat: () => void;
  onSelectTopic: (topic: TopicPrompt) => void;
  onContinueLast: () => void;
  showContinueLast?: boolean;
};

export default function TopicSelector({
  mode,
  topics,
  isLightTheme = false,
  onDailyMission,
  onTopicPractice,
  onPracticeTodaysScenario,
  onFreeChat,
  onSelectTopic,
  onContinueLast,
  showContinueLast = false,
}: Props) {
  const panel = isLightTheme
    ? "border-neutral-200/90 bg-neutral-50/95"
    : "border-slate-800/70 bg-slate-950/70";
  const title = isLightTheme ? "text-neutral-800" : "text-slate-300";
  const muted = isLightTheme ? "text-neutral-500" : "text-slate-500";
  const chip = isLightTheme
    ? "border-neutral-300 bg-white text-neutral-800"
    : "border-slate-700 bg-slate-900/80 text-slate-200";
  const chipMuted = isLightTheme
    ? "border-neutral-300 bg-white text-neutral-700"
    : "border-slate-700 bg-slate-900 text-slate-300";

  if (mode === "entry") {
    return (
      <div className={`mb-3 rounded-xl border p-3 ${panel}`}>
        <p className={`mb-1 text-xs font-medium ${title}`}>Ready to practice?</p>
        <p className={`mb-2 text-[11px] ${muted}`}>
          One best next step: continue your conversation with Sensei.
        </p>
        <div className="flex flex-wrap gap-2">
          {showContinueLast ? (
            <button
              type="button"
              onClick={onContinueLast}
              className="min-h-[40px] rounded-full bg-wa-ruri px-3.5 py-2 text-xs font-medium text-white"
            >
              Continue chat
            </button>
          ) : (
            <button
              type="button"
              onClick={onFreeChat}
              className="min-h-[40px] rounded-full bg-wa-ruri px-3.5 py-2 text-xs font-medium text-white"
            >
              Start chat
            </button>
          )}
          {onPracticeTodaysScenario ? (
            <button
              type="button"
              onClick={onPracticeTodaysScenario}
              className={`min-h-[40px] rounded-full border px-3 py-2 text-xs font-medium ${chip}`}
            >
              Today&apos;s scenario
            </button>
          ) : null}
          <button
            type="button"
            onClick={onTopicPractice}
            className={`min-h-[40px] rounded-full border px-3 py-2 text-xs ${chipMuted}`}
          >
            More scenarios
          </button>
          <button
            type="button"
            onClick={onDailyMission}
            className={`min-h-[40px] rounded-full border px-3 py-2 text-xs ${chipMuted}`}
          >
            Daily mission
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-3 rounded-xl border p-3 ${panel}`}>
      <p className={`mb-2 text-xs font-medium ${title}`}>What do you want to practice today?</p>
      <div className="flex flex-wrap gap-2">
        {topics.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelectTopic(t)}
            className={`rounded-full border px-3 py-1.5 text-xs ${chip}`}
          >
            {t.title}
          </button>
        ))}
      </div>
    </div>
  );
}
