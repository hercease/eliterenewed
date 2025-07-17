import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from "@/components/ui/provider"
import { Toaster, toaster } from "@/components/ui/toaster"
import "./globals.css";
import theme from '@/theme';
import { Suspense } from 'react';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning lang="en">
      <body>
        <Suspense fallback={<div>Loading layout...</div>}>
        <Provider theme={theme}>
          <Toaster />
          {children}
        </Provider>
        </Suspense>
      </body>
    </html>
  );
}
