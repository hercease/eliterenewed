import ConfirmationComponent from './confirmationcomponent.js';

export const metadata = {
  title: "Confirmation Account - Elite Global Network",
  description: "Activate your account",
  metadataBase: new URL('https://eliteglobalnetwork.com.ng'),
  alternates: {
    canonical: 'https://eliteglobalnetwork.com.ng/confirmation',
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
  robots: {
    index: false, // Critical for admin pages
    follow: false,
    nocache: true, // Prevent caching of sensitive user data
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-image-preview': 'none', // Disable image previews
    },
  },
  // Minimal openGraph for security
  openGraph: {
    title: "Confirmation Account - Elite Global Network",
    description: "Activate your account",
    url: "https://eliteglobalnetwork.com.ng/",
    images: [{
      url: "https://eliteglobalnetwork.com.ng/elite_png.png",
      width: 1200,
      height: 630,
      alt: "Elite Global Account Confirmation",
    }],
  },
  // Explicitly remove Twitter cards for security
  twitter: null
};

export default async function AccountConfirmation() {

  return <ConfirmationComponent  />;
}