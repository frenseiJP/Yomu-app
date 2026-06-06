import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Try Frensei Free — 3 AI Chat Messages, No Sign-Up",
  description:
    "Try Frensei free: ask about Japanese phrases, culture, or get your Japanese polished. 3 messages, no account required.",
  alternates: { canonical: "/try" },
};

export default function TryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
