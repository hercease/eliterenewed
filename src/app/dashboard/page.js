import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardComponent from './dashboardComponent';

export const metadata = {
  title: "Elite Dashboard | Manage Airtime, Data & Transactions",
  description: "Your secure dashboard for airtime recharge, data purchases, bill payments, and transaction history management across all Nigerian networks.",
  keywords: ["dashboard", "airtime recharge", "Nigeria mobile data", "transaction history", "Elite Global Network"],
  metadataBase: new URL('https://eliteglobalnetwork.com.ng'),
  alternates: {
    canonical: 'https://eliteglobalnetwork.com.ng/dashboard',
    languages: {
      'en-US': '/dashboard',
      // Add other languages if available
      // 'fr-FR': '/fr/dashboard',
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
    title: "Elite Dashboard | Manage Airtime, Data & Transactions",
    description: "Your secure dashboard for airtime recharge, data purchases, bill payments, and transaction history management across all Nigerian networks.",
    url: "https://eliteglobalnetwork.com.ng/dashboard",
    siteName: "Elite Global Network",
    images: [
      {
        url: "https://eliteglobalnetwork.com.ng/images/dashboard-preview.png",
        width: 1200,
        height: 630,
        alt: "Elite Global Network User Dashboard Interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elite Dashboard | Manage Airtime, Data & Transactions",
    description: "Your secure dashboard for airtime recharge, data purchases, bill payments, and transaction history management across all Nigerian networks.",
    images: {
      url: "https://eliteglobalnetwork.com.ng/images/dashboard-preview.png",
      alt: "Elite Global Network User Dashboard Interface",
    },
    creator: "@EliteGlobalNet",
  },
  robots: {
    index: false, // Typically dashboards shouldn't be indexed
    follow: true,
    nocache: true, // Important for frequently updated dashboards
    googleBot: {
      index: false,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
    },
  },
};

// Schema.org JSON-LD for rich snippets
export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Elite Dashboard',
  description: 'User dashboard for managing mobile services in Nigeria',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    category: 'DigitalService',
    url: 'https://eliteglobalnetwork.com.ng/dashboard'
  },
  provider: {
    '@type': 'Organization',
    name: 'Elite Global Network',
    url: 'https://eliteglobalnetwork.com.ng',
    logo: 'https://eliteglobalnetwork.com.ng/elite_png.png'
  }
};

export default async function Dashboard() {
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
      <DashboardComponent user={token} />
    </>
  )
}