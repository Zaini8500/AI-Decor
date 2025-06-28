import "./globals.css";
import { Providers } from "./providers";
import { Open_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata = {
  title: "AI Decor",
  description: "AI-powered interior design generator",
  themeColor: "#8e44ad",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ PWA Essentials */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8e44ad" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" href="/icon-192x192.png" sizes="192x192" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${openSans.className} antialiased`}>
        <Providers>
          <main className="min-h-screen w-full max-w-[100vw] overflow-x-hidden px-4 sm:px-6 md:px-8">
            {children}
          </main>
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
