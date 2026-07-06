"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/src/utils/supabase/client";
import { getSessions, getMessages, removeSession } from "@/lib/chat/service";
import { useVocabularyUserId } from "@/lib/vocabulary/useVocabularyUserId";
import { getLangClient } from "@/src/utils/i18n/clientLang";
import { t } from "@/src/utils/i18n/t";
import type { Lang } from "@/src/utils/i18n/types";
import { ChatHistoryItem } from "./ChatHistoryItem";
import { mkt } from "@/lib/ui/appTheme";

function latestPreview(userId: string, sessionId: string): string {
  const msgs = getMessages(userId, sessionId);
  if (msgs.length === 0) return "";
  const last = msgs[msgs.length - 1];
  const text = last.content.trim().replace(/\s+/g, " ");
  return text.length > 140 ? `${text.slice(0, 140)}…` : text;
}

export function ChatHistoryList() {
  const userId = useVocabularyUserId();
  const [tick, setTick] = useState(0);
  const [chatBase, setChatBase] = useState<"/chat" | "/app">("/app");
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    setLang(getLangClient());
  }, []);

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
      if (typeof window !== "undefined" && !window.confirm(t(lang, "historyDeleteConfirm"))) return;
      removeSession(userId, sessionId);
      bump();
    },
    [userId, bump, lang],
  );

  if (sessions.length === 0) {
    return (
      <div className={`p-8 text-center ${mkt.card}`}>
        <p className={`text-sm font-medium leading-relaxed ${mkt.body}`}>{t(lang, "historyEmpty")}</p>
        <a href={chatBase === "/chat" ? "/chat" : "/app"} className={`mt-5 inline-flex items-center gap-2 ${mkt.ctaSm}`}>
          {t(lang, "historyStartChat")}
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
