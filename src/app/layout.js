import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from "@/components/ui/provider"
import  PushPrompt  from "@/components/ui/pushprompt"
import { Toaster, toaster } from "@/components/ui/toaster"
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
      <body>
        <Suspense fallback={<div>Loading......</div>}>
        <PushPrompt user={token} />
        <Provider theme={theme}>
          <Toaster />
          {children}
        </Provider>
        </Suspense>
      </body>
    </html>
  );
}
