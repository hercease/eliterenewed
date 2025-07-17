import FundWalletComponent from './fundwalletcomponent';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: "Elite | Fund Wallet",
  description: "Fund wallet",
  metadataBase: new URL('https://eliteglobalnetwork.com.ng'), // Required for absolute URLs
  alternates: {
    canonical: '/fundwallet' // Canonical URL
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png' },
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "Elite | Fund Wallet",
    description: "Fund wallet",
    url: "https://eliteglobalnetwork.com.ng/fundwallet",
    siteName: "Elite Global Network",
    images: [
      {
        url: "https://eliteglobalnetwork.com.ng/elite_png.png", // Absolute URL
        width: 1200,
        height: 630,
        alt: "Elite Global Network Fund Wallet",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elite | Fund Wallet",
    description: "Fund wallet",
    images: {
      url: "https://eliteglobalnetwork.com.ng/elite_png.png", // Absolute URL
      alt: "Fund User wallet",
    },
    creator: "@EliteGlobalNet", // Optional Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
};

export default async function FundWalletPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('elitetoken')?.value;

    if (!token) {
      redirect('/login');
    }
    
    return (
        
        <FundWalletComponent user={token} />
        
    )
    
}