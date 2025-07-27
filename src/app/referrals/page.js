import ReferralsComponent from './referralcomponent';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: "My Referrals  | EliteGlobalNetwork",
  description: "View users you've referred and track your earned bonuses.",
  metadataBase: new URL('https://eliteglobalnetwork.com.ng'),
  alternates: {
    canonical: 'https://eliteglobalnetwork.com.ng/referrals',
    languages: {
      'en-US': '/referrals',
      // 'fr-FR': '/fr/referrals', // Uncomment if multilingual
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
    title: "My Referral Network | Elite Global Network",
    description: "Manage your referral network and track rewards in real-time",
    url: "https://eliteglobalnetwork.com.ng/referrals",
    siteName: "Elite Global Network",
    images: [
      {
        url: "https://eliteglobalnetwork.com.ng/elite_png.png",
        width: 1200,
        height: 630,
        alt: "Earn rewards by inviting friends to Elite Global Network",
      },
    ],
    locale: "en_US",
    type: "website",
    publishedTime: new Date().toISOString(), // Dynamic publication date
  },
  twitter: {
    card: "summary_large_image",
    site: "@YourVTUApp",
    creator: "@YourVTUApp",
    title: "Refer Friends and family and earn forever | Elite Global Network",
    description: "Share your referral link and get bonuses every time your friends performs transaction",
    images: ["https://eliteglobalnetwork.com.ng/elite_png.png"],
  },
  robots: {
    index: false, // Critical for privacy
    follow: true,
    nocache: true,
    googleBot: {
      index: false,
      follow: true,
      noimageindex: true,
    },
  },
  keywords: [
    "VTU referral program",
    "earn airtime rewards",
    "refer friends get bonus",
    "VTU app invite",
    "free mobile recharge",
    "data bonus referral",
    "cashback VTU app",
    "[Your VTU App Name] referrals"
  ],
  other: {
    'fb:app_id': 'YOUR_FACEBOOK_APP_ID', // If available
    'og:price:amount': '100-5000', // Estimated referral bonus range
    'og:price:currency': 'NGN',
  }
};

// Schema.org markup for referral program
export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ReferralProgram',
  name: 'Elite Global Network Referral Rewards',
  description: 'Earn bonuses by inviting friends to use our VTU services.',
  url: 'https://eliteglobalnetwork.com.ng/referrals',
  provider: {
    '@type': 'Organization',
    name: 'Elite Global Network',
    url: 'https://eliteglobalnetwork.com.ng',
    logo: 'https://eliteglobalnetwork.com.ng/elite_png.png'
  },
  rewards: [
    {
      '@type': 'Offer',
      name: '40% Bonus',
      description: 'Earn 40% every time your referrals perform transactions.',
    }
  ],
  termsOfService: 'https://yourvtuapp.com/terms#referrals'
};

export default async function MyReferrals() {
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
      <ReferralsComponent user={token} />
    </>
  )
}