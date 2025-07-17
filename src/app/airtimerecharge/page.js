import AirtimeRechargeComponent from './airtimerechargecomponent';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'


export const metadata = {
  title: "Elite | Airtime Recharge",
  description: "Recharge all you want",
  metadataBase: new URL('https://eliteglobalnetwork.com.ng'), // Required for absolute URLs
  alternates: {
    canonical: '/airtimerecharge' // Canonical URL
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
    title: "Elite | Airtime Recharge",
    description: "Recharge all you want",
    url: "https://eliteglobalnetwork.com.ng/alltransactions",
    siteName: "Elite Global Network",
    images: [
      {
        url: "https://eliteglobalnetwork.com.ng/elite_png.png", // Absolute URL
        width: 1200,
        height: 630,
        alt: "Elite Global Network Airtime Recharge",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elite | All Transactions",
    description: "Recharge all you want",
    images: {
      url: "https://eliteglobalnetwork.com.ng/elite_png.png", // Absolute URL
      alt: "Elite Global Network Airtime Recharge",
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

export default async function AirtimeRecharge() {
  const cookieStore = await cookies();
  const token = cookieStore.get('elitetoken')?.value;

  if (!token) {
    redirect('/login');
  }
    return (
        <AirtimeRechargeComponent user={token}  />
    )
}