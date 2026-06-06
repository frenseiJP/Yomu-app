"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/src/utils/supabase/client";
import { getSessions, getMessages, removeSession } from "@/lib/chat/service";
import { useVocabularyUserId } from "@/lib/vocabulary/useVocabularyUserId";
import { ChatHistoryItem } from "./ChatHistoryItem";

function latestPreview(userId: string, sessionId: string): string {
  const msgs = getMessages(userId, sessionId);
  if (msgs.length === 0) return "";
  const last = msgs[msgs.length - 1];
  const t = last.content.trim().replace(/\s+/g, " ");
  return t.length > 140 ? `${t.slice(0, 140)}…` : t;
}

export function ChatHistoryList() {
  const userId = useVocabularyUserId();
  const [tick, setTick] = useState(0);
  const [chatBase, setChatBase] = useState<"/chat" | "/app">("/app");

  useEffect(() => {
    let cancelled = false;
    void createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (!cancelled) setChatBase(data.user ? "/chat" : "/app");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const sessions = useMemo(() => {
    void tick;
    return getSessions(userId);
  }, [userId, tick]);

  const bump = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    const onFocus = () => bump();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [bump]);

  const handleDelete = useCallback(
    (sessionId: string) => {
      if (typeof window !== "undefined" && !window.confirm("Delete this chat session?")) return;
      removeSession(userId, sessionId);
      bump();
    },
    [userId, bump],
  );

  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-8 text-center">
        <p className="text-sm font-medium leading-relaxed text-slate-200">
          No learning history yet. Start a chat to begin building your Japanese learning journey.
        </p>
        <a
          href={chatBase === "/chat" ? "/chat" : "/app"}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#155EEF] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#1B6CFF]"
        >
          Start chatting
        </a>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {sessions.map((session) => (
        <li key={session.id}>
          <ChatHistoryItem
            title={session.title}
            updatedAt={session.updatedAt}
            preview={latestPreview(userId, session.id)}
            href={`${chatBase}?session=${encodeURIComponent(session.id)}`}
            onDelete={() => handleDelete(session.id)}
          />
        </li>
      ))}
    </ul>
  );
}
