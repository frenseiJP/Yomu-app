"use client";

import type { TopicPrompt } from "@/lib/topic/types";

type Mode = "entry" | "topic_list";

type Props = {
  mode: Mode;
  topics: TopicPrompt[];
  onDailyMission: () => void;
  onTopicPractice: () => void;
  onFreeChat: () => void;
  onSelectTopic: (topic: TopicPrompt) => void;
  onContinueLast: () => void;
  showContinueLast?: boolean;
};

export default function TopicSelector({
  mode,
  topics,
  onDailyMission,
  onTopicPractice,
  onFreeChat,
  onSelectTopic,
  onContinueLast,
  showContinueLast = false,
}: Props) {
  if (mode === "entry") {
    return (
      <div className="mb-3 rounded-xl border border-slate-800/70 bg-slate-950/70 p-3">
        <p className="mb-1 text-xs font-medium text-slate-300">Ready to practice?</p>
        <p className="mb-2 text-[11px] text-slate-500">One best next step: continue your conversation with Sensei.</p>
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
          <button
            type="button"
            onClick={onTopicPractice}
            className="min-h-[40px] rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300"
          >
            Need structure? Topic practice
          </button>
          <button
            type="button"
            onClick={onDailyMission}
            className="min-h-[40px] rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300"
          >
            Daily mission
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3 rounded-xl border border-slate-800/70 bg-slate-950/70 p-3">
      <p className="mb-2 text-xs font-medium text-slate-300">What do you want to practice today?</p>
      <div className="flex flex-wrap gap-2">
        {topics.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelectTopic(t)}
            className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200"
          >
            {t.title}
          </button>
        ))}
      </div>
    </div>
  );
}
