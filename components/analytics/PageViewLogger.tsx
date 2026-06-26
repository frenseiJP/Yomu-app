"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { logBetaEvent } from "@/lib/analytics/client";
import { useVocabularyUserId } from "@/lib/vocabulary/useVocabularyUserId";
import { getStoredAttribution } from "@/lib/analytics/attribution";

export default function PageViewLogger() {
  const pathname = usePathname() ?? "/";
  const userId = useVocabularyUserId();

  useEffect(() => {
    const attr = getStoredAttribution();
    void logBetaEvent({
      eventType: "page_view",
      userId,
      route: pathname,
      metadata: attr
        ? {
            utm_source: attr.utm_source,
            utm_medium: attr.utm_medium,
            utm_campaign: attr.utm_campaign,
            from: attr.from,
          }
        : undefined,
    });
  }, [pathname, userId]);

  return null;
}
