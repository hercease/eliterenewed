import KycComponent from './kyccomponent';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: "KYC Verification | Secure Account Upgrade - Elite Global Network",
  description: "Complete your KYC verification to unlock higher transaction limits and full account features.",
  metadataBase: new URL('https://eliteglobalnetwork.com.ng'),
  alternates: {
    canonical: 'https://eliteglobalnetwork.com.ng/kyc',
    languages: {
      'en-US': '/kyc',
      // 'fr-FR': '/fr/kyc', // Uncomment if multilingual
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
    title: "KYC Verification | Secure Account Upgrade - Elite Global Network",
    description: "Verify your identity to access enhanced features.",
    url: "https://eliteglobalnetwork.com.ng/kyc",
    siteName: "Elite Global Network",
    images: [
      {
        url: "https://eliteglobalnetwork.com.ng/elite_png.png",
        width: 1200,
        height: 630,
        alt: "Secure KYC verification process with Elite Global Network",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@EliteGlobalNet",
    creator: "@EliteGlobalNet",
    title: "Complete Your KYC Verification - Elite Global Network",
    description: "Upgrade your account securely with our encrypted KYC process. Required for transactions above ₦50,000.",
    images: {
      url: "https://eliteglobalnetwork.com.ng/elite_png.png",
      alt: "Elite Global Network KYC Verification",
    },
  },
  robots: {
    index: false, // Typically KYC pages shouldn't be indexed
    follow: true,
    nocache: true, // Prevent caching of sensitive pages
    googleBot: {
      index: false,
      follow: true,
      noimageindex: true,
      'max-image-preview': 'none',
    },
  },
  keywords: [
    "KYC verification Nigeria",
    "account upgrade",
    "identity verification",
    "document upload secure",
    "Elite Global Network KYC",
    "BVN verification",
    "NIN registration",
    "compliance procedure"
  ],
  other: {
    'security-txt': '/.well-known/security.txt' // Recommended for compliance
  }
};

// Schema.org markup for identity verification
export const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "KYC Verification",
  description: "Identity verification process for Elite Global Network",
  url: "https://eliteglobalnetwork.com.ng/kyc",
  securityAndPrivacyPolicy: "https://eliteglobalnetwork.com.ng/privacy",
  significantLink: [
    "https://eliteglobalnetwork.com.ng/terms",
    "https://eliteglobalnetwork.com.ng/compliance"
  ]
};

export default async function KycRegistrationPage() {
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
      <KycComponent user={token} />
    </>
  )
}