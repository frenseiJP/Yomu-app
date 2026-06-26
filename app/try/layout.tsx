import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Try Frensei Free — 3 AI Chat Messages, No Sign-Up",
  description:
    "Try Frensei free: ask about Japanese phrases, culture, or get your Japanese polished. 3 messages, no account required.",
  alternates: { canonical: "/try" },
  openGraph: {
    title: "Try Frensei Free — 3 Messages, No Sign-Up",
    description: "Natural Japanese coaching in your browser. No account required.",
    url: "/try",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Frensei" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Try Frensei Free",
    description: "3 free AI chat messages. Natural Japanese coaching.",
    images: ["/opengraph-image"],
  },
};

export default function TryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
