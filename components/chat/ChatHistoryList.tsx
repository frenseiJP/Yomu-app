"use client";

import { useChatHistory } from "../../hooks/useChatHistory";
import { ChatHistoryItem } from "./ChatHistoryItem";
import Link from "next/link";

export function ChatHistoryList() {
  const { sessions, loaded, removeSession } = useChatHistory();

  if (!loaded) {
    return (
      <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-8 text-center text-sm text-slate-400">
        Loading…
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-8 text-center">
        <p className="mb-2 text-sm font-medium text-slate-200">
          No chat history yet
        </p>
        <p className="mb-4 text-xs text-slate-500">
          Start a conversation in AI chat and it will show up here.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-[#155EEF] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#1B6CFF]"
        >
          Home
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {sessions.map((session) => (
        <li key={session.id}>
          <ChatHistoryItem session={session} onDelete={removeSession} />
        </li>
      ))}
    </ul>
  );
}
