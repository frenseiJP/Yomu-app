import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Footer from "@/components/Footer";
import MobileAppBridge from "@/components/MobileAppBridge";
import PageViewLogger from "@/components/analytics/PageViewLogger";
import { getSiteUrl } from "@/lib/siteUrl";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: "Frensei — AI Japanese Learning Coach",
  description: "Learn Japanese naturally with Frensei, your AI-powered Japanese coach. Practice real conversations, master culture, and build vocabulary with personalized AI guidance.",
  applicationName: "Frensei",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg",
  },
  appleWebApp: {
    capable: true,
    title: "Frensei",
    statusBarStyle: "black-translucent",
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/`,
    title: "Frensei — AI Japanese Learning Coach",
    description: "Learn Japanese naturally with Frensei, your AI-powered Japanese coach. Practice real conversations, master culture, and build vocabulary with personalized AI guidance.",
    siteName: "Frensei",
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/icons/icon-512.svg`,
        width: 512,
        height: 512,
        alt: "Frensei",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frensei — AI Japanese Learning Coach",
    description: "Learn Japanese naturally with Frensei, your AI-powered Japanese coach. Practice real conversations, master culture, and build vocabulary.",
  },
  keywords: ["Japanese learning", "learn Japanese", "AI Japanese coach", "Japanese conversation", "Japanese vocabulary", "Japanese culture", "language learning app"],
  verification: {
    google: ["x_j1VD9gtwLSj-qa4yoF6dNuXQlPP4SmFHTjFuQiW7M", "UelaJh9VHjLSsZejNMGRQnVQ9Hefccz-OdO5341nt2A"],
  },
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
              <PageViewLogger />
              {children}
              <MobileAppBridge />
              <Analytics />
              <Footer />
            </LanguageProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
