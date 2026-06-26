import type { Metadata } from "next";
import LaunchPageClient from "@/components/marketing/LaunchPageClient";

export const metadata: Metadata = {
  title: "Frensei — Beta Launch | AI Japanese Coach",
  description:
    "Frensei public beta: natural Japanese coaching with culture, not textbook drills. Try 3 free messages or book an intro call.",
  alternates: { canonical: "/launch" },
  openGraph: {
    title: "Frensei Beta Launch",
    description: "AI Japanese coach for natural, real-life Japanese.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function LaunchPage() {
  return <LaunchPageClient />;
}
