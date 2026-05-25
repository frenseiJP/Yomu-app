"use client";

import Link from "next/link";
import { ChatHistoryList } from "@/components/chat/ChatHistoryList";

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 antialiased">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <header className="mb-6">
          <Link
            href="/"
            className="text-sm font-medium text-slate-400 transition hover:text-slate-100"
          >
            ← Home
          </Link>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-100">
            Learning History
          </h1>
          <p className="mt-2 text-sm text-slate-400">Continue where you left off</p>
        </header>
        <section>
          <ChatHistoryList />
        </section>
      </div>
    </div>
  );
}
