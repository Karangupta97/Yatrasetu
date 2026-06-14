import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWAInstallPrompt from "@/components/shared/PWAInstallPrompt";
import ServiceWorkerRegister from "@/components/shared/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "YatraSetu — Your bridge to every journey.",
  description: "Book Indian railway tickets seamlessly with YatraSetu.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "YatraSetu",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" }],
    shortcut: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#748efe",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Google+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="YatraSetu" />
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        <meta name="msapplication-TileColor" content="#748efe" />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Google Sans', 'Segoe UI', system-ui, sans-serif" }}>
        {children}
        <PWAInstallPrompt />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
