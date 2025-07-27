import AirtimeRechargeComponent from './airtimerechargecomponent';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: "Elite | Airtime Recharge - Buy Airtime & Data in Nigeria",
  description: "Instant airtime recharge for MTN, Airtel, Glo & 9mobile in Nigeria. Buy data plans, pay bills, and manage transactions securely.",
  keywords: ["airtime recharge", "Nigeria mobile data", "pay bills online", "Elite Global Network"],
  metadataBase: new URL('https://eliteglobalnetwork.com.ng'),
  alternates: {
    canonical: 'https://eliteglobalnetwork.com.ng/airtimerecharge',
    languages: {
      'en-US': '/airtimerecharge',
      // Add other languages if available
      // 'fr-FR': '/fr/recharge',
    },
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
    title: "Elite | Airtime Recharge - Buy Airtime & Data in Nigeria",
    description: "Instant airtime recharge for MTN, Airtel, Glo & 9mobile in Nigeria. Buy data plans, pay bills, and manage transactions securely.",
    url: "https://eliteglobalnetwork.com.ng/airtimerecharge",
    siteName: "Elite Global Network",
    images: [
      {
        url: "https://eliteglobalnetwork.com.ng/elite_png.png",
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
    title: "Elite | Airtime Recharge - Buy Airtime & Data in Nigeria",
    description: "Instant airtime recharge for MTN, Airtel, Glo & 9mobile in Nigeria. Buy data plans, pay bills, and manage transactions securely.",
    images: {
      url: "https://eliteglobalnetwork.com.ng/elite_png.png",
      alt: "Elite Global Network Airtime Recharge",
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
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Schema.org JSON-LD for rich snippets
export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Airtime Recharge',
  description: 'Instant airtime and data recharge in Nigeria',
  provider: {
    '@type': 'Organization',
    name: 'Elite Global Network',
    url: 'https://eliteglobalnetwork.com.ng',
    logo: 'https://eliteglobalnetwork.com.ng/elite_png.png'
  },
  areaServed: 'Nigeria',
  serviceType: 'Mobile recharge',
  availableChannel: {
    '@type': 'ServiceChannel',
    serviceUrl: 'https://eliteglobalnetwork.com.ng/airtimerecharge'
  }
};

export default async function AirtimeRecharge() {
  const cookieStore = await cookies();
  const token = cookieStore.get('elitetoken')?.value;

  if (!token) {
    redirect('/login');
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AirtimeRechargeComponent user={token} />
    </>
  )
}