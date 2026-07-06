"use client";

import { useEffect } from "react";
import { logBetaEvent } from "@/lib/analytics/client";
import { Calendar } from "lucide-react";
import { mkt } from "@/lib/ui/appTheme";

type Props = {
  url: string;
  ctaLabel: string;
  route?: string;
};

export default function CalendlyTrialEmbed({ url, ctaLabel, route = "/trial" }: Props) {
  useEffect(() => {
    if (!url.includes("calendly.com")) return;
    const existing = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
    if (existing) return;
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, [url]);

  const onCalendlyClick = () => {
    void logBetaEvent({
      eventType: "calendly_trial_click",
      route,
      metadata: { source: "trial_page" },
    });
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "calendly_trial_click", { source: "trial_page" });
    }
  };

  if (url.includes("calendly.com")) {
    return (
      <div className={`mt-6 overflow-hidden ${mkt.card}`}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onCalendlyClick}
          className="flex items-center justify-center gap-2 border-b border-slate-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800 hover:bg-blue-100"
        >
          <Calendar className="h-4 w-4" />
          {ctaLabel}
        </a>
        <div
          className="calendly-inline-widget min-h-[620px] w-full"
          data-url={`${url}${url.includes("?") ? "&" : "?"}hide_gdpr_banner=1`}
        />
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onCalendlyClick}
      className={`mt-6 inline-flex items-center gap-2 ${mkt.cta}`}
    >
      <Calendar className="h-4 w-4" />
      {ctaLabel}
    </a>
  );
}
