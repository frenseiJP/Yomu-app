import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frensei — 教科書の日本語から、自然な日本語へ",
  description:
    "AI日本語コーチ Frensei。ニュアンス・敬語・文化まで。登録不要で3メッセージ無料体験。",
  alternates: { canonical: "/ja" },
  openGraph: {
    locale: "ja_JP",
    title: "Frensei — AI日本語コーチ",
    description: "自然な日本語を、チャットで学ぶ。",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function JaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
