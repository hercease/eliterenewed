
import DataRechargeComponent from './datarechargecomponent';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: "Buy Data | Affordable Data Plans | Elite Global Network",
  description: "Recharge data instantly on all networks at the lowest prices. Enjoy fast and reliable data top-up with Elite Global Network.",
  metadataBase: new URL('https://eliteglobalnetwork.com.ng'),
  alternates: {
    canonical: 'https://eliteglobalnetwork.com.ng/datarecharge', // Updated canonical URL
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
    title: "Buy Data Online | Instant Data Recharge | Elite Global Network",
    description: "Top-up your mobile data on MTN, Glo, Airtel, or 9mobile with instant delivery and cheap rates. Powered by Elite Global Network.",
    url: "https://eliteglobalnetwork.com.ng/datarecharge",
    siteName: "Elite Global Network",
    images: [
      {
        url: "https://eliteglobalnetwork.com.ng/elite_png.png",
        width: 1200,
        height: 630,
        alt: "Buy Data Online - Elite Global Network",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recharge Data at the Best Rates | Elite Global Network",
    description: "Instant data recharge for MTN, Airtel, Glo & 9mobile. Get affordable internet bundles in seconds.",
    images: {
      url: "https://eliteglobalnetwork.com.ng/elite_png.png",
      alt: "Elite Global Network Data Recharge Page",
    },
    creator: "@EliteGlobalNet",
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




export default async function DataRecharge() {
const cookieStore = await cookies();
  const token = cookieStore.get('elitetoken')?.value;

  if (!token) {
    redirect('/login');
  }
    return (
        <DataRechargeComponent user={token}  />
    )
}