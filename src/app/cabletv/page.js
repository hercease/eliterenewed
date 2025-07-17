import CableTvComponent from './cabletvcomponent';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: "Cable TV Subscriptions | Elite Global Network",
  description: "Instantly subscribe to DStv, GOtv, Startimes & other cable TV services with Elite Global Network. Enjoy seamless payments and instant activation.",
  metadataBase: new URL('https://eliteglobalnetwork.com.ng'),
  alternates: {
    canonical: '/cabletv'
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      // Add other Apple icon sizes if available
    ],
  },
  openGraph: {
    title: "Cable TV Subscriptions | Elite Global Network",
    description: "Instant DStv, GOtv & Startimes subscriptions with Elite Global Network. Fast activation & reliable service for all your cable TV needs.",
    url: "https://eliteglobalnetwork.com.ng/cabletv",
    siteName: "Elite Global Network",
    images: [
      {
        url: "https://eliteglobalnetwork.com.ng/dstv.jpg", // Recommended to use dedicated OG image
        width: 1200,
        height: 630,
        alt: "Elite Global Network - Cable TV Subscription Services",
      },
    ],
    locale: "en_US",
    type: "website",
    // Add optional additional OG tags
    // publishedTime: "2023-10-01T00:00:00.000Z",
    // tags: ["cable tv", "dstv", "gotv", "startimes", "tv subscription"]
  },
  twitter: {
    card: "summary_large_image",
    site: "@EliteGlobalNet", // Your company's Twitter handle
    creator: "@EliteGlobalNet", // Content creator's handle
    title: "Cable TV Subscriptions | Elite Global Network",
    description: "One-stop solution for all your DStv, GOtv & Startimes subscriptions. Subscribe now!",
    images: {
      url: "https://eliteglobalnetwork.com.ng/dstv.jpg", // Recommended to use Twitter-optimized image
      alt: "Elite Global Network Cable TV Services",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Additional recommended meta tags
  keywords: ["cable tv subscription", "dstv payment", "gotv recharge", "startimes subscription", "elite global network"],
  // manifest: '/site.webmanifest', // If you have a web manifest
  // themeColor: '#3182CE', // Your brand color
};

export default async function AirtimeRecharge() {
  const cookieStore = await cookies();
  const token = cookieStore.get('elitetoken')?.value;

  if (!token) {
    redirect('/login');
  }
    return (
        <CableTvComponent user={token}  />
    )
}