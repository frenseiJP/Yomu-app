"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { captureAttributionFromLocation } from "@/lib/analytics/attribution";
import { useLanguage } from "@/app/contexts/LanguageContext";
import type { Lang } from "@/src/utils/i18n/types";

const URL_LANGS = new Set<Lang>(["en", "ja", "ko", "zh"]);

export default function AttributionCapture() {
  const searchParams = useSearchParams();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    captureAttributionFromLocation();
  }, [searchParams]);

  useEffect(() => {
    const lang = searchParams?.get("lang")?.trim();
    if (lang && URL_LANGS.has(lang as Lang)) {
      setLanguage(lang as Lang);
    }
  }, [searchParams, setLanguage]);

  return null;
}
