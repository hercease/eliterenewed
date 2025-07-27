import TransactionHistoryComponent from './transactionhistorycomponent';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: "Transaction History - Elite Global Network",
  description: "View your complete transaction history.",
  metadataBase: new URL('https://eliteglobalnetwork.com.ng'),
  alternates: {
    canonical: 'https://eliteglobalnetwork.com.ng/transactionhistory',
    languages: {
      'en-US': '/transactionhistory',
      // 'fr-FR': '/fr/compte/transactions', // Uncomment if multilingual
    },
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180' },
      { url: '/favicon/apple-touch-icon-152x152.png', sizes: '152x152' },
    ],
  },
  openGraph: {
    title: "My Transaction History | Elite Global Network",
    description: "Review all your airtime, data, and bill payments in one place. Securely accessible anytime.",
    url: "https://eliteglobalnetwork.com.ng/transactionhistory",
    siteName: "Elite Global Network",
    images: [
      {
        url: "https://eliteglobalnetwork.com.ng/elite_png.png",
        width: 1200,
        height: 630,
        alt: "User account dashboard showing transaction history",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: false, // User-specific pages shouldn't be indexed
    follow: true,
    nocache: true, // Prevent caching of sensitive data
    googleBot: {
      index: false,
      follow: true,
      noimageindex: true,
      'max-image-preview': 'none',
    },
  },
  other: {
    'privacy-policy': 'https://eliteglobalnetwork.com.ng/privacy'
  }
};

// Schema.org markup for account page
export const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Account Dashboard",
  "description": "User account management portal",
  "url": "https://eliteglobalnetwork.com.ng/transactionhistory",
  "isPartOf": {
    "@type": "WebSite",
    "name": "Elite Global Network",
    "url": "https://eliteglobalnetwork.com.ng"
  }
};


export default async function TransactionHistory() {

  const cookieStore = await cookies();
  const token = cookieStore.get('elitetoken')?.value;

  if (!token) {
    redirect('/login');
  }

    return (
        <TransactionHistoryComponent user={token} />
    )
}