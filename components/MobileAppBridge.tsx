"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isLineInAppBrowser(ua: string): boolean {
  return /Line\/|LIFF|NAVER\(inapp/i.test(ua);
}

function isIos(ua: string): boolean {
  return /iPhone|iPad|iPod/i.test(ua);
}

function isAppShellPath(pathname: string): boolean {
  return (
    pathname === "/app" ||
    pathname === "/chat" ||
    pathname.startsWith("/vocabulary") ||
    pathname.startsWith("/progress") ||
    pathname.startsWith("/more")
  );
}

export default function MobileAppBridge() {
  const pathname = usePathname() || "";
  const [isLine, setIsLine] = useState(false);
  const [isIosLine, setIsIosLine] = useState(false);
  const [lineDismissed, setLineDismissed] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installDismissed, setInstallDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = window.navigator.userAgent || "";
    setIsLine(isLineInAppBrowser(ua));
    setIsIosLine(isLineInAppBrowser(ua) && isIos(ua));
    setLineDismissed(window.sessionStorage.getItem("line_notice_dismissed") === "1");
    setInstallDismissed(window.sessionStorage.getItem("pwa_install_dismissed") === "1");

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
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

  const lineHint = useMemo(() => {
    if (isIosLine) {
      return "LINE内ブラウザだと操作しづらいです。右上メニューから Safari で開くと使いやすくなります。";
    }
    return "LINE内ブラウザで開いています。右上メニューから Chrome / Safari で開くと快適です。";
  }, [isIosLine]);

  const showLineHint = isLine && !lineDismissed;
  const showInstall =
    isAppShellPath(pathname) && installPrompt && !installDismissed && !showLineHint;

  if (!showLineHint && !showInstall) return null;

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

  const runInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
    setInstallDismissed(true);
    window.sessionStorage.setItem("pwa_install_dismissed", "1");
  };

  return (
    <div className="fixed inset-x-3 bottom-[max(88px,env(safe-area-inset-bottom,0px)+72px)] z-[1200] rounded-2xl border border-slate-700 bg-slate-900/95 p-3 text-slate-100 shadow-2xl backdrop-blur">
      {showLineHint ? (
        <p className="text-xs leading-relaxed text-slate-200">{lineHint}</p>
      ) : (
        <p className="text-xs leading-relaxed text-slate-200">
          Add Frensei to your home screen for faster access.
        </p>
      )}
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
            onClick={() => void runInstall()}
            className="rounded-lg bg-pink-500 px-3 py-1.5 text-xs font-semibold text-white"
          >
            Install app
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => {
            if (showLineHint) {
              setLineDismissed(true);
              window.sessionStorage.setItem("line_notice_dismissed", "1");
            } else {
              setInstallDismissed(true);
              window.sessionStorage.setItem("pwa_install_dismissed", "1");
            }
          }}
          className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs text-slate-300"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
