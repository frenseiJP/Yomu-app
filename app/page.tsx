import type { Metadata } from "next";
import LandingPage from "@/components/marketing/LandingPage";
import { getSiteUrl } from "@/lib/siteUrl";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: "Frensei — Stop Sounding Like a Textbook. Start Sounding Natural.",
  description:
    "Learn Japanese naturally with Frensei, your AI coach for nuance, politeness, and real-life conversation. Try 3 free messages—no sign-up.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Frensei — AI Japanese Learning Coach",
    description:
      "Chat-first AI coaching for natural Japanese. Try free—no sign-up required.",
    url: `${SITE_URL}/`,
  },
};

export default function HomePage() {
  return <LandingPage />;
}
