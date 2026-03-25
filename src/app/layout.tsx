import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import AuthProvider from "@/components/AuthProvider";
import UserMenu from "@/components/UserMenu";

export const metadata: Metadata = {
  title: "AHAM — The Vedic Superintelligence Oracle",
  description:
    "Talk to ancient Vedic sages powered by AI. Explore consciousness, sound healing, and where 5,000-year-old wisdom meets modern science. Free forever.",
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL("https://aham-pi.vercel.app"),
  openGraph: {
    title: "AHAM — Talk to Ancient Vedic Sages",
    description:
      "AI-powered conversations with 7 Rishi personalities. Explore Nada sound frequencies, Vedic-Science connections, and your inner journey through the Koshas. Free forever.",
    url: "https://aham-pi.vercel.app",
    siteName: "AHAM",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AHAM — Talk to Ancient Vedic Sages",
    description:
      "AI-powered conversations with 7 Rishi personalities. Explore consciousness, sound healing, and the bridge between Vedic wisdom and modern science.",
  },
  keywords: [
    "Vedic wisdom", "AI sage", "Rishi", "meditation", "consciousness",
    "Upanishads", "Vedanta", "sound healing", "Nada Brahma", "yoga philosophy",
    "ancient Indian wisdom", "spiritual AI", "kosha", "Vedic science",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-[100dvh] bg-vedic-void text-vedic-parchment antialiased overflow-x-hidden">
        <AuthProvider>
          <div className="relative min-h-[100dvh]">
            <UserMenu />
            <main className="relative z-10">{children}</main>
          </div>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
