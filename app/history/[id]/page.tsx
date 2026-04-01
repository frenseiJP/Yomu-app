"use client";

import { useParams, useRouter } from "next/navigation";
import { useChatHistory } from "../../../hooks/useChatHistory";
import Link from "next/link";
import { useMemo } from "react";

export default function HistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const { getSession } = useChatHistory();
  const session = useMemo(() => getSession(id), [id, getSession]);

  if (!session) {
    return (
      <div className="min-h-screen bg-[#020617] px-4 py-6">
        <p className="text-slate-400">Session not found.</p>
        <Link href="/history" className="mt-4 inline-block text-sky-400">
          Back to history
        </Link>
      </div>
    );
  }

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 antialiased">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <header className="mb-6 flex items-center justify-between">
          <Link
            href="/history"
            className="text-sm font-medium text-slate-400 transition hover:text-slate-100"
          >
            ← History
          </Link>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-slate-400 hover:text-slate-100"
          >
            Close
          </button>
        </header>
        <h1 className="mb-2 text-lg font-semibold text-slate-100">
          {session.title}
        </h1>
        <p className="mb-6 text-xs text-slate-500">
          {formatTime(session.updatedAt)}
        </p>
        <ul className="space-y-4">
          {session.messages.map((msg) => (
            <li
              key={msg.id}
              className={
                msg.role === "user"
                  ? "flex justify-end"
                  : "flex justify-start"
              }
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === "user"
                    ? "rounded-br-md bg-[#155EEF] text-white"
                    : "rounded-bl-md bg-slate-900/90 text-slate-100"
                }`}
              >
                <p className="text-[10px] font-medium text-slate-400">
                  {msg.role === "user" ? "You" : "Yomu"}
                </p>
                <p className="mt-0.5 whitespace-pre-wrap">{msg.content}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
