import RegisterComponent from './registercomponent';

export const metadata = {
  title: "Register for an Account | Elite Global Network - Airtime, Data & Bill Payments",
  description: "Create your Elite account in 1 minute to enjoy instant airtime recharge, data purchases, and bill payments. No hidden fees - get started today!",
  metadataBase: new URL('https://eliteglobalnetwork.com.ng'),
  alternates: {
    canonical: 'https://eliteglobalnetwork.com.ng/register',
    languages: {
      'en-US': '/register',
      // 'fr-FR': '/fr/register', // Uncomment if multilingual
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
    title: "Sign Up Now | Elite Global Network - All Your Mobile Services",
    description: "Join thousands of users enjoying instant airtime, data, and bill payments. Register in under 1 minute with just your email and phone number.",
    url: "https://eliteglobalnetwork.com.ng/register",
    siteName: "Elite Global Network",
    images: [
      {
        url: "https://eliteglobalnetwork.com.ng/elite_png.pngg",
        width: 1200,
        height: 630,
        alt: "Join Elite Global Network - Register for mobile services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@EliteGlobalNet",
    creator: "@EliteGlobalNet",
    title: "Create Your Elite Account - Instant Mobile Services",
    description: "Sign up now for seamless airtime, data, and bill payments. No paperwork - just instant access!",
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
    "register for Elite",
    "create account for airtime",
    "Nigeria mobile data account",
    "sign up for bill payments",
    "instant registration",
    "no hidden fees",
    "Elite Global Network signup"
  ],
};

// Conversion-focused schema markup
export const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Account Registration",
  "description": "Secure signup process for Elite Global Network services",
  "url": "https://eliteglobalnetwork.com.ng/register",
  "potentialAction": {
    "@type": "RegisterAction",
    "target": "https://eliteglobalnetwork.com.ng/register",
    "description": "Create account for mobile services"
  }
};

export default function RegisterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RegisterComponent />
    </>
  );
}