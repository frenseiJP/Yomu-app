"use client";

import React, { useEffect, useState } from "react";
import { getLangClient } from "@/src/utils/i18n/clientLang";
import { t } from "@/src/utils/i18n/t";
import type { Lang } from "@/src/utils/i18n/types";

const FEEDBACK_FORM_URL = "あなたのGoogleフォームのURL";

export default function FeedbackButton() {
  const [lang, setLang] = useState<Lang>("en");

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
      style={{
        position: "fixed",
        bottom: "calc(60px + env(safe-area-inset-bottom, 0px) + 20px)",
        right: "20px",
        backgroundColor: "#FF6B6B",
        color: "white",
        padding: "12px 24px",
        borderRadius: "30px",
        fontWeight: "bold",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        zIndex: 1000,
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "transform 0.2s",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <span aria-hidden>💬</span>
      <span>{t(lang, "feedbackButtonLabel")}</span>
    </a>
  );
}
