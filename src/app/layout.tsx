import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import AuthProvider from "@/components/AuthProvider";
import UserMenu from "@/components/UserMenu";

export const metadata: Metadata = {
  title: "AHAM — The Vedic Knowledge Engine",
  description:
    "A sacred interface for the pursuit of Vedic wisdom. Not an app. A threshold.",
  icons: {
    icon: "/favicon.ico",
  },
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
      <body className="min-h-[100dvh] bg-black text-vedic-parchment antialiased overflow-x-hidden">
        <AuthProvider>
          <div className="relative min-h-[100dvh]">
            {/* Sacred geometry background overlay */}
            <div className="fixed inset-0 yantra-bg pointer-events-none opacity-50 z-0" />

            {/* User menu */}
            <UserMenu />

            {/* Content */}
            <main className="relative z-10">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
