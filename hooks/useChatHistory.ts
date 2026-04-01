"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChatSession } from "../lib/chat-history";
import {
  getAllSessions,
  getSession,
  saveSession,
  deleteSession as deleteStored,
} from "../lib/chat-history";

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(() => {
    setSessions(getAllSessions());
    setLoaded(true);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addOrUpdateSession = useCallback((session: ChatSession) => {
    saveSession(session);
    setSessions(getAllSessions());
  }, []);

  const removeSession = useCallback((id: string) => {
    deleteStored(id);
    setSessions(getAllSessions());
  }, []);

  const getOne = useCallback((id: string) => getSession(id), []);

  return {
    sessions,
    loaded,
    refresh: load,
    addOrUpdateSession,
    removeSession,
    getSession: getOne,
  };
}
