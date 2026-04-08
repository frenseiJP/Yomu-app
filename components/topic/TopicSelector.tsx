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
        <p className="mb-2 text-xs font-medium text-slate-300">Start learning 👇</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onDailyMission} className="rounded-full bg-slate-900 px-3 py-1.5 text-xs text-slate-200">Daily Mission</button>
          <button type="button" onClick={onTopicPractice} className="rounded-full bg-wa-ruri px-3 py-1.5 text-xs text-white">Topic Practice</button>
          <button type="button" onClick={onFreeChat} className="rounded-full bg-slate-900 px-3 py-1.5 text-xs text-slate-200">Free Chat</button>
          {showContinueLast && (
            <button type="button" onClick={onContinueLast} className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-300">Continue last session</button>
          )}
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
