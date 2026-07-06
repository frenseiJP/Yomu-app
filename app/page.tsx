import type { Metadata } from "next";
import LandingPage from "@/components/marketing/LandingPage";
import { getSiteUrl } from "@/lib/siteUrl";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: "Frensei — Stop Sounding Like a Textbook",
  description:
    "AI coach for natural Japanese. Try 3 free messages — no signup, no credit card.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Stop sounding like a textbook. Try 3 free messages.",
    description:
      "Natural Japanese + culture explained. No signup. No credit card.",
    url: `${SITE_URL}/`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Stop sounding like a textbook · Frensei",
    description: "Try 3 free AI chat messages — no signup.",
  },
};

export default function HomePage() {
  return <LandingPage />;
}
