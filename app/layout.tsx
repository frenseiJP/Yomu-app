import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Footer from "@/components/Footer";
import FeedbackButton from "@/components/FeedbackButton";

export const metadata: Metadata = {
  title: "Yomu — Japanese learning coach",
  description: "Yomu: learn Japanese and culture with AI.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="touch-manipulation">
      <body className="bg-[#020617] pb-[env(safe-area-inset-bottom,0px)] text-slate-100 overscroll-behavior-none">
        <Suspense fallback={null}>
          <AuthProvider>
            <LanguageProvider>
              {children}
              <Analytics />
              <FeedbackButton />
              <Footer />
            </LanguageProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
