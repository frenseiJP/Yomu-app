"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { logBetaEvent } from "@/lib/analytics/client";
import { useVocabularyUserId } from "@/lib/vocabulary/useVocabularyUserId";

export default function PageViewLogger() {
  const pathname = usePathname() ?? "/";
  const userId = useVocabularyUserId();

  useEffect(() => {
    void logBetaEvent({
      eventType: "page_view",
      userId,
      route: pathname,
    });
  }, [pathname, userId]);

  return null;
}
