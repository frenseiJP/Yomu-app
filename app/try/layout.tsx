import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Try 3 Free Messages — No Signup | Frensei",
  description:
    "Ask about Japanese phrases, culture, or paste your Japanese. 3 free messages, no account, no credit card.",
  alternates: { canonical: "/try" },
  openGraph: {
    title: "Try 3 free messages — no signup",
    description: "Natural Japanese AI coach. See the product in seconds.",
    url: "/try",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Frensei" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Try 3 free messages · Frensei",
    description: "Natural Japanese coaching in your browser. No signup.",
    images: ["/opengraph-image"],
  },
};

export default function TryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
