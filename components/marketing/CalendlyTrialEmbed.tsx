"use client";

import { useEffect } from "react";
import { logBetaEvent } from "@/lib/analytics/client";
import { Calendar } from "lucide-react";

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
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/50">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onCalendlyClick}
          className="flex items-center justify-center gap-2 border-b border-slate-800 bg-pink-500/10 px-4 py-3 text-sm font-medium text-pink-100 hover:bg-pink-500/15"
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
      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 px-5 py-3 text-sm font-medium text-white"
    >
      <Calendar className="h-4 w-4" />
      {ctaLabel}
    </a>
  );
}
