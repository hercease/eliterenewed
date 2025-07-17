 import LoginComponent from './logincomponent';

export const metadata = {
  title: "Elite | Login",
  description: "Recharge all you want",
  metadataBase: new URL('https://eliteglobalnetwork.com.ng'), // Required for absolute URLs
  alternates: {
    canonical: '/login' // Canonical URL
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
    title: "Elite | Login",
    description: "Welcome back",
    url: "https://eliteglobalnetwork.com.ng/login",
    siteName: "Elite Global Network",
    images: [
      {
        url: "https://eliteglobalnetwork.com.ng/elite_png.png", // Absolute URL
        width: 1200,
        height: 630,
        alt: "Elite Global Network User Login Page",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elite | Login",
    description: "Welcome back",
    images: {
      url: "https://eliteglobalnetwork.com.ng/elite_png.png", // Absolute URL
      alt: "Elite Global Network User Login Page",
    },
    creator: "@EliteGlobalNet", // Optional Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
};

export default function LoginPage(){
    return <LoginComponent  />;
}