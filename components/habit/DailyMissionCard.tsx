"use client";

import { Target, Sparkles, CheckCircle2 } from "lucide-react";
import type { HabitDailyMission, MissionTask } from "@/lib/habit/types";
import type { PrototypeUiText } from "@/src/utils/i18n/prototypeCopy";

type Props = {
  mission: HabitDailyMission;
  ui: PrototypeUiText;
  isLightTheme: boolean;
  onToggleTask: (taskId: string) => void;
  onOpenChat: () => void;
  allComplete: boolean;
};

function taskTypeLabel(t: MissionTask["type"], ui: PrototypeUiText): string {
  switch (t) {
    case "speak":
      return ui.habitTaskLabel;
    case "correct":
      return ui.habitTaskLabel;
    case "recall":
      return ui.habitTaskLabel;
    case "create_sentence":
      return ui.habitTaskLabel;
    default:
      return ui.habitTaskLabel;
  }
}

export default function DailyMissionCard({
  mission,
  ui,
  isLightTheme,
  onToggleTask,
  onOpenChat,
  allComplete,
}: Props) {
  const card = isLightTheme
    ? "rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5"
    : "rounded-2xl border border-slate-800/60 bg-slate-950/80 p-4 shadow-glass backdrop-blur-xl sm:p-5";
  const titleCls = isLightTheme ? "text-neutral-900" : "text-slate-100";
  const subCls = isLightTheme ? "text-neutral-600" : "text-slate-400";

  return (
    <section className={allComplete && !isLightTheme ? `${card} border-emerald-500/40 bg-emerald-950/30` : card}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-wa-ruri" />
          <Sparkles className="h-4 w-4 text-wa-kinari/90" />
          <span
            className={`font-wa-serif text-[10px] font-semibold uppercase tracking-widest ${isLightTheme ? "text-neutral-500" : "text-slate-500"}`}
          >
            {ui.habitMissionTitle}
          </span>
        </div>
        {allComplete && (
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {ui.missionCompleted}
          </span>
        )}
      </div>
      <p className={`text-[11px] ${subCls}`}>{mission.date}</p>
      <ol className="mt-3 space-y-2">
        {mission.tasks.map((task, i) => (
          <li
            key={task.id}
            className={`flex gap-2 rounded-xl border px-3 py-2.5 text-left text-sm ${
              isLightTheme
                ? "border-neutral-200 bg-[#f8f7f4]"
                : "border-slate-800/70 bg-slate-900/40"
            }`}
          >
            <button
              type="button"
              onClick={() => onToggleTask(task.id)}
              className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border text-[10px] ${
                task.completed
                  ? "border-emerald-500/60 bg-emerald-500/20 text-emerald-300"
                  : isLightTheme
                    ? "border-neutral-300 bg-white text-neutral-400"
                    : "border-slate-600 bg-slate-900 text-slate-500"
              }`}
              aria-label={ui.habitMarkDone}
            >
              {task.completed ? "✓" : ""}
            </button>
            <div className="min-w-0 flex-1">
              <p className={`text-[10px] font-medium uppercase tracking-wide opacity-70 ${subCls}`}>
                {i + 1}. {taskTypeLabel(task.type, ui)}
              </p>
              <p className={`mt-0.5 leading-snug ${titleCls}`}>{task.instruction}</p>
            </div>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={onOpenChat}
        className="btn-wa-hover btn-wa-hover-ruri mt-4 w-full rounded-xl border border-wa-ruri/50 bg-wa-ruri/20 py-3 text-sm font-medium text-slate-100 shadow-glass hover:bg-wa-ruri/30"
      >
        {ui.habitStartMission}
      </button>
    </section>
  );
}
