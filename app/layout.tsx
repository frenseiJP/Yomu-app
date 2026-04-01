import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Footer from "@/components/Footer";

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
      <body className="min-h-screen bg-[#020617] text-slate-100 overscroll-behavior-none">
        <AuthProvider>
          <LanguageProvider>
            {children}
            <Footer />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
