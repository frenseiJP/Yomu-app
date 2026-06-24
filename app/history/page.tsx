"use client";

import Link from "next/link";
import { Component, type ErrorInfo, type ReactNode, useEffect, useState } from "react";
import { ChatHistoryList } from "@/components/chat/ChatHistoryList";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { t } from "@/src/utils/i18n/t";
import type { Lang } from "@/src/utils/i18n/types";

type Props = { children: ReactNode };

type State = { hasError: boolean };

class HistoryChunkErrorBoundary extends Component<Props & { lang: Lang }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("History page error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
          <p className="font-medium">{t(this.props.lang, "historyLoadError")}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-3 rounded-lg bg-amber-500/20 px-3 py-2 text-xs font-medium text-amber-50 hover:bg-amber-500/30"
          >
            {t(this.props.lang, "historyReload")}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function HistoryPage() {
  const { language } = useLanguage();
  const lang = language as Lang;
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const onChunkError = (event: PromiseRejectionEvent) => {
      const reason = String(event.reason ?? "");
      if (reason.includes("ChunkLoadError") || reason.includes("Loading chunk")) {
        setReloadKey((k) => k + 1);
      }
    };
    window.addEventListener("unhandledrejection", onChunkError);
    return () => window.removeEventListener("unhandledrejection", onChunkError);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 antialiased">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <header className="mb-6">
          <Link
            href="/app"
            className="text-sm font-medium text-slate-400 transition hover:text-slate-100"
          >
            ← {t(lang, "historyBackHome")}
          </Link>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-100">
            {t(lang, "historyPageTitle")}
          </h1>
          <p className="mt-2 text-sm text-slate-400">{t(lang, "historyPageSubtitle")}</p>
        </header>
        <section key={reloadKey}>
          <HistoryChunkErrorBoundary lang={lang}>
            <ChatHistoryList />
          </HistoryChunkErrorBoundary>
        </section>
      </div>
    </div>
  );
}
