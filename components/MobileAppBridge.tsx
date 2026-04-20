"use client";

import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isLineInAppBrowser(ua: string): boolean {
  return /Line\/|LIFF|NAVER\(inapp/i.test(ua);
}

function isIos(ua: string): boolean {
  return /iPhone|iPad|iPod/i.test(ua);
}

export default function MobileAppBridge() {
  const [installEvt, setInstallEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isLine, setIsLine] = useState(false);
  const [isIosLine, setIsIosLine] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = window.navigator.userAgent || "";
    const line = isLineInAppBrowser(ua);
    setIsLine(line);
    setIsIosLine(line && isIos(ua));
    setDismissed(window.sessionStorage.getItem("line_notice_dismissed") === "1");

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* noop */
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
    };
  }, []);

  const showLineHint = isLine && !dismissed;
  const showInstall = Boolean(installEvt);

  const canShow = showLineHint || showInstall;
  const hint = useMemo(() => {
    if (isIosLine) {
      return "LINE内ブラウザだと操作しづらいです。右上メニューから Safari で開くと使いやすくなります。";
    }
    return "LINE内ブラウザで開いています。右上メニューから Chrome / Safari で開くと快適です。";
  }, [isIosLine]);

  if (!canShow) return null;

  const tryOpenExternal = () => {
    if (typeof window === "undefined") return;
    const current = window.location.href;
    const ua = window.navigator.userAgent || "";
    if (/Android/i.test(ua)) {
      const intent = `intent:${window.location.pathname}${window.location.search}${window.location.hash}#Intent;scheme=https;package=com.android.chrome;end`;
      window.location.href = intent;
      return;
    }
    window.open(current, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-x-3 bottom-[max(88px,env(safe-area-inset-bottom,0px)+72px)] z-[1200] rounded-2xl border border-slate-700 bg-slate-900/95 p-3 text-slate-100 shadow-2xl backdrop-blur">
      {showLineHint ? <p className="text-xs leading-relaxed text-slate-200">{hint}</p> : null}
      <div className="mt-2 flex flex-wrap gap-2">
        {showLineHint ? (
          <button
            type="button"
            onClick={tryOpenExternal}
            className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white"
          >
            外部ブラウザで開く
          </button>
        ) : null}
        {showInstall ? (
          <button
            type="button"
            onClick={async () => {
              if (!installEvt) return;
              await installEvt.prompt();
              await installEvt.userChoice.catch(() => null);
              setInstallEvt(null);
            }}
            className="rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white"
          >
            ホーム画面に追加
          </button>
        ) : null}
        {showLineHint ? (
          <button
            type="button"
            onClick={() => {
              setDismissed(true);
              if (typeof window !== "undefined") {
                window.sessionStorage.setItem("line_notice_dismissed", "1");
              }
            }}
            className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs text-slate-300"
          >
            閉じる
          </button>
        ) : null}
      </div>
    </div>
  );
}
