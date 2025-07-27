import ElectricityComponent from './electricitycomponent';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: "Electricity Bill Payment - Buy AEDC, EKEDC, IKEDC, JED & PHED Tokens Online | Elite Global Network",
  description: "Instant prepaid meter tokens and electricity bill payments for AEDC, EKEDC, IKEDC, JED & PHED. Get instant tokens and receipts with 24/7 support.",
  metadataBase: new URL('https://eliteglobalnetwork.com.ng'),
  alternates: {
    canonical: 'https://eliteglobalnetwork.com.ng/electricity',
    languages: {
      'en-US': '/electricity',
      // 'fr-FR': '/fr/electricity', // Uncomment if multilingual
    },
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-192x192.png', sizes: '192x192', type: 'image/png' }, // Android Chrome
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180' },
      { url: '/favicon/apple-touch-icon-152x152.png', sizes: '152x152' }, // iPad
    ],
  },
  openGraph: {
    title: "Electricity Bill Payment - Buy Prepaid Tokens Online | Elite Global Network",
    description: "Pay AEDC, EKEDC, IKEDC, JED & PHED electricity bills instantly. Get prepaid meter tokens delivered immediately with transaction receipts.",
    url: "https://eliteglobalnetwork.com.ng/electricity",
    siteName: "Elite Global Network",
    images: [
      {
        url: "https://eliteglobalnetwork.com.ng/images/electricity-og.jpg",
        width: 1200,
        height: 630,
        alt: "Electricity bill payment for all Nigerian DISCOs - Elite Global Network",
      },
    ],
    locale: "en_US",
    type: "website",
    publishedTime: new Date().toISOString(),
  },
  twitter: {
    card: "summary_large_image",
    site: "@EliteGlobalNet",
    creator: "@EliteGlobalNet",
    title: "Pay Electricity Bills Online - Instant Prepaid Tokens | Elite Global Network",
    description: "Buy prepaid electricity tokens for AEDC, EKEDC, IKEDC, JED & PHED. Instant delivery with receipts. 24/7 service available.",
    images: ["https://eliteglobalnetwork.com.ng/images/electricity-twitter.jpg"],
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
  keywords: [
    "AEDC token purchase",
    "EKEDC bill payment",
    "IKEDC prepaid meter",
    "JED electricity payment",
    "PHED recharge online",
    "buy electricity token",
    "instant prepaid token",
    "Nigerian DISCOs payment"
  ],
  other: {
    'og:price:amount': '500-50000', // Typical token purchase range
    'og:price:currency': 'NGN',
  }
};

// Schema.org markup for rich snippets
export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Electricity Bill Payment',
  provider: {
    '@type': 'Organization',
    name: 'Elite Global Network',
    url: 'https://eliteglobalnetwork.com.ng',
    logo: 'https://eliteglobalnetwork.com.ng/logo.png'
  },
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: 9.0820,  // Nigeria's approximate center
      longitude: 8.6753
    },
    geoRadius: 1000000  // Serving all Nigeria (in meters)
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Electricity Distribution Companies',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'AEDC Prepaid Token'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'EKEDC Bill Payment'
        }
      }
    ]
  },
  serviceOutput: {
    '@type': 'DigitalDocument',
    name: 'Electricity Token'
  }
};

export default async function Electricity() {
  
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
      <ElectricityComponent user={token} />
    </>
  )
}