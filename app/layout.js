import "./globals.css";
import { Providers } from "./providers";
import { Open_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${openSans.className} antialiased`}>
        <Providers>
          <main className="min-h-screen w-full max-w-[100vw] overflow-x-hidden px-4 sm:px-6 md:px-8">
            {children}
          </main>
          <Toaster position="top-center"/>
        </Providers>
      </body>
    </html>
  );
}
