import LoginComponent from './logincomponent';

export const metadata = {
  title: "Login to Your Account | Elite Global Network",
  description: "Securely access your Elite account to recharge airtime, buy data, pay bills, and manage transactions. Two-factor authentication supported.",
  metadataBase: new URL('https://eliteglobalnetwork.com.ng'),
  alternates: {
    canonical: 'https://eliteglobalnetwork.com.ng/login',
    languages: {
      'en-US': '/login',
      // 'fr-FR': '/fr/login', // Uncomment if multilingual
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
    title: "Secure Login | Elite Global Network",
    description: "Access your account with bank-level security to manage all your transactions in one place.",
    url: "https://eliteglobalnetwork.com.ng/login",
    siteName: "Elite Global Network",
    images: [
      {
        url: "https://eliteglobalnetwork.com.ng/elite_png.png",
        width: 1200,
        height: 630,
        alt: "Secure login portal for Elite Global Network",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@EliteGlobalNet",
    creator: "@EliteGlobalNet",
    title: "Secure Account Login | Elite Global Network",
    description: "Sign in to manage your airtime, data, and bill payments with end-to-end encryption.",
    images: {
      url: "https://eliteglobalnetwork.com.ng/elite_png.png",
      alt: "Elite Global Network Login Portal",
    },
  },
  robots: {
    index: false, // Login pages typically shouldn't be indexed
    follow: true,
    nocache: true, // Prevent caching of login pages
    googleBot: {
      index: false,
      follow: true,
      noimageindex: true,
      'max-image-preview': 'none',
    },
  },
  other: {
    'security-txt': '/.well-known/security.txt' // Recommended for compliance
  }
};

// Security-focused schema markup
export const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Login Portal",
  "description": "Secure authentication gateway",
  "url": "https://eliteglobalnetwork.com.ng/login",
  "significantLink": [
    "https://eliteglobalnetwork.com.ng/password-reset",
    "https://eliteglobalnetwork.com.ng/2fa-setup"
  ],
  "securityPolicy": "https://eliteglobalnetwork.com.ng/security"
};

export default function LoginPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LoginComponent />
    </>
  );
}