import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from "@/components/ui/provider"
import  PushPrompt  from "@/components/ui/pushprompt"
import { Toaster, toaster } from "@/components/ui/toaster"
import WhatsappWidget from '@/components/ui/whatsappwidget';
import { cookies } from 'next/headers'
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

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('elitetoken')?.value;

  return (
      <html className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning lang="en">
      <head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        {/* iOS Support */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Elite App" />
        <link rel="apple-touch-icon" href="/icons/ios/192.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>
        <Suspense fallback={<div>Loading......</div>}>
          <PushPrompt user={token} />
          <WhatsappWidget />
          <Provider theme={theme}>
            <Toaster />
            {children}
          </Provider>
        </Suspense>
      </body>
    </html>
  );
}
