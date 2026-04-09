"use client";

import { Target, Sparkles, CheckCircle2 } from "lucide-react";
import type { HabitDailyMission } from "@/lib/habit/types";
import type { PrototypeUiText } from "@/src/utils/i18n/prototypeCopy";

type Props = {
  mission: HabitDailyMission;
  ui: PrototypeUiText;
  isLightTheme: boolean;
  onToggleTask: (taskId: string) => void;
  onOpenChat: () => void;
  allComplete: boolean;
};

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
      <ol className="mt-3 list-none space-y-2.5">
        {mission.tasks.slice(0, 3).map((task, i) => (
          <li
            key={task.id}
            className={`flex flex-col gap-2 rounded-xl border px-3 py-3 text-left text-sm sm:flex-row sm:items-start sm:gap-3 ${
              isLightTheme
                ? "border-neutral-200 bg-[#f8f7f4]"
                : "border-slate-800/70 bg-slate-900/40"
            }`}
          >
            <div className="flex w-full items-start gap-2 sm:min-w-0 sm:flex-1">
              <span
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isLightTheme ? "bg-neutral-200 text-neutral-800" : "bg-slate-800 text-slate-200"
                }`}
                aria-hidden
              >
                {i + 1}
              </span>
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
                  {ui.habitTaskLabel} {i + 1} / 3
                </p>
                <p className={`mt-1 text-[13px] leading-relaxed sm:text-sm ${titleCls}`}>{task.instruction}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onToggleTask(task.id)}
              disabled={task.completed}
              className={`w-full flex-shrink-0 rounded-lg px-3 py-2 text-[11px] font-medium sm:w-auto sm:self-start ${
                task.completed
                  ? "bg-emerald-500/20 text-emerald-300"
                  : isLightTheme
                    ? "border border-neutral-300 bg-white text-neutral-700"
                    : "border border-slate-600 bg-slate-900 text-slate-200"
              }`}
            >
              {task.completed ? ui.missionCompleted : ui.habitMarkDone}
            </button>
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
