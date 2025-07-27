import FundWalletComponent from './fundwalletcomponent';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: "Fund Your Wallet - Secure Online Deposits | Elite Global Network",
  description: "Instantly fund your Elite wallet via bank transfer, debit card, or USSD. Enjoy secure transactions with 24/7 support for all your airtime, data, and bill payments.",
  metadataBase: new URL('https://eliteglobalnetwork.com.ng'),
  alternates: {
    canonical: 'https://eliteglobalnetwork.com.ng/fundwallet',
    languages: {
      'en-US': '/fundwallet',
      // 'fr-FR': '/fr/fundwallet', // Uncomment if multilingual
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
    title: "Secure Wallet Funding - Bank Transfer & Card Payments | Elite Global Network",
    description: "Top up your Elite wallet instantly via multiple payment methods to enjoy seamless airtime, data, and bill payments.",
    url: "https://eliteglobalnetwork.com.ng/fundwallet",
    siteName: "Elite Global Network",
    images: [
      {
        url: "https://eliteglobalnetwork.com.ng/elite_png.png",
        width: 1200,
        height: 630,
        alt: "Secure wallet funding options with Elite Global Network",
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
    title: "Fund Your Wallet Securely - Elite Global Network",
    description: "Instant wallet top-up via bank transfer, cards & USSD for all your transactions. 100% secure payments.",
    images: ["https://eliteglobalnetwork.com.ng/elite_png.png"],
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
    "fund wallet online",
    "wallet top up Nigeria",
    "secure online deposits",
    "bank transfer payment",
    "debit card payment Nigeria",
    "USSD wallet funding",
    "Elite wallet recharge",
    "instant money deposit"
  ],
  other: {
    'og:price:amount': '100-500000', // Typical funding range
    'og:price:currency': 'NGN',
    'fb:app_id': 'YOUR_FACEBOOK_APP_ID', // If available
  }
};

// Schema.org markup for rich snippets
export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: 'Wallet Funding Service',
  provider: {
    '@type': 'Organization',
    name: 'Elite Global Network',
    url: 'https://eliteglobalnetwork.com.ng',
    logo: 'https://eliteglobalnetwork.com.ng/elite_png.png'
  },
  serviceType: 'DigitalWalletTopUp',
  offers: {
    '@type': 'Offer',
    category: 'DigitalService',
    url: 'https://eliteglobalnetwork.com.ng/fundwallet',
    acceptedPaymentMethod: ['CreditCard', 'BankTransfer', 'MobilePayment'],
    areaServed: 'Nigeria'
  },
  termsOfService: 'https://eliteglobalnetwork.com.ng/terms'
};

export default async function FundWalletPage() {
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
      <FundWalletComponent user={token} />
    </>
  )
}