import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Footer from "@/components/Footer";
import MobileAppBridge from "@/components/MobileAppBridge";
import PageViewLogger from "@/components/analytics/PageViewLogger";
import AttributionCapture from "@/components/analytics/AttributionCapture";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { getSiteUrl } from "@/lib/siteUrl";
import { getLangServer } from "@/src/utils/i18n/serverLang";
import { htmlLangAttribute } from "@/lib/i18n/resolveLanguage";

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
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Frensei" }],
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
  const initialLang = getLangServer();

  return (
    <html lang={htmlLangAttribute(initialLang)} className="touch-manipulation" suppressHydrationWarning>
      <body className="bg-[#020617] pb-[env(safe-area-inset-bottom,0px)] text-slate-100 overscroll-behavior-none">
        <Suspense fallback={null}>
          <AuthProvider>
            <LanguageProvider initialLang={initialLang}>
              <GoogleAnalytics />
              <PageViewLogger />
              <Suspense fallback={null}>
                <AttributionCapture />
              </Suspense>
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
