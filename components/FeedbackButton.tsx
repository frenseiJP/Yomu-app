"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { getLangClient } from "@/src/utils/i18n/clientLang";
import { t } from "@/src/utils/i18n/t";
import type { Lang } from "@/src/utils/i18n/types";
import { FEEDBACK_FORM_URL } from "@/lib/feedbackFormUrl";

export default function FeedbackButton() {
  const pathname = usePathname();
  const [lang, setLang] = useState<Lang>("en");

  /** /chat は固定ヘッダー分だけ下げて、右上で被らないようにする */
  const topOffset = useMemo(() => {
    const isChatRoute = pathname === "/chat" || pathname.startsWith("/chat/");
    if (isChatRoute) {
      return "calc(env(safe-area-inset-top, 0px) + 4.35rem)";
    }
    return "calc(env(safe-area-inset-top, 0px) + 12px)";
  }, [pathname]);

  useEffect(() => {
    setLang(getLangClient());
    const onLangChanged = (event: Event) => {
      const custom = event as CustomEvent<{ lang?: Lang }>;
      const next = custom.detail?.lang;
      setLang(next ?? getLangClient());
    };
    window.addEventListener("yomu:lang-changed", onLangChanged as EventListener);
    const onVisibility = () => setLang(getLangClient());
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("yomu:lang-changed", onLangChanged as EventListener);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <a
      href={FEEDBACK_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t(lang, "feedbackButtonAria")}
      className="fixed z-[1000] max-w-[min(calc(100vw-1.5rem),17rem)] touch-manipulation sm:max-w-none"
      style={{
        top: topOffset,
        right: "max(12px, env(safe-area-inset-right, 0px))",
        backgroundColor: "#FF6B6B",
        color: "white",
        padding: "10px 14px",
        borderRadius: "30px",
        fontWeight: "bold",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        transition: "transform 0.2s",
        fontSize: "12px",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <span aria-hidden className="flex-shrink-0">
        💬
      </span>
      <span className="min-w-0 text-[11px] leading-snug line-clamp-1 sm:line-clamp-none sm:text-sm sm:leading-normal">
        {t(lang, "feedbackButtonLabel")}
      </span>
    </a>
  );
}
