import ForgotComponent from './forgotcomponent';

export const metadata = {
  title: "Reset Your Password | Elite Global Network",
  description: "Securely reset your Elite account password to regain access to airtime recharge, data purchases, bill payments, and transaction management.",
  metadataBase: new URL('https://eliteglobalnetwork.com.ng'),
  alternates: {
    canonical: 'https://eliteglobalnetwork.com.ng/forgot_password',
    languages: {
      'en-US': '/forgot-password',
      // 'fr-FR': '/fr/forgot-password', // Uncomment if multilingual
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
    title: "Password Recovery | Elite Global Network",
    description: "Reset your account password with bank-level security to regain access to your transaction dashboard.",
    url: "https://eliteglobalnetwork.com.ng/forgot_password",
    siteName: "Elite Global Network",
    images: [
      {
        url: "https://eliteglobalnetwork.com.ng/elite_png.png",
        width: 1200,
        height: 630,
        alt: "Password recovery portal for Elite Global Network",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@EliteGlobalNet",
    creator: "@EliteGlobalNet",
    title: "Password Reset | Elite Global Network",
    description: "Recover access to your account and manage your airtime, data, and bill payments securely.",
    images: {
      url: "https://eliteglobalnetwork.com.ng/elite_png.png",
      alt: "Elite Global Network Password Recovery",
    },
  },
  robots: {
    index: false, // Password reset pages shouldn't be indexed
    follow: true,
    nocache: true, // Prevent caching of password reset pages
    googleBot: {
      index: false,
      follow: true,
      noimageindex: true,
      'max-image-preview': 'none',
    },
  },
  other: {
    'security-txt': '/.well-known/security.txt'
  }
};

// Security-focused schema markup for password reset
export const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Password Recovery Portal",
  "description": "Secure password reset and account recovery gateway",
  "url": "https://eliteglobalnetwork.com.ng/forgot_password",
  "significantLink": [
    "https://eliteglobalnetwork.com.ng/login",
    "https://eliteglobalnetwork.com.ng/register"
  ],
  "securityPolicy": "https://eliteglobalnetwork.com.ng/security"
};

export default function ForgotPasswordPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ForgotComponent />
    </>
  );
}