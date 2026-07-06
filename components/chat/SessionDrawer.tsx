"use client";

import type { ChatSession } from "@/lib/chat/types";

type Props = {
  open: boolean;
  sessions: ChatSession[];
  activeId: string | null;
  newChatLabel: string;
  deleteLabel: string;
  isLightTheme?: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onOpenSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
};

function dateLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString();
}

export default function SessionDrawer({
  open,
  sessions,
  activeId,
  newChatLabel,
  deleteLabel,
  isLightTheme = true,
  onClose,
  onNewChat,
  onOpenSession,
  onDeleteSession,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[300]">
      <button
        type="button"
        aria-label="close"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <aside
        className={`absolute left-0 top-0 h-full w-[84%] max-w-sm border-r p-3 ${
          isLightTheme ? "border-slate-200 bg-white" : "border-slate-800 bg-slate-950"
        }`}
      >
        <button
          type="button"
          onClick={onNewChat}
          className="mb-3 w-full rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {newChatLabel}
        </button>
        <ul className="space-y-2 overflow-y-auto pb-6">
          {sessions.map((s) => (
            <li
              key={s.id}
              className={`rounded-xl border p-2.5 ${
                isLightTheme ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-900/60"
              }`}
            >
              <button type="button" onClick={() => onOpenSession(s.id)} className="w-full text-left">
                <p
                  className={`truncate text-sm ${
                    activeId === s.id
                      ? isLightTheme
                        ? "font-medium text-blue-700"
                        : "text-sky-300"
                      : isLightTheme
                        ? "text-slate-900"
                        : "text-slate-100"
                  }`}
                >
                  {s.title}
                </p>
                <p className={`mt-0.5 text-[11px] ${isLightTheme ? "text-slate-500" : "text-slate-500"}`}>
                  {dateLabel(s.updatedAt)}
                </p>
              </button>
              <button
                type="button"
                onClick={() => onDeleteSession(s.id)}
                className="mt-2 text-[11px] text-slate-500 hover:text-red-500"
              >
                {deleteLabel}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
