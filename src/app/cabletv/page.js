import CableTvComponent from './cabletvcomponent';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: "DStv, GOtv & Startimes Subscription | Instant Activation - Elite Global Network",
  description: "Subscribe to DStv Premium, Compact, or Yanga packages, GOtv Max/Jolli, and Startimes Nigeria instantly. Enjoy 24/7 customer support and receipt generation.",
  metadataBase: new URL('https://eliteglobalnetwork.com.ng'),
  alternates: {
    canonical: 'https://eliteglobalnetwork.com.ng/cabletv',
    languages: {
      'en-US': '/cabletv',
      // 'fr-FR': '/fr/cabletv', // Uncomment if multilingual
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
    title: "Instant Cable TV Subscription - DStv, GOtv, Startimes | Elite Global Network",
    description: "Renew your DStv, GOtv or Startimes subscription in seconds. All packages available with instant activation confirmation.",
    url: "https://eliteglobalnetwork.com.ng/cabletv",
    siteName: "Elite Global Network",
    images: [
      {
        url: "https://eliteglobalnetwork.com.ng/elite_png.png",
        width: 1200,
        height: 630,
        alt: "DStv, GOtv and Startimes subscription packages with Elite Global Network",
      },
    ],
    locale: "en_US",
    type: "website",
    publishedTime: new Date().toISOString(), // Dynamic publication date
  },
  twitter: {
    card: "summary_large_image",
    site: "@EliteGlobalNet",
    creator: "@EliteGlobalNet",
    title: "Instant Cable TV Subscriptions in Nigeria | Elite Global Network",
    description: "Subscribe to all DStv packages (Premium/Compact/Yanga), GOtv (Max/Jolli) and Startimes with instant activation. 100% reliable.",
    images: ["https://eliteglobalnetwork.com.ng/elite_png.png"],
  },
  robots: {
    index: false,
    follow: false,
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
    "DStv subscription Nigeria",
    "GOtv payment online",
    "Startimes recharge",
    "Cable TV renewal",
    "DStv Premium package",
    "GOtv Max subscription",
    "instant TV payment",
    "Elite Global Network cable TV"
  ],
  other: {
    'fb:app_id': 'YOUR_FACEBOOK_APP_ID', // If available
    'og:price:amount': '15000-45000', // Price range for packages
    'og:price:currency': 'NGN',
  }
};

// Schema.org markup for rich snippets
export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Cable TV Subscription',
  provider: {
    '@type': 'Organization',
    name: 'Elite Global Network',
    url: 'https://eliteglobalnetwork.com.ng',
    logo: 'https://eliteglobalnetwork.com.ng/logo.png'
  },
  areaServed: 'Nigeria',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Cable TV Packages',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'DStv Subscription'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'GOtv Payment'
        }
      }
    ]
  }
};

export default async function CableTvSubscription() {
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
      <CableTvComponent user={token} />
    </>
  )
}