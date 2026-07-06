"use client";

import Link from "next/link";
import { Component, type ErrorInfo, type ReactNode, useEffect, useState } from "react";
import { ChatHistoryList } from "@/components/chat/ChatHistoryList";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { t } from "@/src/utils/i18n/t";
import type { Lang } from "@/src/utils/i18n/types";
import { mkt } from "@/lib/ui/appTheme";

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
        <div className={mkt.alertWarn}>
          <p className="font-medium">{t(this.props.lang, "historyLoadError")}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-3 rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-medium text-amber-900 hover:bg-amber-50"
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
    <div className={mkt.page}>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <header className="mb-6">
          <Link href="/app" className={`text-sm font-medium ${mkt.link}`}>
            ← {t(lang, "historyBackHome")}
          </Link>
          <h1 className={`mt-4 text-2xl font-semibold tracking-tight ${mkt.heading}`}>
            {t(lang, "historyPageTitle")}
          </h1>
          <p className={`mt-2 text-sm ${mkt.muted}`}>{t(lang, "historyPageSubtitle")}</p>
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
