"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { getPwaCopy } from "@/lib/i18n/pwaCopy";
import type { Lang } from "@/src/utils/i18n/types";

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
  const { language } = useLanguage();
  const copy = useMemo(() => getPwaCopy(language as Lang), [language]);
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

  const lineHint = isIosLine ? copy.lineHintIos : copy.lineHintAndroid;
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
    <div className="fixed inset-x-3 bottom-[max(88px,env(safe-area-inset-bottom,0px)+72px)] z-[1200] rounded-2xl border border-slate-200 bg-white p-3 text-slate-900 shadow-lg">
      {showLineHint ? (
        <p className="text-xs leading-relaxed text-slate-700">{lineHint}</p>
      ) : (
        <p className="text-xs leading-relaxed text-slate-700">{copy.installBody}</p>
      )}
      <div className="mt-2 flex flex-wrap gap-2">
        {showLineHint ? (
          <button
            type="button"
            onClick={tryOpenExternal}
            className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white"
          >
            {copy.openExternal}
          </button>
        ) : null}
        {showInstall ? (
          <button
            type="button"
            onClick={() => void runInstall()}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
          >
            {copy.installButton}
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
          {copy.dismiss}
        </button>
      </div>
    </div>
  );
}
